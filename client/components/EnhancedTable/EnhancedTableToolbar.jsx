import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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

class EnhancedTableToolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupName: '',
    };

    this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
  }

  handleGroupNameChange(e) {
    this.setState({
      groupName: e.target.value,
    });
  }

  render() {
    const { selected, classes } = this.props;
    const { groupName } = this.state;
    const numSelected = selected.length;

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
        {numSelected > 0 ? (
          <div className={classes.actions}>
            <TextField
              id="groupName"
              value={groupName}
              onChange={this.handleGroupNameChange}
              placeholder="Nome do grupo"
            />
            <Button disabled={groupName === ''}>
              Salvar Seleção
            </Button>
          </div>
        ) : null}
      </Toolbar>
    );
  }
}

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    highlight: PropTypes.string,
    spacer: PropTypes.string,
    actions: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  selected: PropTypes
    .arrayOf(PropTypes.string).isRequired,
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
