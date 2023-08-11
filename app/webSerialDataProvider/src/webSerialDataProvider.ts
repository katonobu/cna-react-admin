import {useSyncExternalStore} from 'react'
import webSerialPorts from './webSerialPorts';
import { subscribeRxBufferLineBuilder, getRxBufferLineBuilder } from './webSerialDataBuffer';

// useSerialPorts
const getSerialPorts = () =>webSerialPorts.getPorts()
export const subscribeSerialPorts = (callback:any) => {
    const unsubscribe = webSerialPorts.subscribe(callback)
    return ()=>unsubscribe()
}
export const useSerialPorts = () => useSyncExternalStore(subscribeSerialPorts, getSerialPorts)

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

// useRxBufferLen
export const useRxBufferLen = (id:string) => useSyncExternalStore(subscribeRxBufferLineBuilder(id), getRxBufferLineBuilder(id))

// useSend
export const useSend = (id:string) => {
    return (data:Uint8Array):Promise<string> => {
        const port = webSerialPorts.getPortById(id)
        return port.send(data)
    }
}

export const useOpen = (id:string) => {
    return (options: SerialOptions): Promise<string> => {
        const port = webSerialPorts.getPortById(id)
        return port.open(options)
    }
}

export const useClose = (id:string) => {
    return (): Promise<string> => {
        const port = webSerialPorts.getPortById(id)
        return port.close()
    }
}

export const useReceieve = (id:string) => {
    return (byteLength: number, timeoutMs: number, newLineCode?: string | RegExp): Promise<any> => {
        const port = webSerialPorts.getPortById(id)
        return port.receive(byteLength, timeoutMs, newLineCode)
    }
}
