import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './components/App';
import theme from './utils/theme';

const client = new ApolloClient({
  uri: '/graphql',
  clientState: {
    defaults: { selectedMembers: [] },
  },
});

render(
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
