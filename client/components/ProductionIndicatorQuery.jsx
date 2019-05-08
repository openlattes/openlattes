import React, { Component } from 'react';
import { Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import ProductionIndicator from './ProductionIndicator';
import SelectField from './SelectField';
import db from '../db';

const GET_INDICATOR = gql`
  query Indicator($collection: Collection, $by: By $members: [ID], $campus: [String]) {
    indicator(collection: $collection, by: $by, members: $members, campus: $campus) {
      year
      member
      count
      type
    }
    members(members: $members) {
      campus
    }
  }
`;

const GET_MEMBERS_IDS = gql`
  query Members_IDs($lattesIds: [String]) {
    members(lattesIds: $lattesIds) {
      _id
    }
  }
`;

class ProductionIndicatorQuery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campusSelection: 'Todos',
      groupNames: [
        'Nenhum',
        ...(props.selectedMembers.length ? ['Atual'] : []),
      ],
      groupSelection: props.selectedMembers.length ? 'Atual' : 'Nenhum',
      selectedGroupMembers: props.selectedMembers.length ? props.selectedMembers : [],
    };

    this.handleCampusChange = this.handleCampusChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
  }

  componentDidMount() {
    db.groups.toArray()
      .then((groups) => {
        this.setState({
          groupNames: [
            ...this.state.groupNames,
            ...groups.map(({ name }) => name),
          ],
        });
      });
  }

  handleCampusChange(e) {
    this.setState({
      campusSelection: e.target.value,
    });
  }

  handleGroupChange(e) {
    const groupSelection = e.target.value;
    const { client } = this.props;

    if (groupSelection === 'Nenhum') {
      this.setState({
        groupSelection,
        selectedGroupMembers: [],
      });
    } else if (groupSelection === 'Atual') {
      // Members currently selected in the table
      this.setState({
        groupSelection,
        selectedGroupMembers: this.props.selectedMembers,
      });
    } else {
      // Group created by the user

      // Get list of Lattes IDs from local DB
      db.groups.get({ name: groupSelection })
        // Fetch API to convert to ObjectIds
        .then(group => client.query({
          query: GET_MEMBERS_IDS,
          variables: {
            lattesIds: group.members,
          },
        }))
        .then(({ data }) => {
          this.setState({
            groupSelection,
            selectedGroupMembers: data.members.map(({ _id }) => _id),
          });
        })
        .catch(() => {
          this.setState({ groupSelection });
        });
    }
  }

  render() {
    const { collection, by } = this.props;
    const {
      campusSelection, groupSelection, groupNames, selectedGroupMembers,
    } = this.state;
    const campus = campusSelection === 'Todos' ? undefined : campusSelection;

    const groupOptions = groupNames
      .map(option => ({ value: option, label: option }));

    const filters = [];

    if (groupOptions.length > 1) {
      filters.push((
        <SelectField
          key={1}
          options={groupOptions}
          onChange={this.handleGroupChange}
          value={groupSelection}
          label="Seleções"
        />
      ));
    }

    return (
      <Query
        query={GET_INDICATOR}
        variables={{
          collection, by, members: selectedGroupMembers, campus,
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return 'Carregando...';
          if (error) return 'Não foi possível carregar o gráfico.';

          const types = data.indicator
            .reduce((set, { type }) => set.add(type), new Set());

          const campusOptions = [
            'Todos',
            ...data.members
              .reduce((set, member) => set.add(member.campus), new Set()),
          ].map(option => ({ value: option, label: option }));

          if (campusOptions.length > 2) {
            filters.push((
              <SelectField
                key={2}
                options={campusOptions}
                onChange={this.handleCampusChange}
                value={campusSelection}
                label="Campus"
              />
            ));
          }

          return (
            <ProductionIndicator
              chartData={data.indicator}
              by={by}
              checkboxesValues={types}
              filters={filters}
              collection={collection}
            />
          );
        }}
      </Query>
    );
  }
}

ProductionIndicatorQuery.propTypes = {
  collection: PropTypes.string,
  by: PropTypes.string,
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
  /* eslint-disable react/forbid-prop-types */
  client: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

ProductionIndicatorQuery.defaultProps = {
  collection: undefined,
  by: 'year',
};

export default withApollo(ProductionIndicatorQuery);
