import Button from '@mui/material/Button';
import { Show, SimpleShowLayout } from 'react-admin';
import { DeleteButton, TopToolbar, ListButton, useRecordContext } from 'react-admin';
import {useEffect, useState} from 'react'
import webSerialPorts from '../../webSerialDataProvider/src/webSerialPorts'
import { useRefresh} from 'react-admin';
import { Typography } from '@mui/material';

// 画面右上のボタン群の設定
const Actions = () => {
    const record = useRecordContext();
    const refresh = useRefresh();
    const [id, setId] = useState<string>("")
    useEffect(()=>{
        if (record && 'id' in record && typeof(record.id) === 'string' && record.id !== id) {
            setId((old)=>{
                return record.id as string
            })
        }
    },[record, id, refresh])
    useEffect(()=>{
        if (id !== "") {
            console.log("SubScribe isOpen")
            const unsubscribe = webSerialPorts.getPortById(id).subscribeIsOpen(()=>{
                refresh();
                console.log("refresh is called by Open")
            })
            return (()=>{
                console.log("UnsubScribe isOpen")                
                unsubscribe()
            })
        }
    },[id, refresh])

    let isOpen:boolean = false
    if(record && 'id' in record && 'venderName' in record && 'isOpen' in record){
        isOpen = record.isOpen === 'Open'
    }
    let buttonText = ""
    if (isOpen) {
        buttonText = "Close Port"
    } else {
        buttonText = "Open Port"
    }
    return (
        <TopToolbar>
            <Button
            color="primary"
            disabled={!isOpen}
            onClick={()=>{
                const port = webSerialPorts.getPortById(record.id)
                port.send(new TextEncoder().encode("Hello world\n"))
            }}>SEND</Button>        
            <Button color="primary" onClick={()=>{
                const port = webSerialPorts.getPortById(record.id)
                if (isOpen) {
                    port.close()
                } else {
                    port.open({baudRate:115200})
                    .then((errStr)=>{
                        if (errStr) {
                            console.error(errStr)
                        } else {
                            port.receive(0,0)
                        }
                    })
                }
            }}>{buttonText}</Button>        
            <ListButton />
            <DeleteButton />
        </TopToolbar>
    );
};

// 画面右側の表示
const Aside = () => {
    const record = useRecordContext();
    if(record && 'id' in record && 'venderName' in record && 'isOpen' in record){
        return (
            <ul style={{ width: 200, margin: '1em' }}>
                <li style={{listStyle: 'none'}}>ID:{record.id}</li>
                <li style={{listStyle: 'none'}}>Name:{record.venderName}</li>
                <li style={{listStyle: 'none'}}>Open:{record.isOpen}</li>
            </ul>
        );
    } else {
        return (<></>)
    }
};

// タイトル文字列の設定
const Title = () => {
    const record = useRecordContext();
    return <span>{record && 'venderName' in record ? record.venderName : record.id}</span>;
};

// 受信処理&表示
const RxData = () => {
    const record = useRecordContext();
    const refresh = useRefresh();
    const [rxDatas, setRxData] = useState<string[]>([""])
    const [id, setId] = useState("")
    useEffect(()=>{
        if (record && 'id' in record && record.id !== id) {
            setId((old)=>{
                return record.id as string
            })
        }
    },[record, id, refresh])
    useEffect(()=>{
        if (id !== "") {
            console.log("SubScribe Rx")
            const unsubscribe = webSerialPorts.getPortById(id).subscribeRx(()=>{
//                refresh();
                const rxU8a = webSerialPorts.getPortById(id).rx
                console.log(rxU8a)
                if (rxU8a) {
                    const rxStr = new TextDecoder().decode(rxU8a)
                    setRxData((old)=>[...old, rxStr])
                    console.log(`refresh is called by Rx:${rxStr}`)
                }
            })
            return (()=>{
                console.log("UnsubScribe Rx")                
                unsubscribe()
            })
        }
    },[id, refresh])

    return (
        rxDatas.map((line, index) =>(
            <Typography key={index.toString()}>{line}</Typography>
        ))
    )
}

export const SerialPortEdit = () => {
    return (
        <Show
            actions={<Actions />}
            aside={<Aside />}    
            title={<Title />}
        >
            <SimpleShowLayout>
                <RxData></RxData>
            </SimpleShowLayout>
        </Show>
    );
}
