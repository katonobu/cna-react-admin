import {worker} from '../../AppRoot'

interface fetchSerialOption {
    method:string;
    headers?:object;
    body?:object;
}

export interface fetchSerialObject extends fetchSerialOption{
    path:string;
    reqId:number;
}

interface resolver {
    resolve:(value:unknown)=>void;
    reject:(reasone?:any)=>void;
}

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

export const portsStore:MicroStore<any[]> = new MicroStore([])
export const openSttStore:MicroStore<boolean>[] = []
export const rxLineNumStore:MicroStore<any>[] = []

const resolverMap:Map<number, resolver> = new Map()

export const workerOnMessageHandler = (e: MessageEvent<string>) => {
    const response = JSON.parse(e.data)
    if ('rspId' in response) {
        if (resolverMap.has(response.rspId)) {
            const {resolve, reject} = resolverMap.get(response.rspId) ?? {resolve:()=>{}, reject:()=>{}}
            resolverMap.delete(response.rspId)
            if ('error' in response) {
                reject(response)
            } else {
                resolve(response)
            }
        }
    } else if ('notId' in response) {
        // notification
//        console.log("Notification", response)
        if ('msg' in response) {
            if (response.msg === "PortsChanged") {
                portsStore.update(response.ports)
                const len = response.maxId
                if (openSttStore.length < len) {
                    for(let portId = openSttStore.length; portId < len; portId++) {
                        const port = response.ports.find((ele:any)=>parseInt(ele.idStr, 10) === portId)
                        openSttStore[portId] = new MicroStore(port?.isOpen ?? false)
                        rxLineNumStore[portId] = new MicroStore({"totalLines": 0,"updatedLines": 0})
                    }
                }
            } else if (response.msg === "IsOpen") {
                const portId = response.portId
                openSttStore[portId].update(response.stt)
            } else if (response.msg === "DataRx") {
                const portId = response.portId
                rxLineNumStore[portId].update(response.rxLines)
            }
        }
    }
};

let fetechSerialId:number = 0
export const fetchSerial = (resource:string, option:fetchSerialOption)=>{
    return new Promise((resolve, reject)=>{
        resolverMap.set(fetechSerialId, {resolve, reject})
        worker.postMessage(JSON.stringify({...option, path:resource, reqId:fetechSerialId}));
        fetechSerialId += 1
    })
}

