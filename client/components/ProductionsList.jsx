import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import SimpleTable from './SimpleTable';

const GET_PRODUCTIONS = gql`
  query Productions(
    $year: Int,
    $memberName: String,
    $types: [String],
    $members: [ID],
    $campus: [String]
  ) {
    productions(
      year: $year,
      memberName: $memberName,
      types: $types,
      members: $members
      campus: $campus
    ) {
      _id
      title
      authors
      type
    }
  }
`;

const ProductionsList = ({
  year, memberName, types, campus, members,
}) => (
  <Query
    query={GET_PRODUCTIONS}
    variables={{
      year, memberName, types, campus, members,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Carregando</p>;
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
              id: 'title', numeric: false, disablePadding: false, label: 'Título',
            },
            {
              id: 'authors', numeric: false, disablePadding: false, label: 'Autores',
            },
            {
              id: 'type', numeric: false, disablePadding: false, label: 'Tipo',
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
  campus: PropTypes.string,
  members: PropTypes
    .arrayOf(PropTypes.string),
};

ProductionsList.defaultProps = {
  year: undefined,
  memberName: undefined,
  campus: undefined,
  members: undefined,
};

export default ProductionsList;
