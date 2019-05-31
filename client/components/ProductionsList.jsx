import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import SimpleTable from './SimpleTable';
import Loading from './Loading';

const GET_PRODUCTIONS = gql`
  query Productions(
    $year: Int,
    $memberName: String,
    $types: [String],
    $members: [ID],
    $group: [String]
  ) {
    productions(
      year: $year,
      memberName: $memberName,
      types: $types,
      members: $members
      group: $group
    ) {
      _id
      title
      authors
      type
    }
  }
`;

const ProductionsList = ({
  year, memberName, types, group, members,
}) => (
  <Query
    query={GET_PRODUCTIONS}
    variables={{
      year, memberName, types, group, members,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loading />;
      if (error) return <p>Erro</p>;

      return (
        <SimpleTable
          data={data.productions.map(({
            _id, title, authors, type,
          }) => ({
            id: _id, title, authors, type,
          }))}
          headers={[
            {
              id: 'title', align: 'left', disablePadding: false, label: 'Título',
            },
            {
              id: 'authors', align: 'left', disablePadding: false, label: 'Autores',
            },
            {
              id: 'type', align: 'left', disablePadding: false, label: 'Tipo',
            },
          ]}
        />
      );
    }}
  </Query>
);

ProductionsList.propTypes = {
  year: PropTypes.number,
  memberName: PropTypes.string,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
  group: PropTypes.string,
  members: PropTypes
    .arrayOf(PropTypes.string),
};

ProductionsList.defaultProps = {
  year: undefined,
  memberName: undefined,
  group: undefined,
  members: undefined,
};

export default ProductionsList;
