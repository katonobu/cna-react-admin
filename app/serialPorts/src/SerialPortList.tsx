import { Datagrid, List, TextField, Button, TopToolbar, ExportButton} from 'react-admin';
import { useCreate, useRefresh} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import {useEffect, useCallback, useState} from 'react'
import webSerialPorts from '../../webSerialDataProvider/src/webSerialPorts'

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
    const refresh = useRefresh();
    useEffect(()=>{
        const unsubscribe = webSerialPorts.subscribe(refresh)
        return (()=>{
            console.log("Unsubscribe")
            unsubscribe();
        })
    },[refresh])
    /*
    const [serialPortsStt, setSerialPortsStt] = useState([])
    const updateSerialPortsList = useCallback(()=>{
        setSerialPortsStt((prevStt:{id:string,openUnsub:()=>boolean}[])=>{
            const newStt = webSerialPorts.getPorts().map((port)=>({id:port.idStr}))
            const appendeds = newStt.filter((port)=>prevStt.find((pp)=>pp.id === port.id)?false:true)
            // appendedsの要素をsubscribe
            const withUnsubscribe = appendeds.map((port)=>({...port, openUnsub:webSerialPorts.getPortById(port.id)?.subscribeIsOpen(refresh)}))
            const removeds = prevStt.filter((port)=>newStt.find((np)=>np.id === port.id)?false:true)
            removeds.forEach((port)=>port.openUnsub())
            // removedsの要素をunsubscribe
            console.log("append:", withUnsubscribe)
            console.log("remove:", removeds)
            return [...withUnsubscribe]
        })
        refresh()
    },[refresh])
    useEffect(()=>{
        updateSerialPortsList()
        const unsubscribe = webSerialPorts.subscribe(updateSerialPortsList)
        return (()=>{
            unsubscribe();
        })
    },[updateSerialPortsList])
    */

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