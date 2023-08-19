"use client";
import { createContext, useContext, useMemo, useEffect } from 'react';
import {workerOnMessageHandler} from '@/app/webSerialDataProvider/src/webSerialWorkerAdapter'

const WebSerialWorkerContext = createContext<Worker|null>(null);

export const webSerialWorker = (typeof window !== 'undefined')?new Worker(new URL("./webSerialWorker.ts", import.meta.url)):null

export function useWebSerialWorkerContext() {
  return useContext(WebSerialWorkerContext);
}

export function WebSerialWorkerProvider({
    children,
  }: {
    children: React.ReactNode
  }){
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Worker && webSerialWorker) {
          webSerialWorker.onmessage = workerOnMessageHandler
        }
      }, []);
  return (
    <WebSerialWorkerContext.Provider value={webSerialWorker}>{children}</WebSerialWorkerContext.Provider>
  );
}