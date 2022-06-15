import { Category } from './Category';
import { Currency } from './Currency';
import { User } from './User';

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

export interface AccountSaveIncomeForm {
  account: Account,
  amount: number,
  category: Category,
  user: User,
  currency: Currency,
  transactionDate: string,
  description: string,
}

export interface AccountSaveForm {
  user: User,
  source: string,
  amount: number,
  isMain: boolean,
  description: string,
}

export interface AccountEditForm {
  uuid: string,
  user: User,
  source: string,
  amount: number,
  isMain: boolean,
  description: string,
}
