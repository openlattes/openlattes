import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import ProductionVisualization from './ProductionVisualization';
import ProductionIndicatorQuery from './ProductionIndicatorQuery';
import db from '../db';

const GET_MEMBERS_IDS = gql`
  query Members_IDs($lattesIds: [String]) {
    members(lattesIds: $lattesIds) {
      _id
    }
  }
`;

class ProductionIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupSelection: 'Todos',
      selectionNames: [
        'Nenhum',
        ...(props.selectedMembers.length ? ['Seleção Atual'] : []),
      ],
      selection: props.selectedMembers.length ? 'Seleção Atual' : 'Nenhum',
      selectedMembers2: props.selectedMembers.length ? props.selectedMembers : [],
      by: 'year',
    };

    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleByChange = this.handleByChange.bind(this);
  }

  componentDidMount() {
    db.groups.toArray()
      .then((groups) => {
        this.setState({
          selectionNames: [
            ...this.state.selectionNames,
            ...groups.map(({ name }) => name),
          ],
        });
      });
  }

  handleGroupChange(e) {
    this.setState({
      groupSelection: e.target.value,
    });
  }

  handleSelectionChange(e) {
    const selection = e.target.value;
    const { client } = this.props;

    if (selection === 'Nenhum') {
      this.setState({
        selection,
        groupSelection: 'Todos',
        selectedMembers2: [],
      });
    } else if (selection === 'Seleção Atual') {
      // Members currently selected in the table
      this.setState({
        selection,
        groupSelection: 'Todos',
        selectedMembers2: this.props.selectedMembers,
      });
    } else {
      // Group created by the user

      // Get list of Lattes IDs from local DB
      db.groups.get({ name: selection })
        // Fetch API to convert to ObjectIds
        .then(group => client.query({
          query: GET_MEMBERS_IDS,
          variables: {
            lattesIds: group.members,
          },
        }))
        .then(({ data }) => {
          this.setState({
            selection,
            groupSelection: 'Todos',
            selectedMembers2: data.members.map(({ _id }) => _id),
          });
        })
        .catch(() => {
          this.setState({ selection });
        });
    }
  }

  handleByChange(e) {
    const by = e.target.value;

    this.setState({ by });
  }

  render() {
    const { collection } = this.props;
    const {
      selectedMembers2, selectionNames, selection, groupSelection, by,
    } = this.state;

    return (
      <ProductionIndicatorQuery
        collection={collection}
        by={by}
        selectedMembers={selectedMembers2}
        groupSelection={groupSelection}
      >
        <ProductionVisualization
          selectionNames={selectionNames}
          selection={selection}
          onSelectionChange={this.handleSelectionChange}
          onGroupChange={this.handleGroupChange}
          onByChange={this.handleByChange}
        />
      </ProductionIndicatorQuery>
    );
  }
}

ProductionIndicator.propTypes = {
  collection: PropTypes.string,
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
  /* eslint-disable react/forbid-prop-types */
  client: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

ProductionIndicator.defaultProps = {
  collection: undefined,
};

export default withApollo(ProductionIndicator);
