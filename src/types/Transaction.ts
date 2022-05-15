export interface TransactionCategory {
  uuid: string,
  name: string,
  parent: string,
  parentName: string,
}

export interface TransactionAccount {
  uuid: string,
  source: string,
}

export interface Transaction {
  uuid: string,
  account: string,
  accountDetails: TransactionAccount
  budget: string,
  category: string,
  categoryDetails: TransactionCategory,
  currency: string,
  user: string,
  amount: number,
  spentInBaseCurrency: number,
  baseAmount: number,
  rate: number,
  transactionDate: string,
  type: string,
  description: string,
}
