import { useRef, useContext } from 'react'
import { useInfiniteGetList } from 'react-admin';
import { List, ListItem, ListItemText } from '@mui/material';
import { Typography, useMediaQuery } from '@mui/material';
import { useQueryClient } from 'react-query'
import {JsSerialBleWebContext} from '@/app/AppRoot'
import { useRxBufferLen } from '@/app/webSerialDataProvider/src/useJsSerialWeb'

const InvalidateIfDataUpdated = ({fetchInfo}:any) => {
    const {total, hasNextPage, portIdStr} = fetchInfo
    const jsw = useContext(JsSerialBleWebContext)    
    const rxBuffLen = useRxBufferLen(jsw, parseInt(portIdStr, 10))
//    console.log(rxBuffLen)
    const totalLines = rxBuffLen.totalLines
    const queryClient = useQueryClient()
    if ((total && total < totalLines && hasNextPage === false) ||
        (total === undefined && 0 < totalLines)){
//        console.log("-----")
        // 本当は最後のページだけinvalidateさせたい。。。
        queryClient.invalidateQueries({ queryKey: ['Port_Rx_Data']})
    } else {
//        console.log("-----", total, totalLines, hasNextPage)
    }
    return null
}

export const SerialPortsDataList = (props:any) => {
    const listRef = useRef<HTMLDivElement | null>(null);

    const {id} = props
    const {
        data,
        total,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteGetList('Port_Rx_Data', {
        pagination: { page: 0, perPage: 10 },
        meta: {id}
    });

    if (hasNextPage) {
        setTimeout(fetchNextPage, 1)
    }

    /*
    useEffect(() => {
        if (listRef.current) {
//            console.log("Scroll update")
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [data]);
*/
    const fetchInfo = {
        total, hasNextPage, portIdStr:id
    }
    const isSmall = useMediaQuery((theme:any) => theme.breakpoints.down('sm'));    
    return (
        <>
            <InvalidateIfDataUpdated fetchInfo={fetchInfo}></InvalidateIfDataUpdated>
            <div ref={listRef}>
                <List dense >
                    {data?.pages.map(page => {
                        return page.data.map(eleData => {
//                            console.log(page, eleData)
                            return <ListItem disablePadding key={eleData.id}>
                                <ListItemText
                                    style={{ margin: '0', padding: '0' }}
                                    disableTypography
                                    primary={
                                        <Typography style={{ margin: '0', padding: '0', whiteSpace: 'pre' }}>
                                            {isSmall?null:(<span style={{ fontFamily: 'Monospace', margin: '0', padding: '0' }}>
                                                {(new Date(eleData.ts)).toLocaleString() + "." + (eleData.ts%1000).toString(10).padStart(3,'0') + " : "}
                                            </span>)}
                                            <span style={{ fontFamily: 'Monospace', margin: '0', padding: '0', fontWeight: 'bold'}}>
                                                {eleData.data}
                                            </span>
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        });
                    })}
                </List>
            </div>
        </>
    );
}
