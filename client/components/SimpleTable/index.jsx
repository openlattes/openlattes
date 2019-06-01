import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import SimpleTableHead from './SimpleTableHead';
import SimpleTableToolbar from './SimpleTableToolbar';

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

class SimpleTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      data: props.data,
      page: 0,
      rowsPerPage: 10,
    };

    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.productionList.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleRequestSort(event, property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  }

  handleChangePage(event, page) {
    this.setState({ page });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: event.target.value });
  }

  render() {
    const { classes, headers, title } = this.props;
    const {
      data, order, orderBy, rowsPerPage, page,
    } = this.state;

    return (
      <Paper className={classes.root}>
        {title ? (
          <SimpleTableToolbar
            title={title}
          />
        ) : null}
        <div ref={(c) => { this.productionList = c; }} className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <SimpleTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              headers={headers}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                .map(n => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={n.id}
                  >
                    {headers.map(({ id, align }) => (
                      <TableCell key={id} align={align}>{n[id]}</TableCell>
                    ))}
                  </TableRow>
                ))}
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
    );
  }
}

SimpleTable.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    table: PropTypes.string,
    tableWrapper: PropTypes.string,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  headers: PropTypes.arrayOf(PropTypes.object).isRequired,
  autoFocus: PropTypes.bool,
  title: PropTypes.string,
};

SimpleTable.defaultProps = {
  autoFocus: false,
  title: undefined,
};

export default withStyles(styles)(SimpleTable);
