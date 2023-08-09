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
const rxLineBufferLines:any[] = []
subscribeSerialPortLen(()=>{
    for (let portId = rxLineBuffers.length; portId < webSerialPorts.getMaxId(); portId++) {
        console.log("AddPorts", portId)
        rxLineBuffers[portId] = new MicroStore([])
        rxLineBufferLines[portId] = {totalLines:0, updatedLines:0}
        webSerialPorts.getPortById(portId).subscribeRx(()=>{
            const ts:number = (new Date()).getTime()
            const rxLines = webSerialPorts.getPortById(portId).rx
            const idBase = rxLineBuffers[portId].get().length
            const addLines = rxLines.map((data, idx)=>({data, ts, id:idx+idBase}))
//            console.log(portId, ts, rxLines.length, addLines)
            const newRxLines = rxLineBuffers[portId].get().concat(addLines)
            rxLineBufferLines[portId] = {totalLines:newRxLines.length, updatedLines:rxLines.length}
//            console.log(id, ts, rxLines.length, newRxLines)
            rxLineBuffers[portId].update(newRxLines)
        })
    }
})
const getRxLineBufferBuilder = (id:string) => ()=>rxLineBufferLines[parseInt(id, 10)]
const subscribeRxLineBufferBuilder = (id:string) => (callback:any) => {
//    console.log("subscribe", id)
//    const unsubscribe = rxLineBuffers[parseInt(id, 10)].subscribe(()=>{console.log("callback is called");callback()})
    const unsubscribe = rxLineBuffers[parseInt(id, 10)].subscribe(callback)
    return ()=>unsubscribe()
}
export const useRxLineBuffer = (id:string) => useSyncExternalStore(subscribeRxLineBufferBuilder(id), getRxLineBufferBuilder(id))
export const getRxLineBuffers = (id:number, page:number,perPage:number) => {
    if (id < rxLineBuffers.length) {
        const buff = rxLineBuffers[id].get()
        const len = buff.length
        const startIndex = Math.min(page * perPage, len)
        const endIndex = Math.min((page + 1) * perPage, len)
        const pageInfo = {
            hasPreviousPage: 0 < startIndex,
            hasNextPage: endIndex < len
        }        
        return { data:buff.slice(startIndex, endIndex), total:buff.length, pageInfo}
    } else {
        return { data:[], total:0}
    }
}

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



