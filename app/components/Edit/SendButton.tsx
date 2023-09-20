import { Button } from '@mui/material';

import JsSerialWeb from 'js-serial-web';
import { useSend, useIsOpen } from '@/app/webSerialDataProvider/src/useJsSerialWeb'

const SendButton = ({id, jsw}:{id:number, jsw:JsSerialWeb})=>{
    const isOpen = useIsOpen(jsw, id)
    const sendData = useSend(jsw, id)
    return (
        <Button
            disabled={!isOpen}
            onClick={()=>sendData(new TextEncoder().encode(`Hello world ${((new Date()).getTime()).toString()}\n`))}
        >
            SEND            
        </Button>        
    )
}

export default SendButton