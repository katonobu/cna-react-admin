import { DataProvider } from 'ra-core';
import { CreateResult, DeleteResult, DeleteManyResult, GetListResult, GetOneResult } from 'react-admin';
import JsSerialWeb from 'js-serial-web';

const webSerialProvider = (jsw:JsSerialWeb): DataProvider => {
    console.log("webSerialProvider init.")
    /*
    jsw.subscribePorts(()=>{
        const portChangeStt = jsw.getPorts();
        portChangeStt.attached.forEach((id:number)=>{
          const portOption = addNewPort(id);
          if (autoconnectCheckbox.checked) {
            portOption.selected = true;
            connectToPort();
          }
        });
        portChangeStt.detached.forEach((id:number)=>{
          const portOption = findPortOption(id);
          if (portOption) {
            portOption.remove();
          }
        });
      });
      */
    jsw.init()
    return {
        getList: (resource, params) => {
            if (resource === 'List_Add_Port') {
                const ps = jsw.getPorts()
                const data = ps.curr.map((port)=>({
                    id:port.id,
                    pid:'0x'+port.pid.toString(16).padStart(4,'0'),
                    vid:'0x'+port.vid.toString(16).padStart(4,'0'),
                    available:port.available?'TRUE':'FALSE'
                }))
                return Promise.resolve({data, total:ps.curr.length} as GetListResult)
            } else {
                return Promise.resolve({data:[{id:0}], total:1} as GetListResult)
            }
        },

        getOne: (resource, params) =>{
            const ps = jsw.getPorts()
            const port = ps.curr.filter((port)=>port.id === params.id)[0]
            return Promise.resolve({
                data:{
                    id:port.id,
                    pid:'0x'+port.pid.toString(16).padStart(4,'0'),
                    vid:'0x'+port.vid.toString(16).padStart(4,'0'),
                    available:port.available?'TRUE':'FALSE'
                }
            } as GetOneResult)
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
                console.log()
                return { data: {
                    id:port.id,
                    pid:'0x'+port.pid.toString(16).padStart(4,'0'),
                    vid:'0x'+port.vid.toString(16).padStart(4,'0'),
                    available:port.available?'TRUE':'FALSE'                    
                }} as CreateResult
            })
        },

        delete: (resource, params) => {
            const id = parseInt(params.id.toString(10))
            console.log(id)
            return jsw.deletePort(id)
            .then((port)=>{
                return {data:{
                    id:port.id,
                    pid:'0x'+port.pid.toString(16).padStart(4,'0'),
                    vid:'0x'+port.vid.toString(16).padStart(4,'0'),
                    available:port.available?'TRUE':'FALSE'                    
                }} as DeleteResult
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
