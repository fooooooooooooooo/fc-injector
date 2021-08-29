import { IpcRenderer } from "electron";
import { IpcRendererEvent } from "electron";

interface FoopcRenderer {
  send: (channel: string, data: any) => void;
  receive: (channel: string, callback: (data: any) => any) => void;
}

export declare global {
  interface Window {
    ipcRenderer: FoopcRenderer;
    injectionState: Ref<number>;
  }
}