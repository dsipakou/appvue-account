/* eslint-disable import/prefer-default-export */

export const itemStatus = {
  INIT: 0,
  LOADING: 1,
  ERROR: 2,
  LOADED: 3,
};

/* eslint-disable no-shadow */
export enum ChartRange {
  Month = 30,
  Quater = 90,
  HalfAYear = 180,
  Year = 365,
}

export const rangeLabels = [
  { label: '30 days', value: ChartRange.Month },
  { label: '90 days', value: ChartRange.Quater },
  { label: '180 days', value: ChartRange.HalfAYear },
  { label: '1 year', value: ChartRange.Year },
];
