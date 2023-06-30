// in app/page.tsx
"use client";
import dynamic from 'next/dynamic'
import { combineDataProviders, Resource, ListGuesser, EditGuesser } from "react-admin";
import serialPorts from "./serialPorts/src/"
import jsonServerProvider from "ra-data-json-server";
import webSerialProvider from "./webSerialDataProvider/src";
import authProvider from "./authProvider"

const Admin = dynamic(() => import('react-admin').then((module)=>module.Admin), {
  ssr: false, // サーバーサイドレンダリングを無効化
});

const jsonDataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
const serialDataProvider = webSerialProvider();
const dataProvider = combineDataProviders((resource) => {
  switch (resource) {
      case 'users':
      case 'posts':
      case 'comments':
          return jsonDataProvider;
      case 'webserialport':
          return serialDataProvider;
      default:
          throw new Error(`Unknown resource: ${resource}`);
  }
});
const tbAuthProvider = authProvider("https://demo.thingsboard.io:443")

const App = () => (
  <Admin
    dataProvider={dataProvider}
  >
    <Resource name="users" list={ListGuesser} edit={EditGuesser} recordRepresentation="name" />
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} recordRepresentation="title" />
    <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
    <Resource name="webserialport" {...serialPorts} />
  </Admin>
);
/*     authProvider={tbAuthProvider} */

export default App;
