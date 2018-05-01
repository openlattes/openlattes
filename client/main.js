import { Meteor } from 'meteor/meteor';
import { createApolloClient } from 'meteor/apollo';
import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import App from '../imports/ui/App.js';

Meteor.startup(() => {
  render(
    <ApolloProvider client={createApolloClient()}>
      <App />
    </ApolloProvider>,
    document.getElementById('root')
  )
});
