import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const GET_SELECTED_MEMBERS = gql`
  {
    selectedMembers @client
  }
`;

const QuerySelectedMembers = props => (
  <Query query={GET_SELECTED_MEMBERS}>
    {({ data }) => props.children(data.selectedMembers)}
  </Query>
);

QuerySelectedMembers.propTypes = {
  children: PropTypes.func.isRequired,
};

export default QuerySelectedMembers;
