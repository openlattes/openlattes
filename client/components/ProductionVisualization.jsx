import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import StackedBarChart from './StackedBarChart';
import Checkboxes from './Checkboxes';
import ProductionsList from './ProductionsList';
import SupervisionsList from './SupervisionsList';
import SelectField from './SelectField';
import IndicatorLayout from './IndicatorLayout';
import CustomCard from './CustomCard';
import colors from '../utils/colors';

const projections = new Map([
  ['year', 'vertical'],
  ['member', 'horizontal'],
]);

const tables = new Map([
  ['BIBLIOGRAPHIC', ProductionsList],
  ['SUPERVISION', SupervisionsList],
]);

const toOptions = labels =>
  labels.map(name => ({ value: name, label: name }));

const collectionTitles = new Map([
  ['BIBLIOGRAPHIC', 'Produções Bibliográficas'],
  ['SUPERVISION', 'Orientações'],
]);

const byTitles = new Map([
  ['year', 'Ano'],
  ['member', 'Membro'],
]);

class ProductionVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /* The value is already a Set but intentionally use an
       * extra "new Set()" to make sure it's a new object
       */
      selectedCheckboxes: new Set(props.checkboxesValues),
      selectedYear: null,
      selectedMember: null,
      selectedTypes: [],
    };

    this.updateSelectedCheckboxes = this.updateSelectedCheckboxes.bind(this);
    this.handleChartClick = this.handleChartClick.bind(this);
  }

  updateSelectedCheckboxes(e) {
    const { selectedCheckboxes } = this.state;
    const label = e.target.value;

    if (selectedCheckboxes.has(label)) {
      selectedCheckboxes.delete(label);
    } else {
      selectedCheckboxes.add(label);
    }

    this.setState({
      selectedCheckboxes: new Set(selectedCheckboxes),
    });
  }

  handleChartClick({ column, pieces }) {
    const { by } = this.props;
    const columnTypes = pieces.map(({ data }) => data.type);
    const selectedColumn = by === 'year' ? 'selectedYear' : 'selectedMember';

    this.setState({
      [selectedColumn]: column.name,
      selectedTypes: columnTypes,
    });
  }

  render() {
    const {
      indicator, checkboxesValues, by, collection,
      selectionNames, selection, onSelectionChange,
      groupNames, onGroupChange, groupSelection,
      selectedMembers, onByChange,
    } = this.props;
    const {
      selectedCheckboxes, selectedYear, selectedMember, selectedTypes,
    } = this.state;

    const selectionOptions = toOptions(selectionNames);
    const groupOptions = toOptions(['Todos', ...groupNames]);

    const checkboxes = [...checkboxesValues].reverse();

    const compare = colors.compare();

    const colorHash = checkboxes
      .reduce((map, item) => map.set(item, compare.pop()), new Map());

    const filteredTypes = indicator
      .filter(({ type }) => selectedCheckboxes.has(type));

    const DataList = tables.get(collection);

    const collectionTitle = collectionTitles.get(collection);
    const byTitle = byTitles.get(by);

    return (
      <IndicatorLayout
        title={`Indicador de Produção por ${byTitle} (${collectionTitle})`}
        visualization={(
          <StackedBarChart
            data={filteredTypes}
            colorHash={colorHash}
            by={by}
            projection={projections.get(by)}
            onClick={this.handleChartClick}
          />
        )}

        control={(
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            spacing={8}
          >
            <Grid item xs={3}>
              <CustomCard
                title="Filtros"
                content={(
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                  >
                    <Grid item>
                      <SelectField
                        key={1}
                        options={selectionOptions}
                        onChange={onSelectionChange}
                        value={selection}
                        label="Seleções"
                      />
                    </Grid>
                    <Grid item>
                      <SelectField
                        options={groupOptions}
                        onChange={onGroupChange}
                        value={groupSelection}
                        label="Grupos"
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </Grid>
            <Grid item xs={(checkboxes.length > 5) ? 7 : 4}>
              <CustomCard
                title="Comparar"
                content={(
                  <Checkboxes
                    items={checkboxes}
                    selected={selectedCheckboxes}
                    colorHash={colorHash}
                    onChange={this.updateSelectedCheckboxes}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomCard
                title="Contagem Por"
                content={(
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                  >
                    <Grid item>
                      <FormControlLabel
                        label="Ano"
                        control={(
                          <Radio
                            checked={by === 'year'}
                            onChange={onByChange}
                            value="year"
                            name="year-radio-button"
                            aria-label="Year"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Membro"
                        control={(
                          <Radio
                            checked={by === 'member'}
                            onChange={onByChange}
                            value="member"
                            name="member-radio-button"
                            aria-label="Member"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </Grid>
          </Grid>
        )}

        table={selectedYear || selectedMember ? (
          <DataList
            year={Number(selectedYear)}
            memberName={selectedMember}
            types={selectedTypes}
            group={by === 'year' && groupSelection !== 'Todos' ? groupSelection : undefined}
            members={by === 'year' ? selectedMembers : undefined}
          />
        ) : undefined}
      />
    );
  }
}

ProductionVisualization.propTypes = {
  indicator: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.number,
    member: PropTypes.string,
    count: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  })),
  checkboxesValues: PropTypes.instanceOf(Set),
  selectionNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  selection: PropTypes.string.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  by: PropTypes.string,
  collection: PropTypes.string,
  onGroupChange: PropTypes.func.isRequired,
  groupSelection: PropTypes.string,
  groupNames: PropTypes.arrayOf(PropTypes.string),
  selectedMembers: PropTypes
    .arrayOf(PropTypes.string),
  onByChange: PropTypes.func.isRequired,
};

ProductionVisualization.defaultProps = {
  collection: 'BIBLIOGRAPHIC',
  indicator: [],
  checkboxesValues: new Set(),
  by: 'year',
  groupSelection: 'Todos',
  groupNames: [],
  selectedMembers: [],
};

export default ProductionVisualization;
