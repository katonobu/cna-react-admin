import { webSerialPortType, responseType, rxLineNumType, notificationType } from '@/app/worker/src/workerHandler'
import {webSerialWorker} from '@/app/worker/src/webSerialWorkerProvider'

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
    resolve:(value:responseType)=>void;
    reject:(reasone:responseType)=>void;
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

export const portsStore:MicroStore<webSerialPortType[]> = new MicroStore([])
export const openSttStore:MicroStore<boolean>[] = []
export const rxLineNumStore:MicroStore<rxLineNumType>[] = []

const resolverMap:Map<number, resolver> = new Map()

export const workerOnMessageHandler = (e: MessageEvent<string>) => {
    const parsedMessage = JSON.parse(e.data)
    if ('rspId' in parsedMessage) {
        const response:responseType = parsedMessage
        if (resolverMap.has(response.rspId)) {
            const {resolve, reject} = resolverMap.get(response.rspId) ?? {resolve:()=>{}, reject:()=>{}}
            resolverMap.delete(response.rspId)
            if ('error' in response) {
                reject(response)
            } else if ('data' in response) {
                resolve(response)
            } else {
                reject(response)
            }
        }
    } else if ('notId' in parsedMessage) {
        // notification
//        console.log("Notification", response)
        const notification:notificationType = parsedMessage
        if ('msg' in notification) {
            if (notification.msg === "PortsChanged") {
                if ('ports' in notification && notification.ports !== undefined) {
                    portsStore.update(notification.ports)
                    if ('maxId' in notification && notification.maxId !== undefined) {
                        const len = notification.maxId
                        if (openSttStore.length < len) {
                            for(let portId = openSttStore.length; portId < len; portId++) {
                                const port = notification.ports.find((ele:webSerialPortType)=>parseInt(ele.idStr, 10) === portId)
                                openSttStore[portId] = new MicroStore(port?.isOpen ?? false)
                                rxLineNumStore[portId] = new MicroStore({"totalLines": 0,"updatedLines": 0})
                            }
                        }
                    } else {
                        console.error(".maxId dosen't exist")
                    }
                } else {
                    console.error(".ports dosen't exist")
                }
            } else if (notification.msg === "IsOpen") {
                if ('portId' in notification && notification.portId !== undefined) {
                    const portId = notification.portId
                    if ('stt' in notification && notification.stt !== undefined) {
                        openSttStore[portId].update(notification.stt)
                    } else {
                        console.error(".stt dosen't exist")
                    }
                } else {
                    console.error(".portId dosen't exist")
                }
            } else if (notification.msg === "DataRx") {
                if ('portId' in notification && notification.portId !== undefined) {
                    const portId = notification.portId
                    if ('rxLineNum' in notification && notification.rxLineNum !== undefined) {
                        rxLineNumStore[portId].update(notification.rxLineNum)
                    } else {
                        console.error(".rxLineNum dosen't exist")
                    }
                } else {
                    console.error(".portId dosen't exist")
                }
            }
        }
    }
};

let fetechSerialId:number = 0
export const fetchSerial = (resource:string, option:fetchSerialOption):Promise<responseType>=>{
    return new Promise((resolve, reject)=>{
        resolverMap.set(fetechSerialId, {resolve, reject})
        webSerialWorker?.postMessage(JSON.stringify({...option, path:resource, reqId:fetechSerialId}));
        fetechSerialId += 1
    })
}
