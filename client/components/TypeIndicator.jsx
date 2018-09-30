import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import BarChart from './BarChart';

const GET_INDICATOR = gql`
  {
    typeIndicator {
      type
      count
    }
  }
`;

const TypeIndicator = () => (
  <Query query={GET_INDICATOR}>
    {({ loading, error, data }) => {
      if (loading) return 'Carregando...';
      if (error) return 'Não foi possível carregar o gráfico.';

      return <BarChart data={data.typeIndicator} />;
    }}
  </Query>
);

export default TypeIndicator;
