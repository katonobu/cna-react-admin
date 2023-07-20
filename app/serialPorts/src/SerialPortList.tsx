import { Datagrid, List, TextField, Button, TopToolbar, ExportButton} from 'react-admin';
import { useCreate, useRefresh} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import {useEffect} from 'react'
import { Link } from 'react-router-dom';
import webSerialPorts from '../../webSerialDataProvider/src/webSerialPorts'

const AttachButton = () => {
    const [create, { isLoading }] = useCreate('webserialport', {});
    return (
        <Button
            label="Select/Add"
            onClick={
                () => create()
            }
            disabled={isLoading}
        >
            <AddIcon/>
        </Button>
    );
}

// 画面上部に表示するボタンの設定
const ListActions = () => (
    <TopToolbar>
        <AttachButton/>
        <ExportButton/>
    </TopToolbar>    
)

// 全デバイスが削除したときに呼ばれる
const Empty = () => {
    const [create] = useCreate('webserialport', {});
    
    useEffect(()=>{
        const timerId = setInterval(()=>{
            if (webSerialPorts.getPorts().length === 0) {
                clearInterval(timerId)
                create()
            }
        },100)
    },[create]);
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
        console.log("Subscribe SerialPortList")
        const unsubscribe = webSerialPorts.subscribe(refresh)
        return (()=>{
            console.log("Unsubscribe SerialPortList")
            unsubscribe();
        })
    },[refresh])
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
