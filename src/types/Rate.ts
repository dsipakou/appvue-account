export interface Rate {
  uuid: string,
  currency: string,
  rate: number,
  rateDate: string,
  description: string,
  createdAt: string,
  modifiedAt: string,
}

export interface RateItem {
  code: string,
  rate: string,
}

export interface BatchedRatesRequestPayload {
  rateDate: string,
  baseCurrency: string,
  items: RateItem[],
}
