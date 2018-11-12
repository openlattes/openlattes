import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';

import StackedBarChart from './StackedBarChart';
import Checkboxes from './Checkboxes';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
  },
});

const projections = new Map([
  ['year', 'vertical'],
  ['member', 'horizontal'],
]);

class ProductionIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCheckboxes: new Set(props.checkboxesValues),
    };

    this.updateSelectedCheckboxes = this.updateSelectedCheckboxes.bind(this);
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

  render() {
    const {
      classes, chartData, checkboxesValues, by,
    } = this.props;
    const { selectedCheckboxes } = this.state;

    const colors = [
      red[200], red[500], red[800], blue[200], blue[500],
      blue[800], green[200], green[500], green[800], yellow[300],
    ];

    const checkboxes = [...checkboxesValues].reverse();

    const colorHash = checkboxes
      .reduce((map, item) => map.set(item, colors.pop()), new Map());

    const indicator = chartData
      .filter(({ type }) => selectedCheckboxes.has(type));

    return (
      <Grid container spacing={32}>
        <Grid item>
          <Paper className={classes.paper}>
            <StackedBarChart
              data={indicator}
              colorHash={colorHash}
              by={by}
              projection={projections.get(by)}
            />
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.paper}>
            <Checkboxes
              items={checkboxes}
              selected={selectedCheckboxes}
              colorHash={colorHash}
              onChange={this.updateSelectedCheckboxes}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

ProductionIndicator.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
  }).isRequired,
  chartData: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.number,
    member: PropTypes.string,
    count: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  checkboxesValues: PropTypes.instanceOf(Set).isRequired,
  by: PropTypes.string.isRequired,
};

export default withStyles(styles)(ProductionIndicator);
