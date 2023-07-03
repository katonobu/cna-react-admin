import { DataProvider } from 'ra-core';
import { CreateResult, DeleteResult, DeleteManyResult, GetListResult, GetManyReferenceResult, GetManyResult, GetOneResult, UpdateManyResult, UpdateResult } from 'react-admin';
    
import webSerialPorts from './webSerialPorts';

const webSerialProvider = (): DataProvider => {
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
    const serializeWebSerialPort = (wsp:any):Object => {
//        console.log(wsp);
        return {
            id:wsp.idStr,
            venderName:wsp.venderName,
            pid:'0x'+('0000'+wsp.pid.toString(16)).slice(-4),
            vid:'0x'+('0000'+wsp.vid.toString(16)).slice(-4),
            isOpen:wsp.isOpen?'Open':'Close',
        }
    };
  
    return {
        getList: (resource, params) => {
            const wsps = webSerialPorts.getPorts()
            return Promise.resolve({
                data:wsps.map((wsp)=>serializeWebSerialPort(wsp)),
                total:wsps.length
            } as GetListResult);
        },

        getOne: (resource, params) =>{
            const wsp = webSerialPorts.getPortById(params.id)
            if (wsp) {
                return Promise.resolve({
                    data:serializeWebSerialPort(wsp),
                } as GetOneResult);
            } else {
                return Promise.reject(new Error(`${params.id} is not found`))
            }
        },

        getMany: (resource, params) => {
            const foundPorts = params.ids.filter((id)=>webSerialPorts.getPortById(id))
            return Promise.resolve({
                data:foundPorts.map((wsp)=>serializeWebSerialPort(wsp))
            } as GetManyResult)
        },

        getManyReference: (resource, params) => {
            return Promise.reject(new Error('getManyReference() is not implemented yet'))
            return Promise.resolve({data:[], total:0} as GetManyReferenceResult);
        },

        update: (resource, params) => {
            console.log("update", params);
            const wsp = webSerialPorts.getPortById(params.id)
            if (wsp) {
                // 本当はここでupdateに相当する処理をする
                return Promise.resolve({
                    data:serializeWebSerialPort(wsp),
                } as UpdateResult);
            } else {
                return Promise.reject(new Error(`${params.id} is not found`))
            }
        },

        updateMany: (resource, params) =>{
            return Promise.reject(new Error('updateMany() is not implemented yet'));
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
            ).then(()=>({data:params.ids} as UpdateManyResult))
        },

        create: (resource, params) => {
            return webSerialPorts.create({}).then((wsp)=> {
                return {data:serializeWebSerialPort(wsp)} as CreateResult
            }).catch((e)=>{
                if (
                    e.code === 8 || // Failed to execute 'requestPort' on 'Serial': No port selected by the user.
                    e.code === 18   // Failed to execute 'requestPort' on 'Serial': Must be handling a user gesture to show a permission request.
                ){
//                    return {data:{} as RecordType} // これだとエラーになるのでrejctedPromiseを返す。
                    return Promise.reject(e)
                } else {
                    return Promise.reject(e)
                }
            })
        },

        delete: (resource, params) => {
            const wsp = webSerialPorts.getPortById(params.id)
            if (wsp) {
                const tmp = serializeWebSerialPort(wsp);
                return wsp.forget().then((err)=>{
                    if (err) {
                        return Promise.reject(new Error(err))
                    }else{
                        return {data:tmp} as DeleteResult
                    }
                });
            } else {
                return Promise.reject(new Error('Cant find object by id'))
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
            ).then(()=>({data:params.ids} as DeleteManyResult))
            .catch((e)=>(Promise.reject(e)))
        }
    }
};
export default webSerialProvider;
