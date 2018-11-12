import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import ProductionIndicator from './ProductionIndicator';
import SelectField from './SelectField';

const GET_INDICATOR = gql`
  query Indicator($collection: Collection, $by: By $selectedMembers: [ID], $campus: [String]) {
    indicator(collection: $collection, by: $by, members: $selectedMembers, campus: $campus) {
      year
      member
      count
      type
    }
    members(members: $selectedMembers) {
      campus
    }
  }
`;

class ProductionIndicatorQuery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campusSelection: 'Todos',
    };

    this.handleCampusChange = this.handleCampusChange.bind(this);
  }

  handleCampusChange(e) {
    this.setState({
      campusSelection: e.target.value,
    });
  }

  render() {
    const { collection, by, selectedMembers } = this.props;
    const { campusSelection } = this.state;
    const campus = campusSelection === 'Todos' ? undefined : campusSelection;

    return (
      <Query
        query={GET_INDICATOR}
        variables={{
          collection, by, selectedMembers, campus,
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return 'Carregando...';
          if (error) return 'Não foi possível carregar o gráfico.';

          const types = data.indicator
            .reduce((set, { type }) => set.add(type), new Set());

          const campusOptions = [
            'Todos',
            ...data.members
              .reduce((set, member) => set.add(member.campus), new Set()),
          ].map(option => ({ value: option, label: option }));

          return (
            <ProductionIndicator
              chartData={data.indicator}
              by={by}
              checkboxesValues={types}
              selectField={campusOptions.length > 2 ? (
                <SelectField
                  options={campusOptions}
                  onChange={this.handleCampusChange}
                  value={campusSelection}
                  label="Campus"
                />
              ) : undefined}
            />
          );
        }}
      </Query>
    );
  }
}

ProductionIndicatorQuery.propTypes = {
  collection: PropTypes.string,
  by: PropTypes.string,
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string).isRequired,
};

ProductionIndicatorQuery.defaultProps = {
  collection: undefined,
  by: 'year',
};

export default ProductionIndicatorQuery;
