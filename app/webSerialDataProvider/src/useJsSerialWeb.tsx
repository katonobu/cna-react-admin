import { useSyncExternalStore} from 'react'
import { useMemo } from 'react';
import JsSerialWeb from 'js-serial-web';

// useSerialPorts
const getSerialPorts = (jsw:JsSerialWeb) => () => jsw.getPorts().curr
const subscribeSerialPorts = (jsw:JsSerialWeb, callback:()=>void) => {
    const unsubscribe = jsw.subscribePorts(callback)
    return ()=>unsubscribe()
}
export const useSerialPorts = (jsw:JsSerialWeb) => {
    return useSyncExternalStore(
        (cb:()=>void)=>subscribeSerialPorts(jsw, cb), 
        getSerialPorts(jsw)
    )
}

// useIsOpen
const getIsOpenBuilder = (jsw:JsSerialWeb, id:number) => ()=>jsw.getOpenStt(id)
const subscribeIsOpenBuilder = (jsw:JsSerialWeb, id:number) => (callback:()=>void) => {
    const unsubscribe = jsw.subscribeOpenStt(id, callback)
    return ()=>unsubscribe()
}
export const useIsOpen = (jsw:JsSerialWeb, id:number) => {
    return useSyncExternalStore(subscribeIsOpenBuilder(jsw, id), getIsOpenBuilder(jsw, id))
}

// useRxBufferLen
const getLineNumBuilder = (jsw:JsSerialWeb, id:number) => ()=> jsw.getRxLineNum(id)
const subscribeLineNumBuilder = (jsw:JsSerialWeb, id:number) => (callback:()=>void) => {
    const unsubscribe = jsw.subscribeRxLineNum(id, callback)
    return ()=>unsubscribe()
}
export const useRxBufferLen = (jsw:JsSerialWeb, id:number) => {
    return useSyncExternalStore(subscribeLineNumBuilder(jsw, id), getLineNumBuilder(jsw, id))
}

export const useOpen       = (jsw:JsSerialWeb, id:number)=>useMemo(()=> {
    return (options:SerialOptions)=>jsw.openPort(id, options)
},[id])

export const useClose       = (jsw:JsSerialWeb, id:number)=>useMemo(()=> {
    return ()=>jsw.closePort(id)
},[id])

export const useSend       = (jsw:JsSerialWeb, id:number)=>useMemo(()=> {
    return (data:Uint8Array)=>jsw.sendPort(id, data)
},[id])

export const useReceieveStart= (jsw:JsSerialWeb, id:number)=>useMemo(()=> {
    return ()=>jsw.startReceivePort(id)
},[id])
