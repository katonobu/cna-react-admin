import {useSyncExternalStore} from 'react'
import {fetchSerial, portsStore, openSttStore, rxLineNumStore} from '@/app/webSerialDataProvider/src/webSerialWorkerAdapter'

// useSerialPorts
const getSerialPorts = () => portsStore.get()
const subscribeSerialPorts = (callback:any) => {
    const unsubscribe = portsStore.subscribe(callback)
    return ()=>unsubscribe()
}
export const useSerialPorts = () => useSyncExternalStore(subscribeSerialPorts, getSerialPorts)

// useIsOpen
const getIsOpenBuilder = (id:string) => ()=>openSttStore[parseInt(id,10)].get()
const subscribeIsOpenBuilder = (id:string) => (callback:any) => {
    const unsubscribe = openSttStore[parseInt(id,10)].subscribe(callback)
    return ()=>unsubscribe()
}
export const useIsOpen = (id:string) => useSyncExternalStore(subscribeIsOpenBuilder(id), getIsOpenBuilder(id))

// useRxBufferLen
const getLineNumBuilder = (id:string) => ()=>rxLineNumStore[parseInt(id,10)].get()
const subscribeLineNumBuilder = (id:string) => (callback:any) => {
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

export const useGetPorts = () => {
    return (): Promise<any> => {
        return fetchSerial("/ports", {method:'GET'})
        .then((rsp)=>{
            if ('error' in rsp) {
                return Promise.reject(rsp.error as string)
            } else {
                return rsp.data
            }
        })
        .catch((e)=>(Promise.reject(e)))
    }
}

export const useCreate = () => {
    return (): Promise<any> => {
        return fetchSerial("/ports", {method:'PATCH'})
        .then((rsp)=>{
            if ('error' in rsp) {
                return Promise.reject(rsp.error as string)
            } else {
                return rsp.data
            }
        })
        .catch((e)=>(Promise.reject(e)))
    }
}

export const useGetPort = () => {
    return (id:string): Promise<any> => {
        return fetchSerial("/ports/"+id, {method:'GET'})
        .then((rsp)=>{
            if ('error' in rsp) {
                return Promise.reject(rsp.error as string)
            } else {
                return rsp.data
            }
        })
        .catch((e)=>(Promise.reject(e)))
    }
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

export const useSend = (id:string) => {
    return (data:Uint8Array):Promise<string> => {
        return fetchSerial("/ports/"+id+"/data", {method:'POST', body:{data:btoa(String.fromCharCode(...data))}})
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
    return (byteLength: number, timeoutMs: number, newLineCode?: string | RegExp): Promise<any> => {
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

export const useGetPage = () => {
    return (id:string, page:number, perPage:number) => {
        const body = {id, page, perPage}
        return fetchSerial("/ports/"+id + "/rxdata", {method:'GET', body})
        .then((rsp)=>{
            if ('error' in rsp) {
                return Promise.reject(rsp.error as string)
            } else {
                return rsp.data
            }
        })
        .catch((e)=>(Promise.reject(e)))
    }
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

export const useDelete = () => {
    return (id:string): Promise<string> => {
        console.log("useDelete","/ports/"+id)
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
}