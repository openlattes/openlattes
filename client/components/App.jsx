import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShareIcon from '@material-ui/icons/Share';
import BarChartIcon from '@material-ui/icons/BarChart';

import Layout from './Layout';
import MenuItems from './MenuItems';
import MembersList from './MembersList';
import CollaborationIndicator from './CollaborationIndicator';
import ProductionIndicator from './ProductionIndicator';
import TypeIndicator from './TypeIndicator';

const RotatedBarChartIcon = () => <BarChartIcon style={{ transform: 'rotate(90deg)' }} />;

const GET_SELECTED_MEMBERS = gql`
  {
    selectedMembers @client
  }
`;

const menuItems = [
  {
    links: [
      { Icon: DashboardIcon, label: 'Home', to: '/' },
    ],
  },
  {
    subheader: 'Produções Bibliográficas',
    links: [
      { Icon: BarChartIcon, label: 'Evolução', to: '/productions_year' },
      { Icon: RotatedBarChartIcon, label: 'Tipos', to: '/productions_type' },
      { Icon: RotatedBarChartIcon, label: 'Membros', to: '/productions_member' },
      { Icon: ShareIcon, label: 'Coautorias', to: '/collaborations' },
    ],
  },
  {
    subheader: 'Orientações',
    links: [
      { Icon: BarChartIcon, label: 'Evolução', to: '/supervisions_year' },
      { Icon: RotatedBarChartIcon, label: 'Tipos', to: '/supervisions_type' },
      { Icon: RotatedBarChartIcon, label: 'Membros', to: '/supervisions_member' },
    ],
  },
];

const App = () => (
  <Query query={GET_SELECTED_MEMBERS}>
    {({ data }) => {
      const { selectedMembers } = data;

      const routes = [
        {
          exact: true,
          path: '/',
          render: <MembersList />,
        },
        {
          exact: false,
          path: '/collaborations',
          render: <CollaborationIndicator selectedMembers={selectedMembers} />,
        },
        {
          exact: false,
          path: '/productions_year',
          render: <ProductionIndicator selectedMembers={selectedMembers} />,
        },
        {
          exact: false,
          path: '/productions_type',
          render: <TypeIndicator selectedMembers={selectedMembers} />,
        },
        {
          exact: false,
          path: '/productions_member',
          render: <ProductionIndicator selectedMembers={selectedMembers} by="member" projection="horizontal" />,
        },
        {
          exact: false,
          path: '/supervisions_year',
          render: <ProductionIndicator collection="SUPERVISION" selectedMembers={selectedMembers} />,
        },
        {
          exact: false,
          path: '/supervisions_type',
          render: <TypeIndicator collection="SUPERVISION" selectedMembers={selectedMembers} />,
        },
        {
          exact: false,
          path: '/supervisions_member',
          render: <ProductionIndicator collection="SUPERVISION" selectedMembers={selectedMembers} by="member" projection="horizontal" />,
        },
      ];

      return (
        <Router>
          <Layout
            menuItems={<MenuItems data={menuItems} />}
          >
            {routes.map(({ exact, path, render }) => (
              <Route exact={exact} path={path} render={() => render} />
            ))}
          </Layout>
        </Router>
      );
    }}
  </Query>
);

export default App;
