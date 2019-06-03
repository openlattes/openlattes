import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

// import db from '../../db';
import CustomDialog from '../../../client/components/CustomDialog';

const ADD_GROUP = gql`
  mutation AddGroup($members: [ID], $group: String) {
    addGroup(members: $members, group: $group)
  }
`;

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
      selectionName: '',
      dialogOpen: false,
      dialogTitle: '',
      dialogContent: '',
    };

    this.openErrorDialog = this.openErrorDialog.bind(this);
    this.handleSelectionNameChange = this.handleSelectionNameChange.bind(this);
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

  handleSelectionNameChange(e) {
    this.setState({
      selectionName: e.target.value,
    });
  }

  handleSaveButtonClick(addGroup) {
    const { selected, onSelectionSave } = this.props;
    const selectionName = this.state.selectionName.trim();

    // Validate input
    if (selectionName === '') {
      // No empty field
      this.openErrorDialog('Escolha um nome para a seleção.');
    } else if (selectionName === 'Todos') {
      // No reserved words
      this.openErrorDialog('Nome inválido. Tente outro.');
    } else if (!selected.length) {
      // No member selected
      this.openErrorDialog('Nenhum membro selecionado.');
    } else {
      // Validated: store new group
      addGroup({
        variables: {
          members: selected,
          group: selectionName,
        },
      });

      // Clear selection
      // TODO: fix arg
      onSelectionSave(selectionName);

      this.setState({
        selectionName: '',
        dialogTitle: 'Sucesso',
        dialogContent: 'Seleção salva.',
        dialogOpen: true,
      });
    }
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  }

  render() {
    const {
      selectionName, dialogOpen, dialogTitle, dialogContent,
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
          <div className={classes.actions}>
            <TextField
              id="selectionName"
              disabled={!numSelected}
              value={selectionName}
              onChange={this.handleSelectionNameChange}
              placeholder={!numSelected ? 'Selecione um membro' : 'Escolha um nome'}
            />
            <Mutation mutation={ADD_GROUP}>
              {(addGroup, { data }) => (
                <Button
                  onClick={() => this.handleSaveButtonClick(addGroup, data)}
                  disabled={selectionName === ''}
                >
                  Salvar Grupo
                </Button>
              )}
            </Mutation>
          </div>
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
