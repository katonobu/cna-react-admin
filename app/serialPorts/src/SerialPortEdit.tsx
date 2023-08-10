import { useState } from 'react'
import { Show, SimpleShowLayout/*, Button*/} from 'react-admin';
import { DeleteButton, TopToolbar, ListButton, useRecordContext } from 'react-admin';
import { useGetRecordId } from 'react-admin'
import webSerialPorts from '../../webSerialDataProvider/src/webSerialPorts'
import {useIsOpen } from '../../webSerialDataProvider/src/webSerialDataProvider'
import { useMediaQuery, Button } from '@mui/material';
import { SerialPortsDataList} from './SerialPortDataList'
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

const PortDeleteButton = (props:any) => {
	const recordId = useGetRecordId()
    const isOpen = useIsOpen(recordId.toString(10))
    return (
        <DeleteButton disabled={isOpen}></DeleteButton>
    )
}

const SendButton = ()=>{
	const recordId = useGetRecordId()
    const isOpen = useIsOpen(recordId.toString(10))
    return (
        <Button
            disabled={!isOpen}
            onClick={()=>{
                const port = webSerialPorts.getPortById(recordId)
                port.send(new TextEncoder().encode("Hello world\n"))
            }}
        >
            SEND            
        </Button>        
    )
}

// https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/button/ListButton.tsx
// によれば、単にButtonの子要素にアイコンを指定しているだけ
const OpenCloseButton = ()=> {
	const recordId = useGetRecordId()
    const port = webSerialPorts.getPortById(recordId)
    const isOpen = useIsOpen(recordId.toString(10))
    const [disabled, setDisabled] = useState(false)
    const isSmall = useMediaQuery((theme:any) => theme.breakpoints.down('sm'));    
    return (
        <Button
            disabled = {disabled}
            onClick={()=>{
                if (isOpen) {
                    setDisabled(true)
                    port.close()
                    .then((errStr)=>{
                        if (errStr) {
                            console.error(errStr)
                        }
                        setDisabled(false)
                    })
                } else {
                    setDisabled(true)
                    port.open({baudRate:115200})
                    .then((errStr)=>{
                        if (errStr) {
                            console.error(errStr)
                        } else {
                            port.receive(0,0)
                        }
                        setDisabled(false)
                    })
                }
            }}
            sx={{ width: isSmall?'24px':'10em' }}
        >
            {isOpen?<CloseFullscreenIcon/>:<OpenInFullIcon/>}
            {isSmall?<></>:isOpen?"Close Port":"Open Port"}
        </Button>        
    )
}

// 画面右上のボタン群の設定
const Actions = () => (
    <TopToolbar>
        <div style={{ marginRight: 'auto' }}>
            <OpenCloseButton />
            <SendButton />
        </div>
        <div style={{ marginLeft: 'auto' }}>
            <ListButton />
            <PortDeleteButton />
        </div>
    </TopToolbar>
);

// 画面右側の表示
const Aside = () => {
	const recordId = useGetRecordId()
    const isOpen = useIsOpen(recordId.toString(10))
    const record = useRecordContext();
    if(record && 'venderName' in record){
        return (
            <ul style={{ width: 200, margin: '1em' }}>
                <li style={{listStyle: 'none'}}>ID:{recordId}</li>
                <li style={{listStyle: 'none'}}>Name:{record.venderName}</li>
                <li style={{listStyle: 'none'}}>Open:{isOpen.toString()}</li>
            </ul>
        );
    } else {
        return (<></>)
    }
};

// タイトル文字列の設定
const Title = () => {
    const record = useRecordContext();
    return <span>{record && 'venderName' in record ? record.id+':'+record.venderName: record.id}</span>;
};

export const SerialPortEdit = () => {
	const recordId = useGetRecordId()
    const isSmall = useMediaQuery((theme:any) => theme.breakpoints.down('sm'));    
    return (
        <Show
            actions={<Actions />}
            aside={isSmall?<></>:<Aside />}    
            title={<Title />}
            emptyWhileLoading
        >
            <SimpleShowLayout>
                <SerialPortsDataList id={recordId}></SerialPortsDataList>
            </SimpleShowLayout>
        </Show>
    );
}
