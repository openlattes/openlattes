import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import BarChartIcon from '@material-ui/icons/BarChart';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Link } from 'react-router-dom';

const RotatedBarChartIcon = () => (
  <BarChartIcon
    style={{
      transform: 'rotate(90deg)',
    }}
  />
);

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

const productionButtons = [
  {
    key: 1, tooltip: 'Evolução', Icon: BarChartIcon, minSelected: 1, route: '/productions_year',
  },
  {
    key: 2, tooltip: 'Tipos', Icon: RotatedBarChartIcon, minSelected: 1, route: '/productions_type',
  },
  {
    key: 3, tooltip: 'Coautorias', Icon: ShareIcon, minSelected: 1, route: '/collaborations',
  },
];

const supervisionButtons = [
  {
    key: 4, tooltip: 'Evolução', Icon: BarChartIcon, minSelected: 1, route: '/supervisions_year',
  },
  {
    key: 5, tooltip: 'Tipos', Icon: RotatedBarChartIcon, minSelected: 1, route: '/supervisions_type',
  },
];

const EnhancedTableToolbar = (props) => {
  const { numSelected, onToolbarButtonClick, classes } = props;

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
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Typography variant="subtitle2">
          Produções Bibliográficas
        </Typography>
        {productionButtons.map(({
          key, tooltip, Icon, minSelected, route,
        }) => (
          <Tooltip key={key} title={tooltip}>
            <IconButton
              onClick={onToolbarButtonClick}
              component={Link}
              to={route}
              disabled={numSelected < minSelected}
              aria-label={tooltip}
            >
              <Icon />
            </IconButton>
          </Tooltip>
        ))}
      </div>
      <div className={classes.actions}>
        <Typography variant="subtitle2">
          Orientações
        </Typography>
        {supervisionButtons.map(({
          key, tooltip, Icon, minSelected, route,
        }) => (
          <Tooltip key={key} title={tooltip}>
            <IconButton
              onClick={onToolbarButtonClick}
              component={Link}
              to={route}
              disabled={numSelected < minSelected}
              aria-label={tooltip}
            >
              <Icon />
            </IconButton>
          </Tooltip>
        ))}
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
  onToolbarButtonClick: PropTypes.func.isRequired,
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
