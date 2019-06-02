import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  spacer: {
    flex: '1 1 20%',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

const SimpleTableToolbar = props => (
  <div>
    <Toolbar
      className={props.classes.root}
    >
      <div className={props.classes.title}>
        <Typography align="center" variant="h6">
          {props.title}
        </Typography>
      </div>
      <div className={props.classes.spacer} />
      <div className={props.classes.actions} />
    </Toolbar>
  </div>
);

SimpleTableToolbar.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    spacer: PropTypes.string,
    actions: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(toolbarStyles)(SimpleTableToolbar);
