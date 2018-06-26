import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "semantic-ui-css/semantic.min.css";

import appSyncConfig from "./AppSync";
import { ApolloProvider } from "react-apollo";
import AWSAppSyncClient, { defaultDataIdFromObject } from "aws-appsync";
import { Rehydrated } from "aws-appsync-react";

import './App.css';
import Nav from './nav';
import Posts from './Components/posts';
import CreatePost from './Components/createPost';
import ViewPost from './Components/viewPost';

const Home = () => (
  <div className="ui container">
    <Posts />
  </div>
);

const App = () => (
  <div className="app-contaianer">
    <Router>
      <div>
        <Nav />
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route path="/post/:id" component={ViewPost} />
          <Route path="/createPost" component={CreatePost} />
        </Switch>
      </div>
    </Router>
  </div>
);

const client = new AWSAppSyncClient({
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  auth: {
    type: appSyncConfig.authenticationType,
    apiKey: appSyncConfig.apiKey,
  },
  cacheOptions: {
    dataIdFromObject: (obj) => {
      let id = defaultDataIdFromObject(obj);

      if (!id) {
        const { __typename: typename } = obj;
        switch (typename) {
          case 'Comment':
            return `${typename}:${obj.commentId}`;
          default:
            return id;
        }
      }

      return id;
    }
  }
});

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>
);

export default WithProvider;
