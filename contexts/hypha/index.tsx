import contextFactory from "contexts/contextFactory";
import { useFileSystem } from "contexts/fileSystem";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProcesses } from "../process";
import { HyphaServer, connectToServer } from "hypha-core";

const useHyphaContextState = (): HyphaServer | undefined => {
  const [hyphaServer, setHyphaServer] = useState<HyphaServer | undefined>();
  const [serverReady, setServerReady] = useState<boolean>(false);
  const [fileSystemReady, setFileSystemReady] = useState<boolean>(false);
  const [startupComplete, setStartupComplete] = useState<boolean>(false);

  const { readFile, readdir, exists } = useFileSystem();
  const { open } = useProcesses();
  const serverRef = useRef<HyphaServer | null>(null);

  // Start the Hypha server
  useEffect(() => {
    if (!serverRef.current && !serverReady) {
      console.log("Starting Hypha Core...");
      const server = new HyphaServer();
      server.on("add_window", (config: any) => {
        config.window_id = config.window_id || `window-container-${Date.now().toString(36)}`;
        open("HyphaWindow", { url: config.window_id });
      });

      server.start().then(() => {
        console.log("Hypha Core started successfully!");
        serverRef.current = server;
        connectToServer({ server, workspace: "default" }).then((api: any) => {
          server.api = api;
          setHyphaServer(server);
          setServerReady(true);
        });
      }).catch(() => {
        console.error("Failed to start Hypha Core");
      });
    }
  }, [serverReady, open]);

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

  // Run startup logic when both the server and file system are ready
  useEffect(() => {
    if (serverReady && fileSystemReady && !startupComplete && hyphaServer) {
      const loadStartupApps = async () => {
        try {
          if (!hyphaServer || !hyphaServer.api) {
            throw new Error("Hypha server not ready");
          }
          const apps = await readdir("/Users/Public/hypha");
          console.log(`Loading ${apps.length} startup hypha apps`);
          for (const plugin of apps) {
            const url = `/Users/Public/hypha/${plugin}`;
            const pluginContent = await readFile(url);
            const p = await hyphaServer.api.loadApp({ src: pluginContent.toString() });
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
  }, [serverReady, fileSystemReady, startupComplete, readdir, readFile, hyphaServer]);

  const memoHyphaServer = useMemo<HyphaServer | undefined>(() => hyphaServer, [hyphaServer]);

  return memoHyphaServer;
};

const { Provider, useContext: useHypha } = contextFactory(useHyphaContextState);

export { Provider as HyphaProvider, useHypha };
