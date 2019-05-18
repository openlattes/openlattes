import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import SimpleTable from './SimpleTable';

const GET_SUPERVISIONS = gql`
  query Supervisions(
    $year: Int,
    $memberName: String,
    $types: [String],
    $members: [ID],
    $campus: [String]
  ) {
    supervisions(
      year: $year,
      memberName: $memberName,
      types: $types
      members: $members
      campus: $campus
    ) {
      _id
      documentTitle
      supervisedStudent
      degreeType
    }
  }
`;

const SupervisionsList = ({
  year, memberName, types, campus, members,
}) => (
  <Query
    query={GET_SUPERVISIONS}
    variables={{
      year, memberName, types, campus, members,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Carregando</p>;
      if (error) return <p>Erro</p>;

      return (
        <SimpleTable
          data={data.supervisions.map(({
            _id, documentTitle, supervisedStudent, degreeType,
          }) => ({
            id: _id, documentTitle, supervisedStudent, degreeType,
          }))}
          headers={[
            {
              id: 'documentTitle', numeric: false, disablePadding: false, label: 'Título',
            },
            {
              id: 'supervisedStudent', numeric: false, disablePadding: false, label: 'Autor',
            },
            {
              id: 'degreeType', numeric: false, disablePadding: false, label: 'Tipo',
            },
          ]}
        />
      );
    }}
  </Query>
);

SupervisionsList.propTypes = {
  year: PropTypes.number,
  memberName: PropTypes.string,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
  campus: PropTypes.string,
  members: PropTypes
    .arrayOf(PropTypes.string),
};

SupervisionsList.defaultProps = {
  year: undefined,
  memberName: undefined,
  campus: undefined,
  members: undefined,
};

export default SupervisionsList;
