import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const CustomTooltip = props => (
  <Paper
    style={{
      position: 'relative',
      zIndex: 999999,
      padding: 5,
      left: props.left,
      bottom: props.bottom,
      minWidth: props.minWidth,
    }}
    elevation={12}
  >
    <Typography variant="subtitle2" align="center">
      {props.title1}
    </Typography>
    {props.title2 ? (
      <Typography variant="subtitle2" align="center">
        {props.title2}
      </Typography>
    ) : undefined}
    {props.clickHint ? (
      <Typography variant="body2">
        Clique para listar
      </Typography>
    ) : undefined}
  </Paper>
);

CustomTooltip.propTypes = {
  left: PropTypes.number,
  bottom: PropTypes.number,
  minWidth: PropTypes.number,
  title1: PropTypes.string.isRequired,
  title2: PropTypes.string,
  clickHint: PropTypes.bool,
};

CustomTooltip.defaultProps = {
  left: 0,
  bottom: 0,
  minWidth: 120,
  title2: undefined,
  clickHint: false,
};

export default CustomTooltip;
