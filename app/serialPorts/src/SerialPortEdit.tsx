import Button from '@mui/material/Button';
import { Edit, SimpleForm } from 'react-admin';
import { DeleteButton, TopToolbar, ListButton, useRecordContext } from 'react-admin';

const Actions = () => {
    const record = useRecordContext();
    let buttonText = ""
    if (record && 'isOpen' in record) {
        if (record.isOpen === 'Open') {
            buttonText = "Close Port"
        } else if (record.isOpen === 'Close'){
            buttonText = "Open Port"
        } else {
            buttonText = "N.A."
        }
    } else {
        buttonText = "N.A."
    }
    return (
        <TopToolbar>
            <Button color="primary">{buttonText}</Button>        
            <ListButton />
            <DeleteButton />
        </TopToolbar>
    );
};

// 画面右側の表示
const Aside = () => {
    const record = useRecordContext();
    console.log(record)
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

export const SerialPortEdit = () => (
    <Edit
        actions={<Actions />}
        aside={<Aside />}    
        title={<Title />}
    >
        <SimpleForm toolbar={<></>}>
            <></>
        </SimpleForm>
    </Edit>
);
//         <SimpleForm toolbar={<ToolbarOnlyDelete/>}>

