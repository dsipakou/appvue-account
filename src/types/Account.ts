export interface Account {
  uuid: string,
  user: string,
  source: string,
  amount: number,
  description: string,
  isMain: boolean,
  createdAt: string,
  modifiedAt: string,
}

export interface AccountSaveForm {
  account: string,
  amount: number,
  category: string,
  user: string,
  currency: string,
  transactionDate: string,
  description: string,
}
