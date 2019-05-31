import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import SimpleTable from './SimpleTable';
import Loading from './Loading';

const GET_SUPERVISIONS = gql`
  query Supervisions(
    $year: Int,
    $memberName: String,
    $types: [String],
    $members: [ID],
    $group: [String]
  ) {
    supervisions(
      year: $year,
      memberName: $memberName,
      types: $types
      members: $members
      group: $group
    ) {
      _id
      documentTitle
      supervisedStudent
      degreeType
    }
  }
`;

const SupervisionsList = ({
  year, memberName, types, group, members,
}) => (
  <Query
    query={GET_SUPERVISIONS}
    variables={{
      year, memberName, types, group, members,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loading />;
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
              id: 'documentTitle', align: 'left', disablePadding: false, label: 'Título',
            },
            {
              id: 'supervisedStudent', align: 'left', disablePadding: false, label: 'Autor',
            },
            {
              id: 'degreeType', align: 'left', disablePadding: false, label: 'Tipo',
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
  group: PropTypes.string,
  members: PropTypes
    .arrayOf(PropTypes.string),
};

SupervisionsList.defaultProps = {
  year: undefined,
  memberName: undefined,
  group: undefined,
  members: undefined,
};

export default SupervisionsList;
