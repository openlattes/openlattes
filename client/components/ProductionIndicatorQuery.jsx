import React, { Component } from 'react';
import { Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Loading from './Loading';

const GET_INDICATOR = gql`
  query Indicator($collection: Collection, $by: By $members: [ID], $campus: [String]) {
    indicator(collection: $collection, by: $by, members: $members, campus: $campus) {
      year
      member
      count
      type
    }
    members(members: $members) {
      campus
    }
  }
`;

class ProductionIndicatorQuery extends Component {
  render() {
    const {
      collection, by, selectedMembers, campusSelection,
    } = this.props;

    return (
      <Query
        query={GET_INDICATOR}
        variables={{
          collection,
          by,
          members: selectedMembers,
          campus: campusSelection === 'Todos' ? undefined : campusSelection,
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return 'Não foi possível carregar o gráfico.';

          const { indicator, members } = data;

          const types = indicator
            .reduce((set, { type }) => set.add(type), new Set());

          const campus = [...members
            .reduce((set, member) => set.add(member.campus), new Set())];

          return React.cloneElement(this.props.children, {
            indicator,
            checkboxesValues: types,
            campusNames: campus,
            by,
            collection,
            campusSelection,
            selectedMembers,
          });
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
  campusSelection: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  children: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

ProductionIndicatorQuery.defaultProps = {
  collection: undefined,
  by: 'year',
};

export default withApollo(ProductionIndicatorQuery);
