import { Datagrid, List, TextField, Button, TopToolbar, SimpleList} from 'react-admin';
import { useCreate} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography, useMediaQuery } from '@mui/material';
import {useSerialPorts} from '../../webSerialDataProvider/src/webSerialDataProvider'

const AttachButton = (props:{
        disable_not_empty?:boolean, 
        variant?:"text" | "outlined" | "contained" | undefined
    }) => {
    const {disable_not_empty = false, variant='text'} = props
    const serialPorts = useSerialPorts()
    const [create, { isLoading }] = useCreate('webserialport', {});
    return (
        <Button
            label="Select/Add"
            onClick={
                () => create()
            }
            variant={variant}
            disabled={isLoading || (disable_not_empty && 0 < serialPorts.length)}
        >
            <AddIcon/>
        </Button>
    );
}

// 画面上部に表示するボタンの設定
const ListActions = () => (
    <TopToolbar>
        <AttachButton/>
    </TopToolbar>    
)

// 全デバイスが削除されたときの表示ページ
// ユーザーが初めてページを訪れたときは、このページが表示される。
// WebSerial-APIサポート有無チェックしてサポートしてないときはcreateを効かせない。
const Empty = () => {
    const available = (typeof window !== 'undefined' && "serial" in navigator)// && false
    if (available){
        return (
            <Box textAlign="center" m={1}>
                <Typography variant="h4" paragraph>
                    No registrated serialport available
                </Typography>
                <Typography variant="h5">
                    Select / Add to start.
                </Typography>
                <AttachButton disable_not_empty={true} variant="outlined"/>
            </Box>
        )
    } else {
        return (
            <Box textAlign="center" m={1}>
                <Typography variant="h4" paragraph>
                This page uses WebSerial-API.
                </Typography>
                <Typography variant="h5" paragraph>
                But your browser dosen&apos;t support it.                
                </Typography>
            </Box>
        )
    }
}


// レスポンシブ対応は https://marmelab.com/react-admin/ListTutorial.html#responsive-lists より引用
// バルク選択 enable/disable制御は https://marmelab.com/react-admin/Datagrid.html#isrowselectable より引用
export const SerialPortsList = () => {
    const isSmall = useMediaQuery((theme:any) => theme.breakpoints.down('sm'));    
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
