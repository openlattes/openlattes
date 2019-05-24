import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  progress: {
    marginLeft: theme.spacing.unit * 60,
    marginTop: theme.spacing.unit * 30,
  },
});

const Loading = props => (
  <CircularProgress className={props.classes.progress} />
);

Loading.propTypes = {
  classes: PropTypes.shape({
    progress: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(Loading);
