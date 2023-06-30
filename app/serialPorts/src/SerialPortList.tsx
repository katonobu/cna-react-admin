import { Datagrid, List, TextField, Button, TopToolbar, ExportButton} from 'react-admin';
import { useCreate} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import {useEffect} from 'react'

const AttachButton = () => {
    const [create, { isLoading }] = useCreate('webserialport', {});
    return (
        <Button label="Select/Add" onClick={() => create()} disabled={isLoading}>
            <AddIcon/>
        </Button>
    );
}

const ListActions = () => (
    <TopToolbar>
        <AttachButton/>
        <ExportButton/>
    </TopToolbar>    
)

const Empty = () => {
    const [create, { isLoading }] = useCreate('webserialport', {});
    useEffect(()=>{create()},[create]);
    return (
        <Box textAlign="center" m={1}>
            <Typography variant="h4" paragraph>
                No registrated serialport available
            </Typography>
            <Typography variant="body1">
                Select / Registrate one 
            </Typography>
            <AttachButton />
        </Box>
    )
}

export const SerialPortsList = () => {
    return (
        <List
            empty={<Empty />}        
            actions={<ListActions/>}
        >
            <Datagrid
                rowClick='edit'
            >
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
        <CreateButton/>

import * as React from 'react';
import { useUpdate, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
    const [approve, { isLoading }] = useUpdate('comments', { id: record.id, data: { isApproved: true }, previousData: record });
    return <Button label="Approve" onClick={() => approve()} disabled={isLoading} />;
};

                <TextField source="rx" />
                <TextField source="errorStr" />
                <TextField source="dataCarrierDetect" />
                <TextField source="clearToSend" />
                <TextField source="ringIndicator" />
                <TextField source="dataSetReady" />
                <TextField source="dataTerminalReady" />
                <TextField source="requestToSend" />
*/