import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';

import StackedBarChart from './StackedBarChart';
import Checkboxes from './Checkboxes';
import ProductionsList from './ProductionsList';
import SupervisionsList from './SupervisionsList';
import SelectField from './SelectField';
import IndicatorLayout from './IndicatorLayout';
import CustomCard from './CustomCard';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 3,
  },
  filterPaper: {
    padding: theme.spacing.unit * 1,
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.light,
    padding: 5,
  },
  cardContent: {
    padding: 5,
  },
});

const projections = new Map([
  ['year', 'vertical'],
  ['member', 'horizontal'],
]);

const tables = new Map([
  ['BIBLIOGRAPHIC', ProductionsList],
  ['SUPERVISION', SupervisionsList],
]);

const toOptions = labels =>
  labels.map(name => ({ value: name, label: name }));

class ProductionVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /* The value is already a Set but intentionally use an
       * extra "new Set()" to make sure it's a new object
       */
      selectedCheckboxes: new Set(props.checkboxesValues),
      selectedYear: null,
      selectedMember: null,
      selectedTypes: [],
    };

    this.updateSelectedCheckboxes = this.updateSelectedCheckboxes.bind(this);
    this.handleChartClick = this.handleChartClick.bind(this);
  }

  updateSelectedCheckboxes(e) {
    const { selectedCheckboxes } = this.state;
    const label = e.target.value;

    if (selectedCheckboxes.has(label)) {
      selectedCheckboxes.delete(label);
    } else {
      selectedCheckboxes.add(label);
    }

    this.setState({
      selectedCheckboxes: new Set(selectedCheckboxes),
    });
  }

  handleChartClick({ column, pieces }) {
    const { by } = this.props;
    const columnTypes = pieces.map(({ data }) => data.type);
    const selectedColumn = by === 'year' ? 'selectedYear' : 'selectedMember';

    this.setState({
      [selectedColumn]: column.name,
      selectedTypes: columnTypes,
    });
  }

  render() {
    const {
      classes, indicator, checkboxesValues, by, collection,
      groupNames, groupSelection, onGroupChange,
      campusNames, onCampusChange, campusSelection,
      selectedMembers,
    } = this.props;
    const {
      selectedCheckboxes, selectedYear, selectedMember, selectedTypes,
    } = this.state;

    const groupOptions = toOptions(groupNames);
    const campusOptions = toOptions(['Todos', ...campusNames]);

    const colors = [
      red[200], red[500], red[800], blue[200], blue[500],
      blue[800], green[200], green[500], green[800], yellow[300],
    ];

    const checkboxes = [...checkboxesValues].reverse();

    const colorHash = checkboxes
      .reduce((map, item) => map.set(item, colors.pop()), new Map());

    const filteredTypes = indicator
      .filter(({ type }) => selectedCheckboxes.has(type));

    const DataList = tables.get(collection);

    return (
      <IndicatorLayout
        visualization={(
          <Grid container justify="flex-start">
            <Grid item>
              <Paper elevation={3} className={classes.paper}>
                <StackedBarChart
                  data={filteredTypes}
                  colorHash={colorHash}
                  by={by}
                  projection={projections.get(by)}
                  onClick={this.handleChartClick}
                />
              </Paper>
            </Grid>
          </Grid>
        )}

        control={(
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            spacing={8}
          >
            <Grid item xs={3}>
              <CustomCard
                title="Filtros"
                content={(
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                  >
                    <Grid item>
                      <SelectField
                        key={1}
                        options={groupOptions}
                        onChange={onGroupChange}
                        value={groupSelection}
                        label="Grupos"
                      />
                    </Grid>
                    <Grid item>
                      <SelectField
                        options={campusOptions}
                        onChange={onCampusChange}
                        value={campusSelection}
                        label="Campus"
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </Grid>
            <Grid item xs={(checkboxes.length > 5) ? 7 : 4}>
              <CustomCard
                title="Comparar"
                content={(
                  <Checkboxes
                    items={checkboxes}
                    selected={selectedCheckboxes}
                    colorHash={colorHash}
                    onChange={this.updateSelectedCheckboxes}
                  />
                )}
              />
            </Grid>
          </Grid>
        )}

        table={selectedYear || selectedMember ? (
          <div>
            <Typography variant="h5">{`Produções de ${selectedYear || selectedMember}:`}</Typography>
            <DataList
              year={Number(selectedYear)}
              memberName={selectedMember}
              types={selectedTypes}
              campus={by === 'year' && campusSelection !== 'Todos' ? campusSelection : undefined}
              members={by === 'year' ? selectedMembers : undefined}
            />
          </div>
        ) : undefined}
      />
    );
  }
}

ProductionVisualization.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
  }).isRequired,
  indicator: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.number,
    member: PropTypes.string,
    count: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  checkboxesValues: PropTypes.instanceOf(Set).isRequired,
  groupNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupSelection: PropTypes.string.isRequired,
  onGroupChange: PropTypes.func.isRequired,
  by: PropTypes.string.isRequired,
  collection: PropTypes.string,
  onCampusChange: PropTypes.func.isRequired,
  campusSelection: PropTypes.string.isRequired,
  campusNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
};

ProductionVisualization.defaultProps = {
  collection: 'BIBLIOGRAPHIC',
};

export default withStyles(styles)(ProductionVisualization);
