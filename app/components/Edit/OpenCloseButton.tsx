import { useState, useEffect } from 'react'
import { useRecordContext } from 'react-admin'

import { useMediaQuery, Button } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import JsSerialBleWeb from '@katonobu/js-ble-web';
import { portRecordType } from '@/app/webSerialDataProvider/src/index'
import { useOpen, useClose, useReceieveStart, useIsOpen } from '@/app/webSerialDataProvider/src/useJsSerialWeb'

// https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/button/ListButton.tsx
// によれば、単にButtonの子要素にアイコンを指定しているだけ
const OpenCloseButton = ({id, jsw}:{id:number, jsw:JsSerialBleWeb})=> {
    const open = useOpen(jsw, id)
    const close = useClose(jsw, id)
    const receiveStart = useReceieveStart(jsw, id)
    const isOpen = useIsOpen(jsw, id)
    const record = useRecordContext() as portRecordType
    const [disabled, setDisabled] = useState(false)
    useEffect(()=>{
        if(record && record.available && record.available === "FALSE"){
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    },[record])
    const isSmall = useMediaQuery((theme:any) => theme.breakpoints.down('sm'))
    return (
        <Button
            disabled = {disabled}
            onClick={()=>{
                if (isOpen) {
                    setDisabled(true)
                    close()
                    .then((rspStr)=>{
                        if (rspStr !== "OK") {
                            console.error(rspStr)
                        }
                        setDisabled(false)
                    })
                    .catch(()=>setDisabled(false))
                } else {
                    setDisabled(true)
                    open({baudRate:115200})
                    .then((rspStr)=>{
                        if (rspStr !== "OK") {
                            console.error(rspStr)
                        } else {
                            receiveStart()
                        }
                        setDisabled(false)
                    })
                    .catch(()=>setDisabled(false))
                }
            }}
            sx={{ width: isSmall?'24px':'10em' }}
        >
            {isOpen?<CloseFullscreenIcon/>:<OpenInFullIcon/>}
            {isSmall?<></>:isOpen?"Close Port":"Open Port"}
        </Button>        
    )
}

export default OpenCloseButton