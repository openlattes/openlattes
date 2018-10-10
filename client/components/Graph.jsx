import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { NetworkFrame } from 'semiotic';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { scaleLinear } from 'd3-scale';

const GET_GRAPH = gql`
  {
    graph {
      nodes {
        id
        fullName
      }
      edges {
        source
        target
        weight
      }
    }
  }
`;

const customTooltipContent = d => (
  <Card
    style={{
      position: 'relative',
      left: '10px',
      bottom: '-10px',
      zIndex: 999999,
    }}
    raised
  >
    <CardContent>
      <Typography variant="body2">{d.fullName}</Typography>
      <Typography variant="body2">Coautorias: {d.degree}</Typography>
    </CardContent>
  </Card>
);

const Graph = () => (
  <Query query={GET_GRAPH}>
    {({
      loading, error, data,
    }) => {
      if (loading) return <p>loading...</p>;
      if (error) return <p>error</p>;

      // Remove the automatically included field __typename
      // to avoid semiotic error
      const nodes = data.graph.nodes.map(({ id, fullName }) => ({ id, fullName }));

      const weightExtremes = data.graph.edges
        .reduce(({ min, max }, { weight }) => ({
          min: (weight < min) ? weight : min,
          max: (weight > max) ? weight : max,
        }), { min: 999999, max: 0 });

      const edgeScale = scaleLinear()
        .domain([weightExtremes.min, weightExtremes.max])
        .range([1, 10]);

      const nodeScale = scaleLinear()
        .domain([1, weightExtremes.max * 2])
        .range([2, 10]);

      return (
        <NetworkFrame
          size={[900, 600]}
          edges={data.graph.edges}
          nodes={nodes}
          edgeStyle={() => ({
            stroke: '#32c4c4', fill: '#32c4c4', fillOpacity: 0.25, strokeWidth: '1px',
          })}
          nodeStyle={d => ({
            fill: d.createdByFrame ? '#336ac4' : 'rgb(51, 106, 196)',
          })}
          edgeType="ribbon"
          nodeSizeAccessor={d => nodeScale(d.degree)}
          edgeWidthAccessor={d => edgeScale(d.weight)}
          zoomToFit
          hoverAnnotation
          tooltipContent={customTooltipContent}
        />
      );
    }}
  </Query>
);

export default Graph;
