import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Graph from './Graph';
import GraphData from '../data/GraphData';
import SelectField from './SelectField';
import db from '../db';

const GET_GRAPH = gql`
  query CollaborationIndicator($selectedMembers: [ID]) {
    nodes(members: $selectedMembers) {
      _id
      fullName
      campus
    }
    edges(members: $selectedMembers) {
      source
      target
      weight
      productions {
        type
      }
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

class CollaborationIndicator extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selection: 'Todos',
      typeSelection: 'Todos',
      emptyNodes: false,
      groupNames: [
        'Nenhum',
        ...(props.selectedMembers.length ? ['Seleção Atual'] : []),
      ],
      groupSelection: props.selectedMembers.length ? 'Seleção Atual' : 'Nenhum',
      selectedGroupMembers: props.selectedMembers.length ? props.selectedMembers : [],
    };

    this.handleCampusChange = this.handleCampusChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.toggleEmptyNodes = this.toggleEmptyNodes.bind(this);
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

  handleGroupChange(e) {
    const groupSelection = e.target.value;
    const { client } = this.props;

    if (groupSelection === 'Nenhum') {
      this.setState({
        groupSelection,
        selectedGroupMembers: [],
        selection: 'Todos',
      });
    } else if (groupSelection === 'Seleção Atual') {
      // Members currently selected in the table
      this.setState({
        groupSelection,
        selectedGroupMembers: this.props.selectedMembers,
        selection: 'Todos',
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
            selection: 'Todos',
          });
        })
        .catch(() => {
          this.setState({ groupSelection });
        });
    }
  }

  handleCampusChange(e) {
    this.setState({
      selection: e.target.value,
      typeSelection: 'Todos',
      emptyNodes: false,
    });
  }

  handleTypeChange(e) {
    this.setState({
      typeSelection: e.target.value,
    });
  }

  toggleEmptyNodes(e) {
    this.setState({
      emptyNodes: e.target.checked,
    });
  }

  render() {
    const {
      selection, typeSelection, emptyNodes, groupSelection, groupNames, selectedGroupMembers,
    } = this.state;

    const groupOptions = groupNames
      .map(option => ({ value: option, label: option }));

    let groupFilter;

    if (groupOptions.length > 1) {
      groupFilter = (
        <SelectField
          key={1}
          options={groupOptions}
          onChange={this.handleGroupChange}
          value={groupSelection}
          label="Grupos"
        />
      );
    }

    return (
      <Query query={GET_GRAPH} variables={{ selectedMembers: selectedGroupMembers }}>
        {({
          loading, error, data,
        }) => {
          if (loading) return <p>loading...</p>;
          if (error) return <p>error</p>;

          const graph = new GraphData(data);

          const allOption = { label: 'Todos', value: 'Todos' };

          const campusOptions = graph
            .extractCampus()
            .map(campus => ({ label: campus, value: campus }));

          const filteredCampus = graph.filterByCampus(selection);

          const typesOptions = filteredCampus
            .extractProductionTypes()
            .map(type => ({ label: type, value: type }));

          const filteredType = filteredCampus.filterByProductionType(typeSelection);

          const colors = [
            red[200], red[500], red[800], blue[200], blue[500],
            blue[800], green[200], green[500], green[800], yellow[300],
          ];

          const colorHash = new Map(filteredType
            .extractCampus()
            .map(campus => [campus, colors.pop()]));

          const { nodes, edges } = emptyNodes ?
            filteredType : filteredType.removeNodesWithoutEdges();

          return (
            <div>
              {groupFilter}
              <SelectField
                onChange={this.handleCampusChange}
                value={this.state.selection}
                options={[allOption, ...campusOptions]}
                label="Campus"
              />
              <SelectField
                onChange={this.handleTypeChange}
                value={this.state.typeSelection}
                options={[allOption, ...typesOptions]}
                label="Tipo de Produção"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={emptyNodes}
                    onChange={this.toggleEmptyNodes}
                    value="emptyNodes"
                  />
                }
                label="Membros sem coautorias"
              />
              <Graph
                data={{ edges, nodes }}
                colorHash={colorHash}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

CollaborationIndicator.propTypes = {
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
  /* eslint-disable react/forbid-prop-types */
  client: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default withApollo(CollaborationIndicator);
