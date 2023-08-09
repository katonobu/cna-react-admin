import { useRef, useEffect} from 'react'
import { useInfiniteGetList} from 'react-admin';
import { List, ListItem, ListItemText } from '@mui/material';
import { useRxLineBuffer } from '../../webSerialDataProvider/src/webSerialDataProvider'
import { useQueryClient } from 'react-query'

const ExtractText = ({rxData}:{rxData:any}) => {
    return (new Date(rxData.ts)).toLocaleString() + "  " + rxData.data
}

export const InvalidateIfDataUpdated = ({fetchInfo}:any) => {
    const {total, hasNextPage, portIdStr} = fetchInfo
    const {totalLines} = useRxLineBuffer(portIdStr)
    const queryClient = useQueryClient()
    if ((total && total < totalLines && hasNextPage === false) ||
        (total === undefined && 0 < totalLines)){
//        console.log("-----")
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
        meta: {id:parseInt(id, 10)}
    });
//    console.log(data)

    if (hasNextPage) {
        setTimeout(fetchNextPage, 1)
    }

    useEffect(() => {
        if (listRef.current) {
//            console.log("Scroll update")
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [data]);

    const fetchInfo = {
        total, hasNextPage, portIdStr:id
    }
    return (
        <>
            <InvalidateIfDataUpdated fetchInfo={fetchInfo}></InvalidateIfDataUpdated>
            <div ref={listRef}>
                <List dense >
                    {data?.pages.map(page => {
                        return page.data.map(eleData => (
                            <ListItem disablePadding key={eleData.id}>
                                <ListItemText>
                                    <ExtractText rxData={eleData}></ExtractText>
                                </ListItemText>
                            </ListItem>
                        ));
                    })}
                </List>
            </div>
        </>
    );
}
