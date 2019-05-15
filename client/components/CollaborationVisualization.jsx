import React, { Component } from 'react';
import PropTypes from 'prop-types';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Graph from './Graph';
import GraphData from '../data/GraphData';
import SelectField from './SelectField';

const toOptions = labels =>
  labels.map(name => ({ value: name, label: name }));

class CollaborationVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emptyNodes: false,
    };

    this.toggleEmptyNodes = this.toggleEmptyNodes.bind(this);
  }

  toggleEmptyNodes(e) {
    this.setState({
      emptyNodes: e.target.checked,
    });
  }

  render() {
    const {
      groupNames, campusNames, typeNames,
      groupSelection, campusSelection, typeSelection,
      onGroupChange, onCampusChange, onTypeChange,
    } = this.props;

    const { emptyNodes } = this.state;

    const groupOptions = toOptions(groupNames);
    const campusOptions = toOptions(['Todos', ...campusNames]);
    const typesOptions = toOptions(['Todos', ...typeNames]);

    const colors = [
      red[200], red[500], red[800], blue[200], blue[500],
      blue[800], green[200], green[500], green[800], yellow[300],
    ];

    const graph = new GraphData(this.props.graph);

    const colorHash = new Map(graph
      .extractCampus()
      .map(campus => [campus, colors.pop()]));

    const { nodes, edges } = emptyNodes ?
      graph : graph.removeNodesWithoutEdges();

    return (
      <div>
        <SelectField
          key={1}
          options={groupOptions}
          onChange={onGroupChange}
          value={groupSelection}
          label="Grupos"
        />
        <SelectField
          onChange={onCampusChange}
          value={campusSelection}
          options={campusOptions}
          label="Campus"
        />
        <SelectField
          onChange={onTypeChange}
          value={typeSelection}
          options={typesOptions}
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
  }
}

CollaborationVisualization.propTypes = {
  graph: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
  }),
  groupNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  typeNames: PropTypes.arrayOf(PropTypes.string),
  campusNames: PropTypes.arrayOf(PropTypes.string),
  groupSelection: PropTypes.string.isRequired,
  campusSelection: PropTypes.string,
  typeSelection: PropTypes.string,
  onGroupChange: PropTypes.func.isRequired,
  onCampusChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

CollaborationVisualization.defaultProps = {
  graph: undefined,
  campusNames: undefined,
  typeNames: undefined,
  campusSelection: undefined,
  typeSelection: undefined,
};

export default CollaborationVisualization;
