import Button from '@mui/material/Button';
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { SaveButton, DeleteButton, Toolbar, TopToolbar, ListButton, useRecordContext } from 'react-admin';

const Actions = () => {
    const record = useRecordContext();
    return (
        <TopToolbar>
            <Button color="primary">Custom Action</Button>        
            <ListButton />
        </TopToolbar>
    );
};

const Aside = () => {
    const record = useRecordContext();
    if(record && 'id' in record && 'venderName' in record && 'isOpen' in record){
        return (
            <ul style={{ width: 200, margin: '1em' }}>
                <li>ID:{record.id}</li>
                <li>Name:{record.venderName}</li>
                <li>Open:{record.isOpen}</li>
            </ul>
        );
    } else {
        return (<></>)
    }
};

const Title = () => {
    const record = useRecordContext();
    return <span>{record && 'venderName' in record ? record.venderName : ''}</span>;
};

const ToolbarWoDelete = (props:any) => (
    <Toolbar {...props} >
        <DeleteButton />
    </Toolbar>
);

export const SerialPortEdit = () => (
    <Edit
        actions={<Actions />}
        aside={<Aside />}    
        title={<Title />}
    >
        <SimpleForm toolbar={<ToolbarWoDelete/>}>
            <TextInput source="id" />
            <TextInput source="venderName" />
        </SimpleForm>
    </Edit>
);

