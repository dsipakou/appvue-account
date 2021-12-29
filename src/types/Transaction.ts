export interface Transaction {
  accountId: number,
  budgetId: number,
  categoryId: number,
  currencyId: number,
  userId: number,
  amount: number,
  rate: number,
  transactionDate: string,
  type: string,
  description: string,
}
