import { Datagrid, List, TextField, Button, TopToolbar, ExportButton} from 'react-admin';
import { useCreate, useRefresh} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import {useEffect} from 'react'
import {useSerialPortLen, subscribeSerialPortLen} from '../../webSerialDataProvider/src/webSerialDataProvider'

const AttachButton = (props:{disable_not_empty?:boolean}) => {
    const {disable_not_empty = false} = props
    const portLen = useSerialPortLen()
    const [create, { isLoading }] = useCreate('webserialport', {});
    return (
        <Button
            label="Select/Add"
            onClick={
                () => create()
            }
            disabled={isLoading || (disable_not_empty && 0 < portLen)}
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

// 全デバイスが削除されたときの表示ページ
const Empty = () => {
    const [create] = useCreate('webserialport', {});
    const portLen = useSerialPortLen()    
    useEffect(()=>{
        if (portLen === 0) {
            create()
        }
    },[create, portLen]);
    return (
        <Box textAlign="center" m={1}>
            <Typography variant="h4" paragraph>
                No registrated serialport available
            </Typography>
            <Typography variant="body1">
                Select / Registrate one 
            </Typography>
            <AttachButton disable_not_empty={true}/>
        </Box>
    )
}

export const SerialPortsList = () => {
    const refresh = useRefresh();
    useEffect(()=>{
        const unsubscribe = subscribeSerialPortLen(refresh)
        return (()=>{
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
