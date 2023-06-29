"use client"
// MIT License
//
// Copyright (c) 2021-2023 Nobuo Kato (katonobu4649@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
import { vendorsList } from './vendors';

interface sttCtrlSignalsType {
  dataCarrierDetect?: boolean | null;
  clearToSend?: boolean | null;
  ringIndicator?: boolean | null;
  dataSetReady?: boolean | null;
  dataTerminalReady?: boolean | null;
  requestToSend?: boolean | null;
}

interface vendersListType {
  name: string;
  field_vid: string;
}

export default (() => {
  class MicroStore <T> {
    private obj: T;
    private callbacks: Set<() => void>;

    constructor(initObj: T){
      this.obj = initObj
      this.callbacks = new Set<() => void>();
    }
    subscribe(cb: () => void): () => boolean {
      this.callbacks.add(cb);
      return () => this.callbacks.delete(cb);
    }
    update(newObj: T){
      this.obj = newObj
      this.callbacks.forEach(cb => cb())
    }
    get(): T{
      return this.obj
    }
  }

  class WebSerialPort{
    static idCount: number = 0;

    readonly port: SerialPort | null;
    readonly idStr: string;
    readonly venderName: string;
    readonly pid: number;
    readonly vid: number;
    isOpen: boolean;
    private isOpenCallbacks: Set<() => void>;
    signals: sttCtrlSignalsType;
    private signalsCallbacks: Set<() => void>;
    errorStr: string;
    private errorStrCallbacks: Set<() => void>;
    rx: Uint8Array | null;
    private rxCallbacks: Set<() => void>;
    private reader:
      | ReadableStreamDefaultReader<Uint8Array>
      | ReadableStreamBYOBReader
      | undefined;

    static formatPortInfo(info: SerialPortInfo): string{
      if (!info || !info.usbVendorId) {
        return 'Port with no info';
      }
      const vendorName =
        vendorsList.find(
          (d: vendersListType) => parseInt(d.field_vid) === info.usbVendorId
        )?.name ?? 'Unknown Vendor';
      return vendorName;
    }
  
    constructor(port: SerialPort | null) {
      const portInfo: SerialPortInfo = port?port.getInfo():{usbVendorId:0,usbProductId:0} as SerialPortInfo;
      this.port = port;
      this.idStr = WebSerialPort.idCount.toString(10)
      this.venderName = port?WebSerialPort.formatPortInfo(portInfo):'Select new port...';
      this.pid = portInfo?.usbProductId ?? 0;
      this.vid = portInfo?.usbVendorId ?? 0;
      this.isOpen = false;
      this.isOpenCallbacks = new Set();
      this.signals = {
        dataCarrierDetect:null,
        clearToSend: null,
        ringIndicator: null,
        dataSetReady: null,
        dataTerminalReady: null,
        requestToSend: null,
      };
      this.signalsCallbacks = new Set();
      this.errorStr = '';
      this.errorStrCallbacks = new Set();
      this.rx = null;
      this.rxCallbacks = new Set();
      this.reader = undefined;
      WebSerialPort.idCount++;
    }

    subscribeIsOpen(cb: () => void): () => boolean {
      this.isOpenCallbacks.add(cb);
      return () => this.isOpenCallbacks.delete(cb);
    }
    private updateIsOpen(newStt: boolean) {
      this.isOpen = newStt;
      this.isOpenCallbacks.forEach((cb) => cb());
    }

    subscribeSignals(cb: () => void): () => boolean {
      this.signalsCallbacks.add(cb);
      return () => this.signalsCallbacks.delete(cb);
    }
    private updateSignals(newSignals: sttCtrlSignalsType) {
      this.signals = newSignals;
      this.signalsCallbacks.forEach((cb) => cb());
    }

    subscribeErrorStr(cb: () => void): () => boolean {
      this.errorStrCallbacks.add(cb);
      return () => this.errorStrCallbacks.delete(cb);
    }
    private updateErrorStr(newErrorStr: string) {
      this.errorStr = newErrorStr;
      this.errorStrCallbacks.forEach((cb) => cb());
    }

    subscribeRx(cb: () => void): () => boolean {
      this.rxCallbacks.add(cb);
      return () => this.rxCallbacks.delete(cb);
    }
    private updateRx(newRx: Uint8Array | null) {
      this.rx = newRx;
      this.rxCallbacks.forEach((cb) => cb());
    }

    async open(options: SerialOptions): Promise<string> {
      let errStr: string = '';
      if (this.port) {
        try {
          await this.port.open(options);
        } catch (e) {
          errStr = 'Error at oepn.';
          if (e instanceof Error) {
            errStr += e.message;
          }
        }
      } else {
        errStr = 'port is falsy';
      }
      if (errStr) {
        console.error(errStr);
        this.updateErrorStr(errStr);
      } else {
        this.updateIsOpen(true);
      }
      return errStr;
    }

    async close(): Promise<string> {
      let errStr: string = '';
      if (this.port) {
        this.updateIsOpen(false);
        if (this.reader) {
          await this.reader.cancel();
        }
        try {
          await this.port.close();
        } catch (e) {
          errStr = 'Error at oepn.';
          if (e instanceof Error) {
            errStr += e.message;
          }
        }
      } else {
        errStr = 'port is falsy';
      }
      if (errStr) {
        console.error(errStr);
        this.updateErrorStr(errStr);
      }
      return errStr;
    }

    async send(msg: Uint8Array): Promise<string> {
      let errStr: string = '';
      if (this.isOpen && this.port) {
        if (this.port.writable) {
          try {
            const writer = this.port.writable.getWriter();
            await writer.write(msg);
            writer.releaseLock();
          } catch (e) {
            errStr = 'Error while writing message.';
            if (e instanceof Error) {
              errStr += e.message;
            }
          }
        } else {
          errStr = 'port is not writable';
        }
      }
      return errStr;
    }

    async receive(byteLength: number, timeoutMs: number): Promise<any> {
      if (byteLength === 0 && timeoutMs === 0) {
        // read infinig until close
        const bufferSize = 8 * 1024; // 8kB
        // if try to close, this.isOpen become false
        while (this.isOpen && this.port && this.port.readable) {
          try {
            try {
              this.reader = this.port.readable.getReader({ mode: 'byob' });
            } catch {
              this.reader = this.port.readable.getReader();
            }

            let buffer = null;
            for (;;) {
                // eslint-disable-next-line
                const { value, done } = await (async () => {
                if (this.reader instanceof ReadableStreamBYOBReader) {
                  if (!buffer) {
                    buffer = new ArrayBuffer(bufferSize);
                  }
                  const { value, done } = await this.reader.read(
                    new Uint8Array(buffer, 0, bufferSize)
                  );
                  buffer = value?.buffer;
                  return { value, done };
                } else {
                  if (this.reader) {
                    return await this.reader.read();
                  } else {
                    return { value: null, done: true };
                  }
                }
              })();

              if (value) {
                this.updateRx(value);
              }
              if (done) {
                break;
              }
            }
          } catch (e) {
            console.error(e);
            if (e instanceof Error) {
              this.updateErrorStr(e.message);
            }
          } finally {
            if (this.reader) {
              this.reader.releaseLock();
              this.reader = undefined;
            }
          }
        }

        if (this.isOpen && this.port) {
            try {
            await this.port.close();
          } catch (e) {
            console.error(e);
            if (e instanceof Error) {
              this.updateErrorStr(e.message);
            }
          }
          this.updateIsOpen(false);
        }
      } else {
        // read until specified byte reaches or timeout.
        // ToDo:実装する
      }
    }

    async setSignal(signals: SerialOutputSignals): Promise<string> {
      let errStr: string = '';
      if (this.port) {
        try {
          await this.port.setSignals(signals);
        } catch (e) {
          if (e instanceof Error) {
            errStr = e.message;
          } else {
            errStr = 'Error at setSignal';
          }
        }
      } else {
        errStr = 'port is falsy';
      }
      if (errStr) {
        console.error(errStr);
        this.updateErrorStr(errStr);
      } else {
        this.updateSignals({ ...this.signals, ...signals });
      }
      return errStr;
    }

    async getSignal(): Promise<string> {
      let errStr: string = '';
      let signals = {};
      if (this.port) {
        try {
          signals = await this.port.getSignals();
        } catch (e) {
          if (e instanceof Error) {
            errStr = e.message;
          } else {
            errStr = 'Error at getSignal';
          }
        }
      } else {
        errStr = 'port is falsy';
      }
      if (errStr) {
        console.error(errStr);
        this.updateErrorStr(errStr);
      } else {
        this.updateSignals({ ...this.signals, ...signals });
      }
      return errStr;
    }

    async forget(): Promise<string> {
      let errStr: string = '';
      if (!this.isOpen && this.port) {
        try {
          this.port.forget();
        } catch (e) {
          if (e instanceof Error) {
            errStr = e.message;
          } else {
            errStr = 'Error at forget';
          }
        }
      } else {
        return 'forget() can be called while not open';
      }
      if (errStr) {
        console.error(errStr);
        this.updateErrorStr(errStr);
      } else {
        removeWebSerialStore(this.port);
      }
      return errStr;
    }
  }

  ///////////////////////////////////////////////////////////
  const internalMap: Map<SerialPort | null, WebSerialPort> = new Map()
  const webSerialStore = new MicroStore(internalMap)

  const addWebSerialStore = (port:SerialPort | null):WebSerialPort => {
    console.log("addWebSerialStore()")
    let ret:WebSerialPort | undefined = internalMap.get(port)
    if(!ret) {
      const wsp = new WebSerialPort(port);
      internalMap.set(port, wsp);
      portObjs = Array.from(webSerialStore.get().values())
      webSerialStore.update(internalMap);
      console.log(webSerialStore.get())
      ret = wsp;
    }
    return ret
  }
  const removeWebSerialStore = (port:SerialPort) => {
    console.log("removeWebSerialStore()")
    if (internalMap.has(port)){
      internalMap.delete(port);
      portObjs = Array.from(webSerialStore.get().values())
      webSerialStore.update(internalMap)
      console.log(webSerialStore.get())
    }
  }

  let portObjs: WebSerialPort[] = [];
  addWebSerialStore(null);
  navigator.serial
    .getPorts()
    .then((ports) =>{
      ports.forEach((port:SerialPort) => addWebSerialStore(port))
    });

  const create = async (
    requestPortFilters: SerialPortRequestOptions
  ): Promise<WebSerialPort | null> => {
    try {
      const port:SerialPort = await navigator.serial.requestPort(requestPortFilters);
      return addWebSerialStore(port);
    } catch (e) {
      return null;
    }
  };
  navigator.serial.addEventListener('connect', (event: Event) =>{
    const port:SerialPort | null = event.target as SerialPort;
    if(port) {
      addWebSerialStore(port);
    } else {
      // ToDo:イベント発火したけどportに値が入っていない。
    }
  });
  navigator.serial.addEventListener('disconnect', (event: Event) => {
    const port:SerialPort | null = event.target as SerialPort;
    if(port) {
      removeWebSerialStore(port);
    } else {
      // ToDo:イベント発火したけどportに値が入っていない。
    }
  });
  const subscribe = (cb: () => void): (() => boolean) => {
    return webSerialStore.subscribe(cb);
  };

  const getPorts = (): WebSerialPort[] => portObjs;
  const getPortById = (idStr:string | number):WebSerialPort | undefined => {
    if (typeof idStr === 'number') {
      const stredId = idStr.toString(10)
      return portObjs.find((po)=>po.idStr === stredId)
    } else {
      return portObjs.find((po)=>po.idStr === idStr)
    }
  }
  
  return {
    getPorts,
    subscribe,
    create,
    getPortById
  };
})();
