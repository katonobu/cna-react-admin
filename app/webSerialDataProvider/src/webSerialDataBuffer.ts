import { MicroStore } from './webSerialPorts';
import webSerialPorts from './webSerialPorts';

interface rxLineBuffType {
    ts:number,
    data:string
}

const rxLineBuffers:MicroStore<rxLineBuffType[]>[] = []
const rxLineBufferLines:any[] = []
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
export const getRxBufferLineBuilder = (id:string) => ()=>rxLineBufferLines[parseInt(id, 10)]
export const subscribeRxBufferLineBuilder = (id:string) => (callback:any) => {
    const unsubscribe = rxLineBuffers[parseInt(id, 10)].subscribe(callback)
    return ()=>unsubscribe()
}

webSerialPorts.subscribe(()=>{
    console.log("AddPortsId :: ", rxLineBuffers.length, " to ", webSerialPorts.getMaxId())
    for (let portId = rxLineBuffers.length; portId < webSerialPorts.getMaxId(); portId++) {
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
