"use client";
import {useSyncExternalStore, useMemo} from 'react'
import {portsStore, openSttStore, rxLineNumStore} from '@/app/webSerialDataProvider/src/webSerialWorkerAdapter'
import { getPorts, createPort, updatePort, getPort, deletePort, getPage } from '@/app/webSerialDataProvider/src/webSerialWorkerAdapter';
import { openPort, sendPort, receievePort, closePort } from '@/app/webSerialDataProvider/src/webSerialWorkerAdapter';

// useSerialPorts
const getSerialPorts = () => portsStore.get()
const subscribeSerialPorts = (callback:()=>void) => {
    const unsubscribe = portsStore.subscribe(callback)
    return ()=>unsubscribe()
}
export const useSerialPorts = () => useSyncExternalStore(subscribeSerialPorts, getSerialPorts)

// useIsOpen
const getIsOpenBuilder = (id:string) => ()=>openSttStore[parseInt(id,10)].get()
const subscribeIsOpenBuilder = (id:string) => (callback:()=>void) => {
    const unsubscribe = openSttStore[parseInt(id,10)].subscribe(callback)
    return ()=>unsubscribe()
}
export const useIsOpen = (id:string) => useSyncExternalStore(subscribeIsOpenBuilder(id), getIsOpenBuilder(id))

// useRxBufferLen
const getLineNumBuilder = (id:string) => ()=>rxLineNumStore[parseInt(id,10)].get()
const subscribeLineNumBuilder = (id:string) => (callback:()=>void) => {
    const unsubscribe = rxLineNumStore[parseInt(id,10)].subscribe(callback)
    return ()=>unsubscribe()
}
export const useRxBufferLen = (id:string) => useSyncExternalStore(subscribeLineNumBuilder(id), getLineNumBuilder(id))

export const useGetPorts   = ()=>useMemo(()=>getPorts,[])
export const useCreate     = ()=>useMemo(()=>createPort,[])
export const useUpdatePort = ()=>useMemo(()=>updatePort,[])
export const useGetPage    = ()=>useMemo(()=>getPage,[])
export const useGetPort    = (id:string)=>useMemo(()=>()=>getPort(id),[id])
export const useDelete     = (id:string)=>useMemo(()=>()=>deletePort(id),[id])
export const useOpen       = (id:string)=>useMemo(()=>(options:SerialOptions)=>openPort(id, options),[id])
export const useSend       = (id:string)=>useMemo(()=>(data:Uint8Array)=>sendPort(id, data),[id])
export const useReceieve = (id:string)=>useMemo(()=>(byteLength: number, timeoutMs: number)=>receievePort(id, byteLength, timeoutMs),[id])
export const useClose    = (id:string)=>useMemo(()=>()=>closePort(id),[id])