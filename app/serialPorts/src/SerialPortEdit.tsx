import { useState } from 'react'
import { Show, SimpleShowLayout/*, Button*/} from 'react-admin';
import { DeleteButton, TopToolbar, ListButton, useRecordContext } from 'react-admin';
import { useGetRecordId } from 'react-admin'
import { useOpen, useClose, useSend, useReceieve, useIsOpen } from '../../webSerialDataProvider/src/webSerialDataProvider'
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
    const sendData = useSend(recordId.toString(10))
    return (
        <Button
            disabled={!isOpen}
            onClick={()=>sendData(new TextEncoder().encode(`Hello world ${((new Date()).getTime()).toString()}\n`))}
        >
            SEND            
        </Button>        
    )
}

// https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/button/ListButton.tsx
// によれば、単にButtonの子要素にアイコンを指定しているだけ
const OpenCloseButton = ()=> {
	const recordId = useGetRecordId()
    const open = useOpen(recordId.toString(10))
    const close = useClose(recordId.toString(10))
    const receive = useReceieve(recordId.toString(10))
    const isOpen = useIsOpen(recordId.toString(10))
    const [disabled, setDisabled] = useState(false)
    const isSmall = useMediaQuery((theme:any) => theme.breakpoints.down('sm'));    
    return (
        <Button
            disabled = {disabled}
            onClick={()=>{
                if (isOpen) {
                    setDisabled(true)
                    close()
                    .then((errStr)=>{
                        if (errStr) {
                            console.error(errStr)
                        }
                        setDisabled(false)
                    })
                    .catch(()=>setDisabled(false))
                } else {
                    setDisabled(true)
                    open({baudRate:115200})
                    .then((errStr)=>{
                        if (errStr) {
                            console.error(errStr)
                        } else {
                            receive(0,0)
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
    const record = useRecordContext();
    const isOpen = useIsOpen(recordId.toString(10))
    if(record && 'venderName' in record && 'isOpen' in record){
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
