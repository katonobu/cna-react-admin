import {useSyncExternalStore} from 'react'
import webSerialPorts from './webSerialPorts';
import { subscribeRxBufferLineBuilder, getRxBufferLineBuilder } from './webSerialDataBuffer';

// useSerialPortLen
const getSerialPortLen = () =>webSerialPorts.getPorts().length
export const subscribeSerialPortLen = (callback:any) => {
    const unsubscribe = webSerialPorts.subscribe(callback)
    return ()=>unsubscribe()
}
export const useSerialPortLen = () => useSyncExternalStore(subscribeSerialPortLen, getSerialPortLen)

// useSerialPorts
const getSerialPorts = () =>webSerialPorts.getPorts()
export const useSerialPorts = () => useSyncExternalStore(subscribeSerialPortLen, getSerialPorts)

// useRxLineBuffer
export const useRxBufferLen = (id:string) => useSyncExternalStore(subscribeRxBufferLineBuilder(id), getRxBufferLineBuilder(id))

// useLastRxLine
const getLastRxLineBuilder = (id:string) => ()=>webSerialPorts.getPortById(id).rx
const subscribeLastRxLineBuilder = (id:string) => (callback:any) => {
    const unsubscribe = webSerialPorts.getPortById(id).subscribeRx(callback)
    return ()=>unsubscribe()
}
export const useLastRxLine = (id:string) => useSyncExternalStore(subscribeLastRxLineBuilder(id), getLastRxLineBuilder(id))

// useIsOpen
const getIsOpenBuilder = (id:string) => ()=>webSerialPorts.getPortById(id).isOpen
const subscribeIsOpenBuilder = (id:string) => (callback:any) => {
    const unsubscribe = webSerialPorts.getPortById(id).subscribeIsOpen(callback)
    return ()=>unsubscribe()
}
export const useIsOpen = (id:string) => useSyncExternalStore(subscribeIsOpenBuilder(id), getIsOpenBuilder(id))



