import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
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

const GET_INDICATOR = gql`
  query Indicator($selectedMembers: [ID]) {
    indicator(members: $selectedMembers) {
      year
      count
      type
    }
  }
`;

class ProductionIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCheckboxes: new Set(),
    };

    this.initSelectedCheckboxes = this.initSelectedCheckboxes.bind(this);
    this.updateSelectedCheckboxes = this.updateSelectedCheckboxes.bind(this);
  }

  initSelectedCheckboxes(itemsArray) {
    this.setState({
      selectedCheckboxes: new Set(itemsArray),
    });
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
    const { selectedCheckboxes } = this.state;
    const { classes, selectedMembers } = this.props;

    return (
      <Query query={GET_INDICATOR} variables={{ selectedMembers }}>
        {({ loading, error, data }) => {
          if (loading) return 'Carregando...';
          if (error) return 'Não foi possível carregar o gráfico.';

          const typesSet = data.indicator
            .reduce((set, { type }) => set.add(type), new Set());

          const colors = [
            red[200], red[500], red[800], blue[200], blue[500],
            blue[800], green[200], green[500], green[800], yellow[300],
          ];

          const typesArray = Array.from(typesSet.values());

          const items = typesArray
            .reverse()
            .map(type => ({
              label: type,
              checked: true,
              color: colors.pop(),
            }));

          const colorHash = items.reduce((obj, { label, color }) =>
            Object.assign(obj, { [label]: color }), {});

          const indicator = data.indicator
            .filter(({ type }) => selectedCheckboxes.has(type));

          return (
            <Grid container spacing={32}>
              <Grid item>
                <Paper className={classes.paper}>
                  <StackedBarChart
                    data={indicator}
                    colorHash={colorHash}
                  />
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <Checkboxes
                    items={items}
                    onMount={this.initSelectedCheckboxes}
                    onChange={this.updateSelectedCheckboxes}
                  />
                </Paper>
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

ProductionIndicator.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
  }).isRequired,
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(ProductionIndicator);
