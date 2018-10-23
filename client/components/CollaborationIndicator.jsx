import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';

import Graph from './Graph';

const GET_GRAPH = gql`
  query CollaborationIndicator($selectedMembers: [ID]) {
    nodes(members: $selectedMembers) {
      id
      fullName
      campus
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

      const colors = [
        red[200], red[500], red[800], blue[200], blue[500],
        blue[800], green[200], green[500], green[800], yellow[300],
      ];

      const colorHash = data.nodes
        .reduce((map, { campus }) => {
          if (!map.has(campus)) {
            map.set(campus, colors.pop());
          }

          return map;
        }, new Map());

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
          colorHash={colorHash}
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
