// in app/page.tsx
"use client";
import { combineDataProviders, Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import serialPorts from "./serialPorts/src/"
import jsonServerProvider from "ra-data-json-server";
import webSerialProvider from "./webSerialDataProvider/src";

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
  <Admin dataProvider={dataProvider}>
    <Resource name="webserialport" {...serialPorts} />
    <Resource name="users" list={ListGuesser} edit={EditGuesser} recordRepresentation="name" />
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} recordRepresentation="title" />
    <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);

export default App;
