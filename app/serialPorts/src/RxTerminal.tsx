import dynamic from "next/dynamic";
import {useMemo} from 'react'

const RxTerminal = (props:any) => {
  const RxTerm = useMemo(
    () =>
      dynamic(() => import("./RxTerminalStatic"), {
        loading: () => <p>Rx Terminal is loading</p>,
        ssr: false,
      }),
    []
  );
  return <RxTerm />;
}

export default RxTerminal
