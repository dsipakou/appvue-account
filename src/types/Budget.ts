export interface Budget {
  uuid: string,
  category: string,
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

export interface BudgetUsage extends BudgetPlan {
  spentInOriginalCurrency: number,
  spentInBaseCurrency: number,
}

export interface GetBudgetForPeriod {
  dateFrom: string,
  dateTo: string,
}

/* eslint-disable no-shadow */
export enum BudgetToggle {
  Monthly = 'monthly',
  Weekly = 'weekly',
}
