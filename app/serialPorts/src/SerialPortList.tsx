import { Datagrid, List, TextField, NumberField} from 'react-admin';

export const SerialPortsList = () => {
    return (
        <List>
            <Datagrid rowClick={(id) =>id==="0"?'create':'edit'}>
                <TextField source="id" />
                <TextField source="vid" />
                <TextField source="venderName" />
                <TextField source="pid" />
                <TextField source="isOpen" />
            </Datagrid>
        </List>
    )
};
/*
                <TextField source="rx" />
                <TextField source="errorStr" />
                <TextField source="dataCarrierDetect" />
                <TextField source="clearToSend" />
                <TextField source="ringIndicator" />
                <TextField source="dataSetReady" />
                <TextField source="dataTerminalReady" />
                <TextField source="requestToSend" />
*/