import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { ApolloConsumer } from 'react-apollo';

import EnhancedTableHead from '../../../client/components/EnhancedTable/EnhancedTableHead';

import EnhancedTableToolbar from './EnhancedTableToolbar';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: props.selectedMembers,
      data: props.data,
      page: 0,
      rowsPerPage: 25,
    };

    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.handleSelectionSave = this.handleSelectionSave.bind(this);
    this.toLattesId = this.toLattesId.bind(this);
  }

  handleRequestSort(event, property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  }

  handleSelectAllClick(event, client) {
    if (event.target.checked) {
      const selected = this.state.data.map(n => n.id);

      client.writeData({ data: { selectedMembers: selected } });
      this.setState({ selected });

      return;
    }

    client.writeData({ data: { selectedMembers: [] } });
    this.setState({ selected: [] });
  }

  handleClick(event, id, client) {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    client.writeData({ data: { selectedMembers: newSelected } });
    this.setState({ selected: newSelected });
  }

  handleChangePage(event, page) {
    this.setState({ page });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: event.target.value });
  }

  isSelected(id) {
    return this.state.selected.indexOf(id) !== -1;
  }

  handleSelectionSave(client, id) {
    client.writeData({ data: { selectedMembers: [] } });
    this.props.onSelectionSave(id);
    this.setState({ selected: [] });
  }

  // Get lattesId from ObjectId
  toLattesId(objectId) {
    const member = this.state.data.find(({ id }) => id === objectId);
    return member ? member.lattesId : undefined;
  }

  render() {
    const { classes } = this.props;
    const {
      data, order, orderBy, selected, rowsPerPage, page,
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

    return (
      <ApolloConsumer>
        {client => (
          <Paper className={classes.root}>
            <EnhancedTableToolbar
              selected={selected}
              toLattesId={this.toLattesId}
              onSelectionSave={id => this.handleSelectionSave(client, id)}
            />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={event => this.handleSelectAllClick(event, client)}
                  onRequestSort={this.handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {stableSort(data, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                    .map((n) => {
                      const isSelected = this.isSelected(n.id);
                      const { cvLastUpdate } = n;
                      const d = cvLastUpdate.getDate() + 1;
                      const m = cvLastUpdate.getMonth() + 1;
                      const y = cvLastUpdate.getFullYear();
                      return (
                        <TableRow
                          hover
                          onClick={event => this.handleClick(event, n.id, client)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.id}
                          selected={isSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isSelected} />
                          </TableCell>
                          <TableCell style={{ maxWidth: 220 }} component="th" scope="row" padding="none">
                            {n.fullName}
                          </TableCell>
                          <TableCell style={{ maxWidth: 200 }} align="left">
                            <a href={`http://lattes.cnpq.br/${n.lattesId}`} target="_blank" rel="noopener noreferrer">
                              Currículo Lattes
                              <OpenInNewIcon style={{ fontSize: 12 }} />
                            </a>
                          </TableCell>
                          <TableCell style={{ maxWidth: 350 }}>{n.citationName}</TableCell>
                          <TableCell style={{ maxWidth: 200 }} align="left">{`${d}/${m}/${y}`}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </ApolloConsumer>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    table: PropTypes.string,
    tableWrapper: PropTypes.string,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string),
  onSelectionSave: PropTypes.func,
};

EnhancedTable.defaultProps = {
  selectedMembers: [],
  data: [],
  onSelectionSave: () => undefined,
};

export default withStyles(styles)(EnhancedTable);
