/**
 * This file represents the root public entry to the module.
 * It exports all items available publicly
 */

import { AggregatedDataSet } from './aggregated-data-set';
import { IAggregationQueryResult } from './aggregation-query-result';
import { IAggregator } from './types';

export { AggregatedDataSet };
export { IAggregationQueryResult };
export { IAggregator };

import SubsetTree, { SliceResult } from './data-collection';
export default SubsetTree;
export { SliceResult };
