import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import GraphData from '../utils/GraphData';
import Loading from './Loading';

const GET_GRAPH = gql`
  query CollaborationIndicator($selectedMembers: [ID]) {
    nodes(members: $selectedMembers) {
      _id
      fullName
      groups
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
    const { selectedMembers, groupSelection, typeSelection } = this.props;

    return (
      <Query query={GET_GRAPH} variables={{ selectedMembers }}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return <p>error</p>;

          const graph = new GraphData(data);

          const group = graph.extractGroup();

          const filteredGroup = graph.filterByGroup(groupSelection);

          const types = filteredGroup.extractProductionTypes();

          const { nodes, edges } = filteredGroup
            .filterByProductionType(typeSelection);

          return React.cloneElement(this.props.children, {
            graph: { nodes, edges },
            groupNames: group,
            typeNames: types,
            groupSelection,
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
  groupSelection: PropTypes.string.isRequired,
  typeSelection: PropTypes.string.isRequired,
};

export default CollaborationIndicatorQuery;
