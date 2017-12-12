/**
 * MapList.jsx
 * Created by Kevin Li 5/22/17
 */

import React from 'react';
import PropTypes from 'prop-types';
import { orderBy, uniqueId } from 'lodash';

import IBTable from 'components/sharedComponents/IBTable/IBTable';
import * as MoneyFormatter from 'helpers/moneyFormatter';
import { InfoCircle } from 'components/sharedComponents/icons/Icons';

import { tableColumns } from 'dataMapping/homepage/mapTable';
import ResultsTableGenericCell from 'components/search/table/cells/ResultsTableGenericCell';

import MapListHeaderCell from './cells/MapListHeaderCell';

const propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.array
};

const rowHeight = 40;
// setting the table height to a partial row prevents double bottom borders and also clearly
// indicates when there's more data
const tableHeight = 14.5 * rowHeight;

export default class MapList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableWidth: 0,
            tableLeft: 0,
            tableRight: 0,
            sort: {
                field: 'state',
                direction: 'asc'
            },
            sortedData: []
        };

        this.setTableWidth = this.setTableWidth.bind(this);
        this.changeSearchOrder = this.changeSearchOrder.bind(this);
    }

    componentDidMount() {
        // set the initial table width
        this.setTableWidth();
        this.prepareTable(this.props.data);
        // watch the window for size changes
        window.addEventListener('resize', this.setTableWidth);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.prepareTable(nextProps.data);
        }
    }

    componentWillUnmount() {
        // stop watching for size changes
        window.removeEventListener('resize', this.setTableWidth);
    }

    setTableWidth() {
        const tableWidth = this.tableWidthController.clientWidth;
        const windowWidth = window.innerWidth;

        const margin = (windowWidth - tableWidth) / 2;

        this.setState({
            tableWidth,
            tableLeft: margin,
            tableRight: margin
        });
    }

    sortData(data) {
        return orderBy(data, (item) => {
            const compareValue = item[this.state.sort.field];
            // handle N/As
            if (compareValue === 'N/A') {
                return Infinity;
            }
            return compareValue;
        }, [this.state.sort.direction]);
    }

    prepareTable(data) {
        // prepare the data
        const sortedData = this.sortData(data);

        // prepare the columns
        let contentWidth = 0;
        const columns = [];

        tableColumns.order.forEach((column, index) => {
            const columnX = contentWidth;
            contentWidth += tableColumns.widths[column];

            const tableCol = {
                x: columnX,
                width: tableColumns.widths[column],
                header: () => {
                    const isLast = index + 1 === tableColumns.order.length;
                    return {
                        headerClass: MapListHeaderCell,
                        additionalProps: {
                            isLast,
                            field: column,
                            title: tableColumns.labels[column],
                            defaultDirection: tableColumns.defaultDirection[column],
                            changeSearchOrder: this.changeSearchOrder,
                            currentSort: this.state.sort
                        }
                    };
                },
                cell: (rowIndex) => {
                    const isLast = index + 1 === tableColumns.order.length;
                    let cellData = sortedData[rowIndex].get(column);
                    if (index === 1 || index === 3) {
                        cellData = MoneyFormatter.formatMoney(cellData);
                    }
                    return {
                        cellClass: ResultsTableGenericCell,
                        additionalProps: {
                            isLast,
                            rowIndex,
                            data: `${cellData}`
                        }
                    };
                }
            };

            columns.push(tableCol);
        });

        return {
            columns,
            contentWidth
        };
    }

    changeSearchOrder(field, direction) {
        // update the state
        this.setState({
            sort: {
                field,
                direction
            }
        }, () => {
            // update the table
            if (this.tableComponent) {
                this.tableComponent.updateRows();
            }
        });
    }
    render() {
        const calculatedValues = this.prepareTable(this.props.data);

        let inFlightClass = 'loaded-table';
        if (this.props.loading) {
            inFlightClass = 'loading-table';
        }

        const visibleWidth = Math.min(this.state.tableWidth, calculatedValues.contentWidth);
        const visibleHeight = Math.min(tableHeight, this.props.data.length * rowHeight);

        return (
            <div className="homepage-map-list">
                <div
                    className="map-table-width-master"
                    ref={(div) => {
                        // this is an empty div that scales via CSS
                        // the results table width will follow this div's width
                        this.tableWidthController = div;
                    }} />
                <div
                    className={`map-table ${inFlightClass}`}
                    style={{
                        marginLeft: this.state.tableLeft,
                        marginRight: this.state.tableRight
                    }}>
                    <IBTable
                        contentWidth={calculatedValues.contentWidth}
                        bodyWidth={visibleWidth}
                        bodyHeight={visibleHeight}
                        rowHeight={rowHeight}
                        rowCount={this.props.data.length}
                        headerHeight={50}
                        columns={calculatedValues.columns}
                        ref={(table) => {
                            this.tableComponent = table;
                        }} />
                </div>
                <div className="map-list-citation">
                    <p>Sources: US. Census Bureau, Population Division</p>
                    <p>
                        The World Factbook 2013-14. Washington, DC: Central Intelligence Agency, 2013
                        <span className="info-icon">
                            <InfoCircle alt="Citation" />
                        </span>
                    </p>
                </div>
            </div>
        );
    }
}

MapList.propTypes = propTypes;
