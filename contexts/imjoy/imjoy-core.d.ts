declare module "imjoy-core" {
  type Context = {
    config: any;
    data: any;
  };
  type PluginAPI = {
    setup(): Promise<void>;
    run?(ctx: Context);
  };
  type ImJoyAPI = {
    loadPlugin(options: any): Promise<PluginAPI>;
    showMessage(msg: any): Promise<void>;
    alert(msg: any): Promise<void>;
    createWindow(options: any): Promise<any>;
    showDialog(options: any): Promise<any>;
    log(msg: any): Promise<void>;
  };
  class ImJoy {
    constructor(options: any);
    start(options: any): Promise<void>;
    api: ImJoyAPI;
    pm: any;
  }
}
