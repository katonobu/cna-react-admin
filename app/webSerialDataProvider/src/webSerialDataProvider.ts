import {useSyncExternalStore} from 'react'
import webSerialPorts from './webSerialPorts';
import { MicroStore } from './webSerialPorts';

interface rxLineBuffType {
    ts:number,
    data:string
}

const getSerialPortLen = () =>webSerialPorts.getPorts().length
export const subscribeSerialPortLen = (callback:any) => {
    const unsubscribe = webSerialPorts.subscribe(callback)
    return ()=>unsubscribe()
}
export const useSerialPortLen = () => useSyncExternalStore(subscribeSerialPortLen, getSerialPortLen)

const getSerialPorts = () =>webSerialPorts.getPorts()
export const useSerialPorts = () => useSyncExternalStore(subscribeSerialPortLen, getSerialPorts)

const rxLineBuffers:MicroStore<rxLineBuffType[]>[] = []
const rxLineBufferUpdateLines:any[] = []
subscribeSerialPortLen(()=>{
    for (let id = rxLineBuffers.length; id < webSerialPorts.getMaxId(); id++) {
        console.log("AddPorts", id)
        rxLineBuffers[id] = new MicroStore([])
        rxLineBufferUpdateLines[id] = {lines:0}
        webSerialPorts.getPortById(id).subscribeRx(()=>{
            const ts:number = (new Date()).getTime()
            const rxLines = webSerialPorts.getPortById(id).rx
            rxLineBufferUpdateLines[id] = {lines:rxLines.length}
            const addLines = rxLines.map((data)=>({data, ts}))
            console.log(id, ts, rxLines.length, addLines)
            const newRxLines = rxLineBuffers[id].get().concat(addLines)
//            console.log(id, ts, rxLines.length, newRxLines)
            rxLineBuffers[id].update(newRxLines)
        })
    }
})
const getRxLineBufferBuilder = (id:string) => ()=>rxLineBufferUpdateLines[parseInt(id, 10)]
const subscribeRxLineBufferBuilder = (id:string) => (callback:any) => {
//    console.log("subscribe", id)
//    const unsubscribe = rxLineBuffers[parseInt(id, 10)].subscribe(()=>{console.log("callback is called");callback()})
    const unsubscribe = rxLineBuffers[parseInt(id, 10)].subscribe(callback)
    return ()=>unsubscribe()
}
export const useRxLineBuffer = (id:string) => useSyncExternalStore(subscribeRxLineBufferBuilder(id), getRxLineBufferBuilder(id))

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



