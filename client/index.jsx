import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import App from './components/App';

const client = new ApolloClient({
  uri: '/graphql',
  clientState: {
    defaults: { selectedMembers: [] },
  },
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
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
