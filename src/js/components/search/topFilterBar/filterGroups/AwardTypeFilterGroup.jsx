/**
 * AwardTypeFilterGroup.jsx
 * Created by Kevin Li 1/24/17
 */

import React from 'react';
import _ from 'lodash';

import { Set } from 'immutable';

import * as AwardType from 'dataMapping/search/awardType';

import BaseTopFilterGroup from './BaseTopFilterGroup';

const propTypes = {
    filter: React.PropTypes.object,
    redux: React.PropTypes.object
};

const groupKeys = ['contracts', 'grants', 'direct_payments', 'loans'];
const groupLabels = {
    contracts: 'Contracts',
    grants: 'Grants',
    direct_payments: 'Direct Payments',
    loans: 'Loans'
};

export default class AwardTypeFilterGroup extends React.Component {
    constructor(props) {
        super(props);

        this.removeFilter = this.removeFilter.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.clearGroup = this.clearGroup.bind(this);
    }

    removeFilter(value) {
        // remove a single filter item
        const newValue = this.props.redux.reduxFilters.awardType.delete(value);
        this.props.redux.updateGenericFilter({
            type: 'awardType',
            value: newValue
        });
    }

    removeGroup(value) {
        // remove a group of filter items
        // let's actually fake the removal by just overwriting the the filter value with everything
        // except for the values in the specified group
        let updatedValues = new Set(this.props.filter.values);

        // remove the current group's values
        const awardValues = AwardType.awardTypeGroups[value];
        updatedValues = updatedValues.filterNot((x) => _.indexOf(awardValues, x) > -1);

        this.props.redux.updateGenericFilter({
            type: 'awardType',
            value: updatedValues
        });
    }

    clearGroup() {
        this.props.redux.clearFilterType('awardType');
    }

    generateTags() {
        const tags = [];

        // check to see if any type groups are fully selected
        const selectedValues = this.props.filter.values;
        const fullGroups = [];
        groupKeys.forEach((key) => {
            const fullMembership = AwardType.awardTypeGroups[key];

            // quick way of checking for full group membership is to return an array of missing
            // values; it'll be empty if all the values are selected
            const missingValues = _.difference(fullMembership, selectedValues);

            if (missingValues.length === 0) {
                // this group is complete
                fullGroups.push(key);
            }
        });

        // add full groups to the beginning of the tag list
        let excludedValues = [];
        fullGroups.forEach((group) => {
            const tag = {
                value: group,
                title: `All ${groupLabels[group]}`,
                isSpecial: true,
                removeFilter: this.removeGroup
            };

            tags.push(tag);

            // exclude these values from the remaining tags
            excludedValues = _.concat(excludedValues, AwardType.awardTypeGroups[group]);
        });

        selectedValues.forEach((value) => {
            const tag = {
                value,
                title: AwardType.awardTypeCodes[value],
                isSpecial: false,
                removeFilter: this.removeFilter
            };

            if (_.indexOf(excludedValues, value) < 0) {
                // only insert individual tags that aren't part of a fully-selected group
                // excluded values is an array of values that are already included in a full group,
                // so if this value isn't in that array, it can be shown individually
                tags.push(tag);
            }
        });

        return tags;
    }

    render() {
        const tags = this.generateTags();

        return (<BaseTopFilterGroup
            tags={tags}
            filter={this.props.filter}
            clearFilterGroup={this.clearGroup} />);
    }
}

AwardTypeFilterGroup.propTypes = propTypes;
