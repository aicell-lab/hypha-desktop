import contextFactory from "contexts/contextFactory";
import { useFileSystem } from "contexts/fileSystem";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProcesses } from "../process";
import { HyphaCore } from "hypha-core";

const useHyphaCoreContextState = (): HyphaCore | undefined => {
  const [hyphaCore, setHyphaCore] = useState<HyphaCore | undefined>();
  const [coreReady, setCoreReady] = useState<boolean>(false);
  const [fileSystemReady, setFileSystemReady] = useState<boolean>(false);
  const [startupComplete, setStartupComplete] = useState<boolean>(false);

  const { readFile, readdir, exists } = useFileSystem();
  const { open } = useProcesses();
  const coreRef = useRef<HyphaCore | null>(null);

  // Start the Hypha core
  useEffect(() => {
    if (!coreRef.current && !coreReady) {
      console.log("Starting Hypha Core...");
      const core = new HyphaCore();
      core.on("add_window", (config: any) => {
        config.window_id = config.window_id || `window-container-${Date.now().toString(36)}`;
        open("HyphaWindow", { url: config.window_id });
      });

      core.start().then(() => {
        console.log("Hypha Core started successfully!");
        coreRef.current = core;
        setHyphaCore(core);
        setCoreReady(true);
      }).catch(() => {
        console.error("Failed to start Hypha Core");
      });
    }
  }, [coreReady, open]);

  // Check if the file system is ready
  useEffect(() => {
    const checkFileSystem = async () => {
      if (await exists("/Users/Public/hypha")) {
        setFileSystemReady(true);
      } else {
        console.warn("File system not ready, retrying...");
      }
    };

    if (!fileSystemReady) {
      checkFileSystem();
    }
  }, [fileSystemReady, exists]);

  // Run startup logic when both the core and file system are ready
  useEffect(() => {
    if (coreReady && fileSystemReady && !startupComplete && hyphaCore) {
      const loadStartupApps = async () => {
        try {
          if (!hyphaCore || !hyphaCore.api) {
            throw new Error("Hypha core not ready");
          }
          const apps = await readdir("/Users/Public/hypha");
          console.log(`Loading ${apps.length} startup hypha apps`);
          for (const plugin of apps) {
            const url = `/Users/Public/hypha/${plugin}`;
            const pluginContent = await readFile(url);
            const p = await hyphaCore.api.loadApp({ src: pluginContent.toString() });
            if (p && p.setup) {
              await p.setup();
            }
            if (p && p.run) await p.run({ config: {}, data: {} });

          }
          console.log(`Successfully loaded ${apps.length} startup hypha apps`);
          setStartupComplete(true);
        } catch (e) {
          console.error("Error loading startup apps:", e);
        }
      };

      loadStartupApps();
    }
  }, [coreReady, fileSystemReady, startupComplete, readdir, readFile, hyphaCore]);

  const memoHyphaCore = useMemo<HyphaCore | undefined>(() => hyphaCore, [hyphaCore]);

  return memoHyphaCore;
};

const { Provider, useContext: useHyphaCore } = contextFactory(useHyphaCoreContextState);

export { Provider as HyphaProvider, useHyphaCore };
