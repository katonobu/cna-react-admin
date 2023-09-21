import { useState, useEffect } from 'react'
import { DeleteButton, useRecordContext } from 'react-admin'

import JsSerialBleWeb from '@katonobu/js-ble-web';
import { portRecordType } from '@/app/webSerialDataProvider/src/index'
import { useIsOpen } from '@/app/webSerialDataProvider/src/useJsSerialWeb'

const PortDeleteButton = ({id, jsw}:{id:number, jsw:JsSerialBleWeb}) => {
    const isOpen = useIsOpen(jsw,id)
    const record = useRecordContext() as portRecordType
    const [disabled, setDisabled] = useState(false)
    useEffect(()=>{
        if(record && record.available && record.available === "FALSE"){
            setDisabled(true)
        } else if (isOpen === true) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    },[record, isOpen])
    return (
        <DeleteButton
            disabled={disabled}
            mutationMode='pessimistic'
        ></DeleteButton>
    )
}

export default PortDeleteButton