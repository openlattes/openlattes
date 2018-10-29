import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
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
      productions {
        type
      }
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
    };

    this.handleCampusChange = this.handleCampusChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.toggleEmptyNodes = this.toggleEmptyNodes.bind(this);
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
    const { selectedMembers } = this.props;
    const { selection, typeSelection, emptyNodes } = this.state;

    return (
      <Query query={GET_GRAPH} variables={{ selectedMembers }}>
        {({
          loading, error, data,
        }) => {
          if (loading) return <p>loading...</p>;
          if (error) return <p>error</p>;

          const graph = new GraphData(data);

          const allOption = { label: 'Todos', value: 'Todos' };

          const campusOptions = graph
            .extractCampus()
            .reverse()
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
};

export default CollaborationIndicator;
