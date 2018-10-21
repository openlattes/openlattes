import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import BarChart from './BarChart';

const GET_INDICATOR = gql`
  query TypeIndicator($selectedMembers: [ID]) {
    typeIndicator(members: $selectedMembers) {
      type
      count
    }
  }
`;

const TypeIndicator = ({ selectedMembers }) => (
  <Query query={GET_INDICATOR} variables={{ selectedMembers }}>
    {({ loading, error, data }) => {
      if (loading) return 'Carregando...';
      if (error) return 'Não foi possível carregar o gráfico.';

      return <BarChart data={data.typeIndicator} />;
    }}
  </Query>
);

TypeIndicator.propTypes = {
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
};

export default TypeIndicator;
