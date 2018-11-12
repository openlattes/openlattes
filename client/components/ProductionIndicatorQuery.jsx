import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import ProductionIndicator from './ProductionIndicator';

const GET_INDICATOR = gql`
  query Indicator($collection: Collection, $by: By $selectedMembers: [ID]) {
    indicator(collection: $collection, by: $by, members: $selectedMembers) {
      year
      member
      count
      type
    }
  }
`;

class ProductionIndicatorQuery extends Component {
  render() {
    const { collection, by, selectedMembers } = this.props;

    return (
      <Query query={GET_INDICATOR} variables={{ collection, by, selectedMembers }}>
        {({ loading, error, data }) => {
          if (loading) return 'Carregando...';
          if (error) return 'Não foi possível carregar o gráfico.';

          const types = data.indicator
            .reduce((set, { type }) => set.add(type), new Set());

          return (
            <ProductionIndicator
              chartData={data.indicator}
              by={by}
              checkboxesValues={types}
            />
          );
        }}
      </Query>
    );
  }
}

ProductionIndicatorQuery.propTypes = {
  collection: PropTypes.string,
  by: PropTypes.string,
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
};

ProductionIndicatorQuery.defaultProps = {
  collection: undefined,
  by: 'year',
};

export default ProductionIndicatorQuery;
