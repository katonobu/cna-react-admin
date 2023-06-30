// in app/page.tsx
"use client";
import { combineDataProviders, Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import serialPorts from "./serialPorts/src/"
import jsonServerProvider from "ra-data-json-server";
import webSerialProvider from "./webSerialDataProvider/src";
import authProvider from "./authProvider"

const jsonDataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
const serialDataProvider = webSerialProvider("https://jsonplaceholder.typicode.com");
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


const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    requireAuth  
  >
    <Resource name="users" list={ListGuesser} edit={EditGuesser} recordRepresentation="name" />
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} recordRepresentation="title" />
    <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
    <Resource name="webserialport" {...serialPorts} />
  </Admin>
);

export default App;
