import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import IndicatorToolbar from './IndicatorToolbar';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
  },
});

const IndicatorLayout = props => (
  <Grid container spacing={16}>
    <Grid item xs={12}>
      <Grid container justify="flex-start">
        <Grid item>
          <Paper elevation={props.visualizationElevation} className={props.classes.paper}>
            <IndicatorToolbar
              title={props.title}
            />
            {props.visualization}
          </Paper>
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={12}>
      {props.control}
    </Grid>
    <Grid item xs={12}>
      {props.table}
    </Grid>
  </Grid>
);

IndicatorLayout.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
  }).isRequired,
  /* eslint-disable react/forbid-prop-types */
  control: PropTypes.object,
  visualization: PropTypes.object,
  table: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
  title: PropTypes.string.isRequired,
  visualizationElevation: PropTypes.number,
};

IndicatorLayout.defaultProps = {
  control: undefined,
  visualization: undefined,
  table: undefined,
  visualizationElevation: 1,
};

export default withStyles(styles)(IndicatorLayout);
