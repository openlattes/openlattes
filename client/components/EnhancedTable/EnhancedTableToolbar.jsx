import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '0 0 auto',
  },
});

const EnhancedTableToolbar = (props) => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selecionado(s)
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Membros
          </Typography>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    highlight: PropTypes.string,
    spacer: PropTypes.string,
    actions: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  numSelected: PropTypes.number.isRequired,
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
