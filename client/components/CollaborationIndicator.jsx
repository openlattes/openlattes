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

    this.setSelectedMembers = this.setSelectedMembers.bind(this);
    this.handleCampusChange = this.handleCampusChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.toggleEmptyNodes = this.toggleEmptyNodes.bind(this);
    this.filterCampus = this.filterCampus.bind(this);
    this.filterEmptyNodes = this.filterEmptyNodes.bind(this);
    this.getColorHash = this.getColorHash.bind(this);
    this.filterProductionType = this.filterProductionType.bind(this);
  }

  setSelectedMembers(nodes) {
    const { selectedMembers } = this.props;

    /* eslint-disable no-underscore-dangle */
    return nodes.map((node) => {
      if (selectedMembers.includes(node._id)) {
        return { ...node, selected: true };
      }
      return { ...node, selected: false };
    });
    /* eslint-enable no-underscore-dangle */
  }

  getColorHash(nodes) {
    const { selection } = this.state;

    if (selection === 'Todos') {
      const colors = [
        red[200], red[500], red[800], blue[200], blue[500],
        blue[800], green[200], green[500], green[800], yellow[300],
      ];

      return nodes
        .reduce((colorHash, { campus }) => {
          if (!colorHash.has(campus)) {
            colorHash.set(campus, colors.pop());
          }

          return colorHash;
        }, new Map());
    }

    return new Map();
  }

  filterCampus({ nodes, edges }) {
    const { selection } = this.state;

    if (selection !== 'Todos') {
      const filteredNodes = nodes
        .filter(({ campus }) => campus === selection);

      const ids = filteredNodes.map(({ id }) => id);

      return {
        nodes: filteredNodes,
        edges: edges.filter(({ source, target }) =>
          ids.includes(source) && ids.includes(target)),
      };
    }

    return { nodes, edges };
  }

  filterProductionType(edges) {
    const { typeSelection } = this.state;

    if (typeSelection !== 'Todos') {
      return edges
        .reduce((filteredEdges, edge) => {
          const { productions } = edge;
          const filteredProductions = productions.filter(({ type }) => type === typeSelection);

          if (filteredProductions.length) {
            return [
              ...filteredEdges,
              {
                ...edge,
                productions: filteredProductions,
                weight: filteredProductions.length,
              },
            ];
          }

          return filteredEdges;
        }, []);
    }

    return edges;
  }

  filterEmptyNodes({ edges, nodes }) {
    const { emptyNodes } = this.state;

    if (!emptyNodes) {
      const edgesIds = edges
        .reduce((set, { source, target }) =>
          new Set([...set, source, target]), new Set());

      return nodes.filter(({ id }) => edgesIds.has(id));
    }

    return nodes;
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
    const { emptyNodes } = this.state;

    return (
      <Query query={GET_GRAPH} variables={{ selectedMembers }}>
        {({
          loading, error, data,
        }) => {
          if (loading) return <p>loading...</p>;
          if (error) return <p>error</p>;

          const allOption = { label: 'Todos', value: 'Todos' };

          const campusOptions = [
            ...data.nodes
              .reduce((set, { campus }) => set.add(campus), new Set()),
            ]
            .reverse()
            .map(campus => ({ label: campus, value: campus }));

          const filteredCampus = this.filterCampus(data);

          const typesOptions = [
            ...filteredCampus.edges
              .reduce((set, { productions }) => {
                const types = productions.map(({ type }) => type);

                return new Set([...set, ...types]);
              }, new Set()),
            ]
            .map(type => ({ label: type, value: type }));

          const edges = this.filterProductionType(filteredCampus.edges);

          const nodes = this.filterEmptyNodes({ nodes: filteredCampus.nodes, edges });

          const colorHash = this.getColorHash(nodes);

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
