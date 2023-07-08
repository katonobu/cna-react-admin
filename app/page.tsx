"use client";
import dynamic from 'next/dynamic'
import {Resource} from "react-admin";
import serialPorts from "./serialPorts/src/"
import webSerialProvider from "./webSerialDataProvider/src";
import CustomRouteSample from "./CustomRouteSample/src"
import { CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";

const Admin = dynamic(() => import('react-admin').then((module)=>module.Admin), {
  ssr: false, // サーバーサイドレンダリングを無効化
});

const serialDataProvider = webSerialProvider();

const App = () => (
  <Admin
    dataProvider={serialDataProvider}
  >
    <Resource name="webserialport" {...serialPorts} />
    <CustomRoutes>
      <Route path="/customRouteSample" element={<CustomRouteSample />} />
    </CustomRoutes>    
  </Admin>
);

export default App;
