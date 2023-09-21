import { useSyncExternalStore} from 'react'
import { useMemo } from 'react';
import JsSerialBleWeb from '@katonobu/js-ble-web';

// useSerialPorts
const getSerialPorts = (jsw:JsSerialBleWeb) => () => jsw.getPorts().curr
const subscribeSerialPorts = (jsw:JsSerialBleWeb, callback:()=>void) => {
    const unsubscribe = jsw.subscribePorts(callback)
    return ()=>unsubscribe()
}
export const useSerialPorts = (jsw:JsSerialBleWeb) => {
    return useSyncExternalStore(
        (cb:()=>void)=>subscribeSerialPorts(jsw, cb), 
        getSerialPorts(jsw)
    )
}

// useIsOpen
const getIsOpenBuilder = (jsw:JsSerialBleWeb, id:number) => ()=>jsw.getOpenStt(id)
const subscribeIsOpenBuilder = (jsw:JsSerialBleWeb, id:number) => (callback:()=>void) => {
    const unsubscribe = jsw.subscribeOpenStt(id, callback)
    return ()=>unsubscribe()
}
export const useIsOpen = (jsw:JsSerialBleWeb, id:number) => {
    return useSyncExternalStore(subscribeIsOpenBuilder(jsw, id), getIsOpenBuilder(jsw, id))
}

// useRxBufferLen
const getLineNumBuilder = (jsw:JsSerialBleWeb, id:number) => ()=> jsw.getRxLineNum(id)
const subscribeLineNumBuilder = (jsw:JsSerialBleWeb, id:number) => (callback:()=>void) => {
    const unsubscribe = jsw.subscribeRxLineNum(id, callback)
    return ()=>unsubscribe()
}
export const useRxBufferLen = (jsw:JsSerialBleWeb, id:number) => {
    return useSyncExternalStore(subscribeLineNumBuilder(jsw, id), getLineNumBuilder(jsw, id))
}

export const useOpen       = (jsw:JsSerialBleWeb, id:number)=>useMemo(()=> {
    return (options:SerialOptions)=>jsw.openPort(id, options)
},[id, jsw])

export const useClose       = (jsw:JsSerialBleWeb, id:number)=>useMemo(()=> {
    return ()=>jsw.closePort(id)
},[id, jsw])

export const useSend       = (jsw:JsSerialBleWeb, id:number)=>useMemo(()=> {
    return (data:Uint8Array)=>jsw.sendPort(id, data)
},[id, jsw])

export const useReceieveStart= (jsw:JsSerialBleWeb, id:number)=>useMemo(()=> {
    return ()=>jsw.startReceivePort(id)
},[id, jsw])
