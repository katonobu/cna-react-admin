import { Box, Typography } from '@mui/material';
import SelectAddButton  from '@/app/components/List/SelectAddButton';

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
                <SelectAddButton disable_not_empty={true} variant="outlined"/>
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
export default Empty