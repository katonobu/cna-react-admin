import {useSyncExternalStore} from 'react'
import webSerialPorts from './webSerialPorts';


const getLastRxLineBuilder = (id:string) => {
    return ()=>webSerialPorts.getPortById(id).rx
}

const subscribeLastRxLineBuilder = (id:string) => {
    return (callback:any) => {
        const unsubscribe = webSerialPorts.getPortById(id).subscribeRx(callback)
        return (()=>{
            unsubscribe()
        })
    }
}

export const useLastRxLine = (id:string) => {
    const lastRxLine = useSyncExternalStore(subscribeLastRxLineBuilder(id), getLastRxLineBuilder(id))
    return lastRxLine
}