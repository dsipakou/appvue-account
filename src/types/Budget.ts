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

export interface BudgetPlan extends Budget {
  categoryName: string,
}

export interface BudgetUsage extends Budget {
  spentInOriginalCurrency: number,
  spentInBaseCurrency: number,
}

export interface IGetBudgetForPeriod {
  dateFrom: string,
  dateTo: string,
}

/* eslint-disable no-shadow */
export enum BudgetToggle {
  Monthly = 'monthly',
  Weekly = 'weekly',
}
