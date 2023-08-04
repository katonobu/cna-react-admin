import dynamic from "next/dynamic";
import {useMemo} from 'react'

const RxTerminal = (props:any) => {
  const RxTerm = useMemo(
    () =>
      dynamic(() => import("./RxTerminalStatic"), {
        loading: () => null,
        ssr: false,
      }),
    []
  );
  return <RxTerm />;
}

export default RxTerminal
