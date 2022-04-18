export interface Transaction {
  uuid: string,
  account: string,
  budget: string,
  category: string,
  currency: string,
  user: string,
  amount: number,
  baseAmount: number,
  rate: number,
  transactionDate: string,
  type: string,
  description: string,
}
