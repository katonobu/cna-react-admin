import { DataProvider } from 'ra-core';
import { CreateResult, DeleteResult, DeleteManyResult, GetListResult, GetOneResult } from 'react-admin';
import JsSerialWeb from '@katonobu/js-serial-web';

export type portRecordType = {
    id:number;
    pid:string;
    vid:string;
    available:string
    reason:string
}

const buildPortRecord = (port:any) => ({
    id:port.id,
    pid:'0x'+port.pid.toString(16).padStart(4,'0'),
    vid:'0x'+port.vid.toString(16).padStart(4,'0'),
    available:port.available?'TRUE':'FALSE',
    reason:port.reason
})

const webSerialProvider = (jsw:JsSerialWeb): DataProvider => {
    console.log("webSerialProvider init.")
    jsw.init()
    return {
        getList: (resource, params) => {
            if (resource === 'List_Add_Port') {
                const ps = jsw.getPorts()
                const data = ps.curr.map((port)=>buildPortRecord(port))
                return Promise.resolve({data, total:ps.curr.length} as GetListResult)
            } else if (resource === 'Port_Rx_Data') {
                const id = parseInt(params.meta.id.toString(10), 10)
                const page = params.pagination.page
                const perPage = params.pagination.perPage
                const startIndex = page * perPage
                const endIndex = (page+1)*perPage
                const getResult = jsw.getRxLines(id, startIndex, endIndex)
                const pageInfo = {
                    hasPreviousPage: 0 < startIndex,
                    hasNextPage: endIndex < getResult.total
                }
                return Promise.resolve({...getResult, pageInfo})
            } else {
                return Promise.resolve({data:[{id:0}], total:1} as GetListResult)
            }
        },

        getOne: (resource, params) =>{
            const ps = jsw.getPorts()
            const port = ps.curr.filter((port)=>port.id === parseInt(params.id.toString(10), 10))[0]
            return Promise.resolve({data:buildPortRecord(port)} as GetOneResult)
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
            return jsw.promptGrantAccess()
            .then((port)=>{
                return { data: buildPortRecord(port)} as CreateResult
            })
        },

        delete: (resource, params) => {
            const id = parseInt(params.id.toString(10), 10)
            return jsw.deletePort(id)
            .then((port)=>{
                return {data:buildPortRecord(port)} as DeleteResult
            })
            .catch((e)=>(Promise.reject(e)))
        },

        deleteMany: (resource, params) => {
            return Promise.all(
                params.ids.map((id) => jsw.deletePort(parseInt(id.toString(10),10)))
            ).then(()=>({data:params.ids} as DeleteManyResult))
            .catch((e)=>(Promise.reject(e)))
        }
    }
};
export default webSerialProvider;
