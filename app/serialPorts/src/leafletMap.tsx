
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const Map = () => {
  const defaultCenter: [number, number] = [35.6895, 139.6917]; // 例：東京の緯度と経度
  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "40vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
        url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
      />
      
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
