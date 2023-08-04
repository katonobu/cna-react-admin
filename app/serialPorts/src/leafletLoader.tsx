import dynamic from "next/dynamic";
import React from "react";

function MapPage() {
  const Map = React.useMemo(
    () =>
      dynamic(() => import("./leafletMap"), {
        loading: () => null,
        ssr: false,
      }),
    []
  );
  return <Map />;
}

export default MapPage;
