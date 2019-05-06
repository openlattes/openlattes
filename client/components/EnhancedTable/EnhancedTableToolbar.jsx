import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import db from '../../db';
import CustomDialog from '../CustomDialog';

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
      dialogOpen: false,
      dialogTitle: '',
      dialogContent: '',
    };

    this.openErrorDialog = this.openErrorDialog.bind(this);
    this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  openErrorDialog(message) {
    this.setState({
      dialogTitle: 'Erro',
      dialogContent: message,
      dialogOpen: true,
    });
  }

  handleGroupNameChange(e) {
    this.setState({
      groupName: e.target.value,
    });
  }

  handleSaveButtonClick() {
    const { selected, onSelectionSave } = this.props;
    const groupName = this.state.groupName.trim();

    // Validate input
    if (groupName === '') {
      // No empty field
      this.openErrorDialog('Escolha um nome para o grupo.');
    } else if (groupName === 'Atual' || groupName === 'Nenhum') {
      // No reserved words
      this.openErrorDialog('Nome inválido. Tente outro.');
    } else if (!selected.length) {
      // No member selected
      this.openErrorDialog('Nenhum membro selecionado.');
    } else {
      db.groups.toArray() // Query all groups
        .then((groups) => {
          // Compare new name with all stored names
          const nameExists = groups
            .map(({ name }) => name)
            .includes(groupName);

          if (nameExists) {
            // No repeated names
            throw Error(`Já existe um grupo chamado "${groupName}". Tente outro.`);
          } else {
            // Validated: store new group
            return db.groups.add({
              name: groupName,
              members: selected,
            });
          }
        })
        .then(() => {
          // Clear selection
          onSelectionSave();

          this.setState({
            groupName: '',
            dialogTitle: 'Sucesso',
            dialogContent: 'Novo grupo criado.',
            dialogOpen: true,
          });
        })
        .catch((err) => {
          this.openErrorDialog(err.message);
        });
    }
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  }

  render() {
    const {
      groupName, dialogOpen, dialogTitle, dialogContent,
    } = this.state;
    const { selected, classes } = this.props;
    const numSelected = selected.length;

    return (
      <div>
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
              <Button
                onClick={this.handleSaveButtonClick}
                disabled={groupName === ''}
              >
                Salvar Seleção
              </Button>
            </div>
          ) : null}
        </Toolbar>
        <CustomDialog
          open={dialogOpen}
          title={dialogTitle}
          content={dialogContent}
          onClose={this.handleDialogClose}
        />
      </div>
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
  onSelectionSave: PropTypes.func.isRequired,
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
