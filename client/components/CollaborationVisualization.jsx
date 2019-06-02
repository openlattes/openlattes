import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

import Graph from './Graph';
import GraphData from '../utils/GraphData';
import SelectField from './SelectField';
import IndicatorLayout from './IndicatorLayout';
import CustomCard from './CustomCard';
import colors from '../utils/colors';

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
      selectionNames, groupNames, typeNames,
      selection, groupSelection, typeSelection,
      onSelectionChange, onGroupChange, onTypeChange,
    } = this.props;

    const { emptyNodes } = this.state;

    const selectionOptions = toOptions(selectionNames);
    const groupOptions = toOptions(['Todos', ...groupNames]);
    const typesOptions = toOptions(['Todos', ...typeNames]);

    const graph = new GraphData(this.props.graph);

    const compare = colors.compare();

    const colorHash = new Map(graph
      .extractGroup()
      .map(group => [group, compare.pop()]));

    const { nodes, edges } = emptyNodes ?
      graph : graph.removeNodesWithoutEdges();

    const filters = (
      <Grid container spacing={8}>
        <Grid item xs={3}>
          <SelectField
            key={1}
            options={selectionOptions}
            onChange={onSelectionChange}
            value={selection}
            label="Seleções"
          />
        </Grid>
        <Grid item xs={3}>
          <SelectField
            onChange={onGroupChange}
            value={groupSelection}
            options={groupOptions}
            label="Grupos"
          />
        </Grid>
        <Grid item xs={3}>
          <SelectField
            onChange={onTypeChange}
            value={typeSelection}
            options={typesOptions}
            label="Tipo de Produção"
          />
        </Grid>
        <Grid item xs={3}>
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
        </Grid>
      </Grid>
    );

    return (
      <IndicatorLayout
        title="Rede de Coautoria das Produções Bibliográficas"
        visualizationElevation={0}
        visualization={(
          <Graph
            data={{ edges, nodes }}
            colorHash={colorHash}
          />
        )}

        control={(
          <Grid container spacing={8}>
            <Grid item xs={10}>
              <CustomCard title="Filtros" content={filters} />
            </Grid>
          </Grid>
        )}
      />
    );
  }
}

CollaborationVisualization.propTypes = {
  graph: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
  }),
  selectionNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  typeNames: PropTypes.arrayOf(PropTypes.string),
  groupNames: PropTypes.arrayOf(PropTypes.string),
  selection: PropTypes.string.isRequired,
  groupSelection: PropTypes.string,
  typeSelection: PropTypes.string,
  onSelectionChange: PropTypes.func.isRequired,
  onGroupChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

CollaborationVisualization.defaultProps = {
  graph: undefined,
  groupNames: undefined,
  typeNames: undefined,
  groupSelection: undefined,
  typeSelection: undefined,
};

export default CollaborationVisualization;
