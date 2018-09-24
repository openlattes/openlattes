import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { OrdinalFrame } from 'semiotic';

const GET_INDICATOR = gql`
  {
    indicator {
      year
      count
      type
    }
  }
`;

const StackedBar = () => {
  const colorHash = {
    'Apresentação de Trabalho': '#111111',
    'Artigo Aceito': '#282b30',
    'Artigo em Periódico': '#434f63',
    'Capítulo de Livro': '#fa648e',
    Livro: '#406cb2',
    'Outra Produção Bibliográfica': '#256fe8',
    'Resumo Expandido em Congresso': '#0061ff',
    'Resumo em Congresso': '#9400ff',
    'Texto em Jornal de Notícia': '#653787',
    'Trabalho Completo em Congresso': '#4b3b56',
  };

  return (
    <Query query={GET_INDICATOR}>
      {({ loading, error, data }) => {
        if (loading) return 'Carregando...';
        if (error) return 'Não foi possível carregar o gráfico.';

        return (
          <OrdinalFrame
            size={[900, 500]}
            data={data.indicator}
            oAccessor="year"
            rAccessor="count"
            style={d => ({ fill: colorHash[d.type], stroke: 'white' })}
            type="bar"
            projection="vertical"
            axis={{
              orient: 'left',
            }}
            margin={{
              top: 10, bottom: 50, right: 10, left: 100,
            }}
            oLabel={d => (
              <text transform="translate(-15,0)rotate(45)">{d}</text>
            )}
            sortO={(a, b) => a > b}
            oPadding={2}
            rExtent={[0, 5500]}
            baseMarkProps={{ forceUpdate: true }}
          />
        );
      }}
    </Query>
  );
};

export default StackedBar;
