import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import MembersList from './MembersList';
import MenuItems from './MenuItems';
import CollaborationIndicator from './CollaborationIndicator';
import ProductionIndicator from './ProductionIndicator';
import TypeIndicator from './TypeIndicator';

const GET_SELECTED_MEMBERS = gql`
  {
    selectedMembers @client
  }
`;

const drawerWidth = 220;

const styles = theme => ({
  root: {
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'fixed',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    height: '100%',
    position: 'fixed',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };

    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Openlattes
            </Typography>
          </Toolbar>
        </AppBar>
        <Router>
          <div>
            <Drawer
              variant="persistent"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={this.handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              <MenuItems />
            </Drawer>
            <Query query={GET_SELECTED_MEMBERS}>
              {({ data }) => {
                const { selectedMembers } = data;

                return (
                  <main
                    className={classNames(classes.content, {
                      [classes.contentShift]: open,
                    })}
                  >
                    <div className={classes.drawerHeader} />
                    <Route exact path="/" component={MembersList} />
                    <Route path="/collaborations" render={() => <CollaborationIndicator selectedMembers={selectedMembers} />} />
                    <Route path="/productions_year" render={() => <ProductionIndicator selectedMembers={selectedMembers} />} />
                    <Route path="/productions_type" render={() => <TypeIndicator selectedMembers={selectedMembers} />} />
                    <Route
                      path="/supervisions_year"
                      render={() => <ProductionIndicator collection="SUPERVISION" selectedMembers={selectedMembers} />}
                    />
                    <Route
                      path="/supervisions_type"
                      render={() => <TypeIndicator collection="SUPERVISION" selectedMembers={selectedMembers} />}
                    />
                  </main>
                );
              }}
            </Query>
          </div>
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    appBar: PropTypes.string,
    appBarShift: PropTypes.string,
    menuButton: PropTypes.string,
    hide: PropTypes.string,
    drawerPaper: PropTypes.string,
    drawerHeader: PropTypes.string,
    content: PropTypes.string,
    contentShift: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(App);
