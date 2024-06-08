declare module "imjoy-core" {
  class ImJoy {
    constructor(options: any);
    start(options: any): Promise<void>;
    api: any;
    pm: any;
  }
}
