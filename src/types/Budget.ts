export interface Budget {
  uuid: string,
  category: string,
  title: string,
  amount: number,
  budgetDate: string,
  description: string,
  isCompleted: boolean,
  createdAt: string,
  modifiedAt: string,
}

export interface BudgetTransactionItem {
  uuid: string,
  currency: string,
  currencyCode: string,
  spentInBaseCurrency: number,
  spentInOriginalCurrency: number,
}

export interface BudgetUsageItem {
  uuid: string,
  title: string,
  budgetDate: string,
  category: string,
  description: string,
  planned: number,
  spentInBaseCurrency: number,
  spentInOriginalCurrency: number,
  recurrent: string,
  isCompleted: boolean,
  transactions: BudgetTransactionItem[],
  createdAt: string,
  modifiedAt: string,
}

export interface GroupedBudgetUsageItem {
  uuid: string,
  title: string,
  planned: number,
  spentInBaseCurrency: number,
  spentInOriginalCurrency: number,
  items: BudgetUsageItem[],
}

export interface BudgetPlan extends Budget {
  categoryName: string,
}

export interface BudgetArchive {
  month: string,
  planned: number,
}

export interface CategoryBudgetUsageItem {
  uuid: string,
  categoryName: string,
  planned: number,
  spentInBaseCurrency: number,
  spentInOriginalCurrency: number,
  budgets: GroupedBudgetUsageItem[],
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
