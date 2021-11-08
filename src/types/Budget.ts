export interface Budget {
  id: number,
  categoryId: number,
  title: string,
  amount: number,
  budgetDate: string,
  description: string,
  isCompleted: boolean,
  createdAt: string,
  updatedAt: string,
}

export interface IGetBudgetForPeriod {
  dateFrom: string,
  dateTo: string,
}
