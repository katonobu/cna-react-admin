import { useEffect, useContext } from 'react'
import { List, TopToolbar } from 'react-admin';
import { useRefresh } from 'react-admin';
import { JsSerialWebContext } from '@/app/AppRoot'
import { useSerialPorts } from '@/app/webSerialDataProvider/src/useJsSerialWeb'
import SelectAddButton  from '@/app/components/List/SelectAddButton';
import Empty from '@/app/components/List/Empty'
import ListItems from '@/app/components/List/ListItems';

// 画面上部に表示するボタンの設定
const ListActions = () => (
    <TopToolbar>
        <SelectAddButton/>
    </TopToolbar>    
)

export const SerialPortsList = () => {
    const jsw = useContext(JsSerialWebContext)
    const serialPorts = useSerialPorts(jsw)
    const refresh = useRefresh()
    useEffect(()=>{
        refresh()
    },[serialPorts, refresh])
    return (
        <List
            empty={<Empty />}        
            actions={<ListActions/>}
        >
            <ListItems jsw={jsw}/>
        </List>
    )
};
