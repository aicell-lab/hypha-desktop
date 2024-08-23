importScripts("https://cdn.jsdelivr.net/npm/hypha-rpc@0.20.28/dist/hypha-rpc-websocket.min.js");
hyphaWebsocketClient.setupLocalClient({ enable_execution: true }).then((api) => {
    console.log("Hypha WebWorker initialized.", api)
}).catch(console.error);
