import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import brown from '@material-ui/core/colors/brown';
import deepOrange from '@material-ui/core/colors/deepOrange';

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
  palette: {
    primary: brown,
    secondary: deepOrange,
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
