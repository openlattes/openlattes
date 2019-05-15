import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import GraphData from '../data/GraphData';

const GET_GRAPH = gql`
  query CollaborationIndicator($selectedMembers: [ID]) {
    nodes(members: $selectedMembers) {
      _id
      fullName
      campus
    }
    edges(members: $selectedMembers) {
      source
      target
      weight
      productions {
        type
      }
    }
  }
`;

class CollaborationIndicatorQuery extends Component {
  render() {
    const { selectedMembers, campusSelection, typeSelection } = this.props;

    return (
      <Query query={GET_GRAPH} variables={{ selectedMembers }}>
        {({ loading, error, data }) => {
          if (loading) return <p>loading...</p>;
          if (error) return <p>error</p>;

          const graph = new GraphData(data);

          const campus = graph.extractCampus();

          const filteredCampus = graph.filterByCampus(campusSelection);

          const types = filteredCampus.extractProductionTypes();

          const { nodes, edges } = filteredCampus
            .filterByProductionType(typeSelection);

          return React.cloneElement(this.props.children, {
            graph: { nodes, edges },
            campusNames: campus,
            typeNames: types,
            campusSelection,
            typeSelection,
          });
        }}
      </Query>
    );
  }
}

CollaborationIndicatorQuery.propTypes = {
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
  /* eslint-disable react/forbid-prop-types */
  children: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  campusSelection: PropTypes.string.isRequired,
  typeSelection: PropTypes.string.isRequired,
};

export default CollaborationIndicatorQuery;
