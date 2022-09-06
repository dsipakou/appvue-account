export interface TransactionCategory {
  uuid: string,
  name: string,
  parent: string,
  parentName: string,
}

export interface TransactionAccount {
  uuid: string,
  title: string,
}

export interface TransactionSpentCurrency {
  [key: string]: number,
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
  spentInCurrencies: TransactionSpentCurrency,
  baseAmount: number,
  rate: number,
  transactionDate: string,
  type: string,
  description: string,
}
