import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";

import Chat from './Chat';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import "./index.css";

function App() {
  return (
    <Chat />
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
