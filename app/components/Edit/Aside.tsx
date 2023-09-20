import { useContext } from 'react'
import { useGetRecordId, useRecordContext } from 'react-admin'

import { JsSerialWebContext } from '@/app/AppRoot'
import { useIsOpen } from '@/app/webSerialDataProvider/src/useJsSerialWeb'

// 画面右側の表示
const Aside = () => {
    const id = parseInt(useGetRecordId().toString(10), 10)
    const record = useRecordContext();
    const jsw = useContext(JsSerialWebContext)
    const isOpen = useIsOpen(jsw, id)
    if(record && 'venderName' in record && 'isOpen' in record){
        return (
            <ul style={{ width: 200, margin: '1em' }}>
                <li style={{listStyle: 'none'}}>ID:{id.toString(10)}</li>
                <li style={{listStyle: 'none'}}>Open:{isOpen.toString()}</li>
            </ul>
        );
    } else {
        return (<></>)
    }
};

export default Aside