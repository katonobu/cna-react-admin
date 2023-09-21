import { Datagrid, TextField, SimpleList, BulkDeleteButton, FunctionField} from 'react-admin';
import { useMediaQuery } from '@mui/material';
import JsSerialBleWeb from '@katonobu/js-ble-web';
import { portRecordType } from '@/app/webSerialDataProvider/src/index'


const getStatusStr = (jsw:JsSerialBleWeb, record:portRecordType)=>{
    if (!record) return "";
    const id = parseInt(record.id.toString(10), 10)
    const isOpen = jsw.getOpenStt(id)
    const available = record.available === 'TRUE'
    let stt = ""
    if (available) {
        if (isOpen) {
            stt = "OPEN"
        } else {
            stt = "CLOSE"
        }
    } else {
        stt = record.reason
    }
    return stt
}

// バルク選択 enable/disable制御は https://marmelab.com/react-admin/Datagrid.html#isrowselectable より引用
const ListItems = ({jsw}:{jsw:JsSerialBleWeb})=>{
    const isSmall = useMediaQuery((theme:any) => theme.breakpoints.down('sm'))
    if (isSmall) {
        return <SimpleList
            primaryText={record => record.id}
            secondaryText={record => getStatusStr(jsw, record)}
        />
    } else {
        return <Datagrid
            rowClick='edit'
            bulkActionButtons={
                <BulkDeleteButton
                    mutationMode='pessimistic'
                />
            }
            isRowSelectable={ record => getStatusStr(jsw, record) === "CLOSE" }
        >
            <TextField source="id" />
            <FunctionField label="Status" render={
                (record:portRecordType) => <span>{getStatusStr(jsw, record)}</span>
            } />                        
            <TextField source="vid" />
            <TextField source="pid" />
        </Datagrid>
    }
}

export default ListItems