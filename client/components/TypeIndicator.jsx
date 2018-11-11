import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import BarChart from './BarChart';

const GET_INDICATOR = gql`
  query TypeIndicator($collection: Collection, $selectedMembers: [ID]) {
    typeIndicator(collection: $collection, members: $selectedMembers) {
      type
      count
    }
  }
`;

const TypeIndicator = ({ collection, selectedMembers }) => (
  <Query query={GET_INDICATOR} variables={{ collection, selectedMembers }}>
    {({ loading, error, data }) => {
      if (loading) return 'Carregando...';
      if (error) return 'Não foi possível carregar o gráfico.';

      return <BarChart data={data.typeIndicator} />;
    }}
  </Query>
);

TypeIndicator.propTypes = {
  collection: PropTypes.string,
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
};

TypeIndicator.defaultProps = {
  collection: undefined,
};

export default TypeIndicator;
