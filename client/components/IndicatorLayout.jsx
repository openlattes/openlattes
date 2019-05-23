import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const IndicatorLayout = props => (
  <Grid container spacing={16}>
    <Grid item xs={12}>
      {props.visualization}
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
  /* eslint-disable react/forbid-prop-types */
  control: PropTypes.object,
  visualization: PropTypes.object,
  table: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
};

IndicatorLayout.defaultProps = {
  control: undefined,
  visualization: undefined,
  table: undefined,
};

export default IndicatorLayout;
