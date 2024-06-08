import contextFactory from "contexts/contextFactory";
import { useFileSystem } from "contexts/fileSystem";
// import useAsyncFs from "contexts/fileSystem/useAsyncFs";
import { useEffect, useMemo, useState } from "react";
// import { loadFiles } from "utils/functions";
import { useProcesses } from "../process";

// type ImJoyType
import type { ImJoy as ImJoyType } from "imjoy-core";

export type AgentConfig = {
  name: string;
  type: string;
  system: string;
  work_dir: string;
};

function randId() {
  return Math.random().toString(36).substr(2, 10);
}

// let imjoyScriptLoaded = false;
const useImJoyContextState = (): ImJoyType | undefined => {
  const [imjoy, setImJoy] = useState<ImJoyType | undefined>();
  const [imjoyCore, setImJoyCore] = useState<any>();
  const fileSystem = useFileSystem() as { [key: string]: any };
  // const { fs: ffs } = useAsyncFs();
  const { open } = useProcesses();

  type FileSystemContextState = {
    [key: string]: Function;
  };

  const fs: FileSystemContextState = {};

  for (const key of Object.keys(fileSystem)) {
    fs[key] = (_: any, ...args: any[]) => fileSystem[key](...args);
  }
  useEffect(() => {
    async function createWindow(_plugin: any, config: any) {
      let output;
      if (_plugin && _plugin.config.namespace) {
        if (_plugin.config.namespace) {
          const outputContainer = document.getElementById(
            "output_" + _plugin.config.namespace
          );
          if (
            outputContainer &&
            !config.dialog &&
            (!config.window_id || !document.getElementById(config.window_id))
          ) {
            output = document.createElement("div");
            output.id = randId();
            output.classList.add("imjoy-window");
            outputContainer.style.height = "600px";
            outputContainer.appendChild(output);
            config.window_id = output.id;
          }
        }
      } else {
        config.window_id = `ImJoyWindow-container-${Date.now().toString(36)}`;
        open("ImJoyWindow", { url: config.window_id });
      }
      let w;
      if (!imjoy) {
        throw new Error("ImJoy is not ready yet.")
      }
      // fallback to grid
      if (

        (config.type && config.type.startsWith("imjoy/")) ||
        config.type === "joy"
      ) {
        const grid = await imjoy.pm.createWindow(_plugin, {
          src: "https://grid.imjoy.io/#/app",
          window_id: config.window_id,
          namespace: config.namespace,
        });
        w = await grid.createWindow(config);
      } else {
        // w = await window.imjoy.pm.createWindow(_plugin, config)
        // if (!config.window_manager_container) config.dialog = true;
        w = imjoy.pm.createWindow(_plugin, config);
      }

      return w;
    }

    if (imjoyCore) return;
    import('imjoy-core').then((icore) => {
      setImJoyCore(icore);
      const ij = new icore.ImJoy({
        imjoy_api: {
          createWindow,
          async showDialog(_plugin: any, config: any) {
            config.dialog = true;
            return await createWindow(_plugin, config);
          },
          fs,
          async getcwd(_plugin: any) {
            return _plugin.config.runButtonContext.config.cwd;
          },
        },
        // default_rpc_base_url: "/Program Files/imjoy/imjoy-core/",
        // default_base_frame: "/Program Files/imjoy/base_frame.html",
        // imjoy config
      });
      console.log(ij);
      ij.start({ workspace: "default" }).then(() => {
        ij.api.log("ImJoy Core started successfully!");
      });
      setImJoy(ij);
    });
  }, []);

  const memoImjoy = useMemo<ImJoyType | undefined>(() => {
    return imjoy;
  }, [imjoy]);

  return memoImjoy;
};

const { Provider, useContext: useImJoy } = contextFactory(useImJoyContextState);

export { Provider as ImJoyProvider, useImJoy };
