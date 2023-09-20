import { useContext } from 'react'
import { Show, SimpleShowLayout } from 'react-admin';
import { TopToolbar, ListButton } from 'react-admin';
import { useGetRecordId, useRecordContext } from 'react-admin'

import { useMediaQuery } from '@mui/material';

import { JsSerialWebContext } from '@/app/AppRoot'
import { SerialPortsDataList} from '@/app/components/Edit/SerialPortDataList'
import Aside from '@/app/components/Edit/Aside'
import OpenCloseButton from '@/app/components/Edit/OpenCloseButton'
import SendButton from '@/app/components/Edit/SendButton'
import PortDeleteButton from '@/app/components/Edit/PortDeleteButton'

// 画面右上のボタン群の設定
const Actions = () => {
    const id = parseInt(useGetRecordId().toString(10), 10)
    const jsw = useContext(JsSerialWebContext)

    return <TopToolbar>
        <div style={{ marginRight: 'auto' }}>
            <OpenCloseButton id={id} jsw={jsw}/>
            <SendButton id={id} jsw={jsw}/>
        </div>
        <div style={{ marginLeft: 'auto' }}>
            <ListButton />
            <PortDeleteButton id={id} jsw={jsw}/>
        </div>
    </TopToolbar>
}

// タイトル文字列の設定
const Title = () => {
    const record = useRecordContext();
    return <span>ID : {record.id}</span>;
};

export const SerialPortEdit = () => {
    const recordId = parseInt(useGetRecordId().toString(10), 10)
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
