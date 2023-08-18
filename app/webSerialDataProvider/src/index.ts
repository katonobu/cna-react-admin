import { DataProvider } from 'ra-core';
import { CreateResult, DeleteResult, DeleteManyResult, GetListResult, GetOneResult } from 'react-admin';
import { getPorts, createPort, getPort, deletePort, getPage } from '@/app/webSerialDataProvider/src/webSerialDataProvider';

const webSerialProvider = (): DataProvider => {
    console.log("webSerialProvider init.")
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
            if (resource === 'List_Add_Port') {
                return getPorts()
                .then((data)=>{
                    return {
                        data:data.map((wsp)=>serializeWebSerialPort(wsp)),
                        total:data.length
                    } as GetListResult                    
                })
                .catch((e)=>(Promise.reject(e)))
            } else if (resource === 'Port_Rx_Data') {
                return getPage(params.meta.id.toString(10), params.pagination.page, params.pagination.perPage)
                .then((data)=>{
                    return data as unknown as GetListResult
                })
                .catch((e)=>(Promise.reject(e)))
            } else {
                return Promise.resolve({data:[{id:0}], total:1} as GetListResult)
            }
        },

        getOne: (resource, params) =>{
            return getPort(params.id.toString(10))
            .then((data)=>{
                return {data:serializeWebSerialPort(data)} as GetOneResult
            })
            .catch((e)=>(Promise.reject(e)))
        },

        getMany: (resource, params) => {
            return Promise.reject(new Error('getMany() is not implemented yet'))
        },
        getManyReference: (resource, params) => {
            return Promise.reject(new Error('getManyReference() is not implemented yet'))
        },
        update: (resource, params) => {
            return Promise.reject(new Error('update() is not implemented yet'));
        },
        updateMany: (resource, params) =>{
            return Promise.reject(new Error('updateMany() is not implemented yet'));
        },
        create: (resource, params) => {
            return navigator.serial.requestPort({})
            .then((_)=>{
                return createPort()
                .then((data)=>{
                    return {data:serializeWebSerialPort(data)} as CreateResult
                })
                .catch((e)=>(Promise.reject(e)))
            })
            .catch((e)=>{
                return Promise.reject(e)
            })

        },

        delete: (resource, params) => {
            return getPort(params.id.toString(10))
            .then((data)=>{
                const tmp = serializeWebSerialPort(data)
                return deletePort(params.id.toString(10))
                .then((_)=>{return {data:tmp} as DeleteResult})
                .catch((e)=>(Promise.reject(e)))
            })
            .catch((e)=>(Promise.reject(e)))
        },

        deleteMany: (resource, params) => {
            return Promise.all(
                params.ids.map(id => deletePort(id.toString(10)))
            ).then(()=>({data:params.ids} as DeleteManyResult))
            .catch((e)=>(Promise.reject(e)))
        }
    }
};
export default webSerialProvider;
