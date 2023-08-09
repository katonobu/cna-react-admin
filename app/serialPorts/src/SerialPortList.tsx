import { Datagrid, List, TextField, Button, TopToolbar, ExportButton, SimpleList} from 'react-admin';
import { useCreate, useRefresh} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography, useMediaQuery } from '@mui/material';
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
                Select / Add one 
            </Typography>
            <AttachButton disable_not_empty={true}/>
        </Box>
    )
}


// レスポンシブ対応は https://marmelab.com/react-admin/ListTutorial.html#responsive-lists より引用
// バルク選択 enable/disable制御は https://marmelab.com/react-admin/Datagrid.html#isrowselectable より引用
export const SerialPortsList = () => {
    const refresh = useRefresh();
    const isSmall = useMediaQuery((theme:any) => theme.breakpoints.down('sm'));    
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
            {isSmall?(
                <SimpleList
                    primaryText={record => record.id}
                    secondaryText={record => record.venderName}
                    tertiaryText={record => record.isOpen}
                />
            ):(
                <Datagrid
                    rowClick='edit'
                    isRowSelectable={ record => (record.isOpen === 'Close') }
                >
                    <TextField source="id" />
                    <TextField source="vid" />
                    <TextField source="venderName" />
                    <TextField source="pid" />
                    <TextField source="isOpen" />
                </Datagrid>
            )}
        </List>
    )
};
