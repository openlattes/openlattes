import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Graph from './Graph';

const GET_GRAPH = gql`
  query CollaborationIndicator($selectedMembers: [ID]) {
    nodes(members: $selectedMembers) {
      id
      fullName
    }
    edges(members: $selectedMembers) {
      source
      target
      weight
    }
  }
`;

const CollaborationIndicator = ({ selectedMembers }) => (
  <Query query={GET_GRAPH} variables={{ selectedMembers }}>
    {({
      loading, error, data,
    }) => {
      if (loading) return <p>loading...</p>;
      if (error) return <p>error</p>;

      /* eslint-disable no-underscore-dangle */
      return (
        <Graph
          data={{
            ...data,
            nodes: data.nodes
              .map((member) => {
                if (selectedMembers.includes(member._id)) {
                  return { ...member, selected: true };
                }
                return { ...member, selected: false };
              }),
          }}
        />
      );
      /* eslint-enable no-underscore-dangle */
    }}
  </Query>
);

CollaborationIndicator.propTypes = {
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
};

export default CollaborationIndicator;
