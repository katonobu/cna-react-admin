// in app/page.tsx
"use client";
import dynamic from 'next/dynamic'
import { Resource} from "react-admin";
import serialPorts from "./serialPorts/src/"
import webSerialProvider from "./webSerialDataProvider/src";

const Admin = dynamic(() => import('react-admin').then((module)=>module.Admin), {
  ssr: false, // サーバーサイドレンダリングを無効化
});

const serialDataProvider = webSerialProvider();

const App = () => (
  <Admin
    dataProvider={serialDataProvider}
  >
    <Resource name="webserialport" {...serialPorts} />
  </Admin>
);

export default App;
