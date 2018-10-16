import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShareIcon from '@material-ui/icons/Share';
import BarChartIcon from '@material-ui/icons/BarChart';
import { Link } from 'react-router-dom';

const MenuItems = () => (
  <List>
    <ListItem component={Link} to="/" button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    <ListItem component={Link} to="/collaborations" button>
      <ListItemIcon>
        <ShareIcon />
      </ListItemIcon>
      <ListItemText primary="Colaboração" />
    </ListItem>
    <ListItem component={Link} to="/productions_year" button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Produções por ano" />
    </ListItem>
    <ListItem component={Link} to="/productions_type" button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Produções por tipo" />
    </ListItem>
  </List>
);

export default MenuItems;
