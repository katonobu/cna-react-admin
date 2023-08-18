import { DataProvider } from 'ra-core';
import { CreateResult, DeleteResult, DeleteManyResult, GetListResult, GetManyReferenceResult, GetManyResult, GetOneResult, UpdateManyResult, UpdateResult } from 'react-admin';
import {fetchSerial} from '@/app/webSerialDataProvider/src/webSerialWorkerAdapter'

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
                return fetchSerial("/ports", {method:'GET'})
                .then((rsp)=>{
                    if ('data' in rsp && Array.isArray(rsp.data)) {
                        return {
                            data:rsp.data.map((wsp)=>serializeWebSerialPort(wsp)),
                            total:rsp.data.length
                        } as GetListResult                    
                    } else {
                        return {data:[{id:0}], total:1} as GetListResult
                    }
                })
                .catch((e)=>(Promise.reject(e)))
            } else if (resource === 'Port_Rx_Data') {
                const body = {id:params.meta.id, page:params.pagination.page, perPage:params.pagination.perPage}
                return fetchSerial("/ports/"+params.meta.id.toString(10) + "/rxdata", {method:'GET', body})
                .then((rsp)=>{
                    if ('data' in rsp) {
                        return rsp.data as unknown as GetListResult
                    } else {
                        return {data:[{id:0}], total:1} as GetListResult
                    }
                })
            } else {
                return Promise.resolve({data:[{id:0}], total:1} as GetListResult)
            }
        },

        getOne: (resource, params) =>{
            return fetchSerial(`/ports/${params.id}`, {method:'GET'})
            .then((rsp)=>{
                if ('data' in rsp){
                    if (rsp.data) {
                        return {data:serializeWebSerialPort(rsp.data)} as GetOneResult
                    } else {
                        return Promise.reject(new Error(`${params.id} is not found`))
                    }
                } else {
                    return {data:null} as GetOneResult
                }
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
            .then((port)=>{
                return fetchSerial("/ports", {method:'PATCH'})
                .then((rsp)=>{
                    if ('data' in rsp){
                        if (rsp.data) {
                            return {data:serializeWebSerialPort(rsp.data)} as CreateResult
                        } else {
                            // may selected already registrated port.
                            throw new Error('Select already registrated')
                        }
                    } else {
                        return {data:null} as CreateResult
                    }
                })
                .catch((e)=>(Promise.reject(e)))
            })
            .catch((e)=>{
                return Promise.reject(e)
            })

        },

        delete: (resource, params) => {
            return fetchSerial(`/ports/${params.id}`, {method:'GET'})
            .then((rsp)=>{
                if ('data' in rsp){
                    if (rsp.data) {
                        const tmp = serializeWebSerialPort(rsp.data)
                        return fetchSerial(`/ports/${params.id}`, {method:'DELETE'})
                        .then((_)=>{return {data:tmp} as DeleteResult})
                        .catch((e)=>(Promise.reject(e)))
                    } else {
                        return Promise.reject(new Error(`${params.id} is not found`))
                    }
                } else {
                    return {data:null} as DeleteResult
                }
            })
            .catch((e)=>(Promise.reject(e)))
        },

        deleteMany: (resource, params) => {
            return Promise.all(
                params.ids.map(id => fetchSerial(`/ports/${id}`, {method:'DELETE'}))
            ).then(()=>({data:params.ids} as DeleteManyResult))
            .catch((e)=>(Promise.reject(e)))
        }
    }
};
export default webSerialProvider;
