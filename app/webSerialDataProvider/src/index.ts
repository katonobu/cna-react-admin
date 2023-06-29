import { stringify } from 'query-string';
import { fetchUtils, DataProvider } from 'ra-core';
import { RecordType } from 'ra-core';


import webSerialPorts from './webSerialPorts';

const webSerialProvider = (apiUrl:string, httpClient = fetchUtils.fetchJson): DataProvider => {
    console.log("webSerialProvider init.")
    const trueFalseNullToString = (obj:boolean | undefined | null):string => {
        if (obj === true) {
            return 'True'
        } else if (obj == false) {
            return 'False'
        } else {
            return 'N.A.'
        }
    };
    const serializeWebSerialPort = (wsp):Object => {
        console.log(wsp);
        return {
          id:wsp.idStr,
          venderName:wsp.venderName,
          pid:'0x'+('0000'+wsp.pid.toString(16)).slice(-4),
          vid:'0x'+('0000'+wsp.vid.toString(16)).slice(-4),
          isOpen:wsp.isOpen?'Open':'Close',
/*
          dataCarrierDetect:trueFalseNullToString(wsp.signals.dataCarrierDetect),
          clearToSend:trueFalseNullToString(wsp.signals.clearToSend),
          ringIndicator:trueFalseNullToString(wsp.signals.ringIndicator),
          dataSetReady:trueFalseNullToString(wsp.signals.dataSetReady),
          dataTerminalReady:trueFalseNullToString(wsp.signals.dataTerminalReady),
          requestToSend:trueFalseNullToString(wsp.signals.requestToSend),
          errorStr:wsp.errorStr,
          rx:wsp.rx,
*/
        }
    };
  
    return {
        getList: (resource, params) => {
            try {
                const wsps = webSerialPorts.getPorts()
                return Promise.resolve({
                    data:wsps.map((wsp)=>serializeWebSerialPort(wsp) as RecordType),
                    total:wsps.length
                });
            } catch (e) {
                return Promise.reject(e)
            }
        },

        getOne: (resource, params) =>{
            try {
                const wsp = webSerialPorts.getPortById(params.id)
                if (wsp) {
                    return Promise.resolve({
                        data:serializeWebSerialPort(wsp) as RecordType,
                    });
                } else {
                    throw new Error(`${params.id} is not found`)
                }
            } catch (e) {
                return Promise.reject(e)
            }
        },

        getMany: (resource, params) => {
            try{
                const foundPorts = params.ids.filter((id)=>webSerialPorts.getPortById(id))
                return Promise.resolve({
                    data:foundPorts.map((wsp)=>serializeWebSerialPort(wsp) as RecordType)
                })

            } catch (e) {
                return Promise.reject(e)
            } 
        },

        getManyReference: (resource, params) => {
            throw new Error('getManyReference() is not implemented yet');
            return Promise.resolve({data:[] as RecordType[], total:0} );
        },

        update: (resource, params) => {
            console.log("update", params);
            const wsp = webSerialPorts.getPortById(params.id)
            if (wsp) {
                // 本当はここでupdateに相当する処理をする
                return Promise.resolve({
                    data:serializeWebSerialPort(wsp) as RecordType,
                });
            } else {
                throw new Error(`${params.id} is not found`)
            }
        },

        updateMany: (resource, params) =>{
            throw new Error('updateMany() is not implemented yet');
            return Promise.all(
                params.ids.map(id => {
                    const port = webSerialPorts.getPortById(id);
                    if (port) {
                        // 本当はここでupdateに相当する処理をする
                        return Promise.resolve()
                    } else {
                        return Promise.resolve()
                    }
                })
            ).then(()=>({data:params.ids}))
        },

        create: (resource, params) => {
            return webSerialPorts.create({}).then((wsp)=>{
                const retVal = {data:serializeWebSerialPort(wsp) as RecordType}
                return retVal
            })
        },

        delete: (resource, params) => {
            const wsp = webSerialPorts.getPortById(params.id)
            if (wsp) {
                const tmp = serializeWebSerialPort(wsp);
                return wsp.forget().then((err)=>{
                    if (err) {
                        throw new Error(err)
                    }else{
                        return {data:tmp as RecordType}
                    }
                });
            } else {
                throw new Error('Cant find object by id')
            }
        },

        deleteMany: (resource, params) => {
            return Promise.all(
                params.ids.map(id => {
                    const port = webSerialPorts.getPortById(id);
                    if (port) {
                        return port.forget()
                    } else {
                        return Promise.resolve()
                    }
                })
            ).then(()=>({data:params.ids}))
        }
    }
};
export default webSerialProvider;
