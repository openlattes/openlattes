import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';

const colors = {
  compare: () => [
    red[200], red[500], red[800], blue[200], blue[500],
    blue[800], green[200], green[500], green[800], yellow[300],
  ],
  edge: {
    stroke: '#32c4c4',
    fill: '#32c4c4',
  },
  node: {
    fill: 'darkblue',
  },
};

export default colors;
