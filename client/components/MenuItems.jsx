import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShareIcon from '@material-ui/icons/Share';
import BarChartIcon from '@material-ui/icons/BarChart';
import { Link } from 'react-router-dom';

const RotatedBarChartIcon = () => (
  <BarChartIcon
    style={{
      transform: 'rotate(90deg)',
    }}
  />
);

const MenuItems = () => (
  <List>
    <ListItem component={Link} to="/" button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    <Divider />
    <ListSubheader>Proouções Bibliográficas</ListSubheader>
    <ListItem component={Link} to="/productions_year" button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Evolução" />
    </ListItem>
    <ListItem component={Link} to="/productions_type" button>
      <ListItemIcon>
        <RotatedBarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Tipos" />
    </ListItem>
    <ListItem component={Link} to="/collaborations" button>
      <ListItemIcon>
        <ShareIcon />
      </ListItemIcon>
      <ListItemText primary="Coautorias" />
    </ListItem>
    <Divider />
    <ListSubheader>Orientações</ListSubheader>
    <ListItem component={Link} to="" button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Evolução" />
    </ListItem>
    <ListItem component={Link} to="" button>
      <ListItemIcon>
        <RotatedBarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Tipos" />
    </ListItem>
  </List>
);

export default MenuItems;
