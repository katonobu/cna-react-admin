import {useSyncExternalStore} from 'react'
import webSerialPorts from './webSerialPorts';


const getLastRxLineBuilder = (id:string) => ()=>webSerialPorts.getPortById(id).rx
const subscribeLastRxLineBuilder = (id:string) => (callback:any) => {
    const unsubscribe = webSerialPorts.getPortById(id).subscribeRx(callback)
    return ()=>unsubscribe()
}
export const useLastRxLine = (id:string) => useSyncExternalStore(subscribeLastRxLineBuilder(id), getLastRxLineBuilder(id))

const getIsOpenBuilder = (id:string) => ()=>webSerialPorts.getPortById(id).isOpen
const subscribeIsOpenBuilder = (id:string) => (callback:any) => {
    const unsubscribe = webSerialPorts.getPortById(id).subscribeIsOpen(callback)
    return ()=>unsubscribe()
}
export const useIsOpen = (id:string) => useSyncExternalStore(subscribeIsOpenBuilder(id), getIsOpenBuilder(id))

const getSerialPortLen = () =>webSerialPorts.getPorts().length
export const subscribeSerialPortLen = (callback:any) => {
    const unsubscribe = webSerialPorts.subscribe(callback)
    return ()=>unsubscribe()
}
export const useSerialPortLen = () => useSyncExternalStore(subscribeSerialPortLen, getSerialPortLen)

const getSerialPorts = () =>webSerialPorts.getPorts()
export const useSerialPorts = () => useSyncExternalStore(subscribeSerialPortLen, getSerialPorts)