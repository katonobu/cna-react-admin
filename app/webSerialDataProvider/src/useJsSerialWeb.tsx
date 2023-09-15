import { useSyncExternalStore} from 'react'
import { createContext, useContext, useState } from 'react';
import JsSerialWeb from 'js-serial-web';
import {JsSerialWebContext} from '@/app/AppRoot'

// useSerialPorts
const getSerialPorts = (jsw:JsSerialWeb) => {
    const ports = jsw.getPorts().curr
//    console.log("getSerialPorts", ports)
    return ports
}
const subscribeSerialPorts = (jsw:JsSerialWeb, callback:()=>void) => {
//    console.log("UpdateSerialPort")
    const unsubscribe = jsw.subscribePorts(callback)
    return ()=>unsubscribe()
}
export const useSerialPorts = () => {
    const jsw = useContext(JsSerialWebContext)
    return useSyncExternalStore(
        (cb:()=>void)=>subscribeSerialPorts(jsw, cb), 
        ()=>getSerialPorts(jsw)
    )
}
