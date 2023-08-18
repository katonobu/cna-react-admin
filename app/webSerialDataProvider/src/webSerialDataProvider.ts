import {useSyncExternalStore} from 'react'
import {fetchSerial, portsStore, openSttStore, rxLineNumStore} from '@/app/webSerialDataProvider/src/webSerialWorkerAdapter'
import { webSerialPortType, responseType, rxLineBuffRspType } from '@/app/worker/src/workerHandler'

// useSerialPorts
const getSerialPorts = () => portsStore.get()
const subscribeSerialPorts = (callback:()=>void) => {
    const unsubscribe = portsStore.subscribe(callback)
    return ()=>unsubscribe()
}
export const useSerialPorts = () => useSyncExternalStore(subscribeSerialPorts, getSerialPorts)

// useIsOpen
const getIsOpenBuilder = (id:string) => ()=>openSttStore[parseInt(id,10)].get()
const subscribeIsOpenBuilder = (id:string) => (callback:()=>void) => {
    const unsubscribe = openSttStore[parseInt(id,10)].subscribe(callback)
    return ()=>unsubscribe()
}
export const useIsOpen = (id:string) => useSyncExternalStore(subscribeIsOpenBuilder(id), getIsOpenBuilder(id))

// useRxBufferLen
const getLineNumBuilder = (id:string) => ()=>rxLineNumStore[parseInt(id,10)].get()
const subscribeLineNumBuilder = (id:string) => (callback:()=>void) => {
    const unsubscribe = rxLineNumStore[parseInt(id,10)].subscribe(callback)
    return ()=>unsubscribe()
}
export const useRxBufferLen = (id:string) => useSyncExternalStore(subscribeLineNumBuilder(id), getLineNumBuilder(id))

/*
- /ports
    - GET:useGetPorts
    - PATCH:useCreate
- /ports/id
    - GET:useGetPort
    - DELETE:useDelete
- /ports/id/open
    - POST:useOpen
- /ports/id/close
    - POST:useClose
- /ports/id/data
    - POST:useSend
- /ports/id/rxdata
    - GET:getRxLineBUffers()
    - POST:useReceive
*/

//interface responseType

export const getPorts = ():Promise<webSerialPortType[]> => {
    return fetchSerial("/ports", {method:'GET'})
    .then((rsp:responseType)=>{
        if ('error' in rsp) {
            return Promise.reject(rsp.error as string)
        } else if ('data' in rsp) {
            return rsp.data as webSerialPortType[]
        } else {
            return Promise.reject("Both 'error' and 'data' field not exist in response")
        }
    })
    .catch((e)=>(Promise.reject(e)))
}

export const createPort = ():Promise<webSerialPortType> => {
    return fetchSerial("/ports", {method:'PATCH'})
    .then((rsp:responseType)=>{
        if ('error' in rsp) {
            return Promise.reject(rsp.error as string)
        } else if ('data' in rsp) {
            return rsp.data as webSerialPortType
        } else {
            return Promise.reject("Both 'error' and 'data' field not exist in response")
        }
    })
    .catch((e)=>(Promise.reject(e)))
}

export const getPort = (id:string): Promise<webSerialPortType> => {
    return fetchSerial("/ports/"+id, {method:'GET'})
    .then((rsp)=>{
        if ('error' in rsp) {
            return Promise.reject(rsp.error as string)
        } else if ('data' in rsp) {
            return rsp.data as webSerialPortType
        } else {
            return Promise.reject("Both 'error' and 'data' field not exist in response")
        }
    })
    .catch((e)=>(Promise.reject(e)))
}

export const useOpen = (id:string) => {
    return (options: SerialOptions): Promise<string> => {
        return fetchSerial("/ports/"+id+"/open", {method:'POST', body:{options}})
        .then((rsp)=>{
            if ('error' in rsp) {
                return Promise.reject(rsp.error as string)
            } else {
                return ""
            }
        })
        .catch((e)=>(Promise.reject(e)))
    }
}

const base64EncodeUint8Array = (data: Uint8Array): string => {
    let binary = '';
    for (let i = 0; i < data.length; i++) {
        binary += String.fromCharCode(data[i]);
    }
    return btoa(binary);
};
export const useSend = (id:string) => {
    return (data:Uint8Array):Promise<string> => {
        return fetchSerial("/ports/"+id+"/data", {method:'POST', body:{data:base64EncodeUint8Array(data)}})
        .then((rsp)=>{
            if ('error' in rsp) {
                return Promise.reject(rsp.error as string)
            } else {
                return ""
            }
        })
        .catch((e)=>(Promise.reject(e)))
    }
}

export const useReceieve = (id:string) => {
    return (byteLength: number, timeoutMs: number, newLineCode?: string | RegExp): Promise<string> => {
        return fetchSerial("/ports/"+id+"/rxdata", {method:'POST', body:{byteLength, timeoutMs, newLineCode}})
        .then((rsp)=>{
            if ('error' in rsp) {
                return Promise.reject(rsp.error as string)
            } else {
                return ""
            }
        })
        .catch((e)=>(Promise.reject(e)))
    }
}

export const getPage = (id:string, page:number, perPage:number):Promise<rxLineBuffRspType> => {
    const body = {id, page, perPage}
    return fetchSerial("/ports/"+id + "/rxdata", {method:'GET', body})
    .then((rsp)=>{
        if ('error' in rsp) {
            return Promise.reject(rsp.error as string)
        } else {
            return rsp.data as rxLineBuffRspType
        }
    })
    .catch((e)=>(Promise.reject(e)))
}

export const useClose = (id:string) => {
    return (): Promise<string> => {
        return fetchSerial("/ports/"+id+"/close", {method:'POST'})
        .then((rsp)=>{
            if ('error' in rsp) {
                return Promise.reject(rsp.error as string)
            } else {
                return ""
            }
        })
        .catch((e)=>(Promise.reject(e)))
    }
}

export const deletePort = (id:string): Promise<string> => {
    return fetchSerial("/ports/"+id, {method:'DELETE'})
    .then((rsp)=>{
        if ('error' in rsp) {
            return Promise.reject(rsp.error as string)
        } else {
            return ""
        }
    })
    .catch((e)=>(Promise.reject(e)))
}

export const useGetPorts = ()=>getPorts
export const useCreate   = ()=>createPort
export const useGetPort  = ()=>getPort
export const useGetPage  = ()=>getPage
export const useDelete   = ()=>deletePort
