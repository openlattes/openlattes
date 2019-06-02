import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import EnhancedTable from './EnhancedTable';
import Loading from './Loading';
import SavedSelectionsList from './SavedSelectionsList';

const GET_MEMBERS = gql`
  {
    members {
      _id
      fullName
      citationName
      lattesId
      cvLastUpdate
    }
  }
`;

class MembersList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      /* To reload the saved selections table when new
       * selection is added.
       */
      addId: undefined,
    };

    this.handleSelectionSave = this.handleSelectionSave.bind(this);
  }

  handleSelectionSave(id) {
    this.setState({ addId: id });
  }

  render() {
    const { selectedMembers } = this.props;
    const { addId } = this.state;

    return (
      <div>
        <SavedSelectionsList
          key={addId}
          onSelectionSave={this.handleSaveOrDelete}
        />
        <Query query={GET_MEMBERS}>
          {({ loading, error, data }) => {
            if (loading) return <Loading />;
            if (error) return 'Erro';

            return (
              <EnhancedTable
                data={data.members.map(({
                  _id, fullName, citationName, lattesId, cvLastUpdate,
                }) => ({
                  id: _id,
                  fullName,
                  citationName,
                  lattesId,
                  cvLastUpdate: new Date(cvLastUpdate),
                }))}
                selectedMembers={selectedMembers}
                onSelectionSave={this.handleSelectionSave}
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

MembersList.propTypes = {
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string),
};

MembersList.defaultProps = {
  selectedMembers: [],
};

export default MembersList;
