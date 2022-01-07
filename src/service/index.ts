/* General requests */

import { IGetBudgetForPeriod } from '@/types/Budget';

const getRequest = (url: string) => {
  const options = {
    method: 'GET',
  };

  return fetch(url, options);
};

const postRequest = (url: string, requestBody: object) => {
  const options = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

const patchRequest = (url: string, requestBody: object) => {
  const options = {
    method: 'PATCH',
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

const deleteRequest = (url: string, requestBody: object) => {
  const options = {
    method: 'DELETE',
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

/* Users section */

interface UserRequest {
  email: string,
  password: string,
}

export const userLogin = async ({ email, password }: UserRequest) => {
  const response = await postRequest('http://localhost:9091/api/login', { email, password });
  return response;
};

export const getUsers = async () => {
  const response = await getRequest('http://localhost:9091/api/users');
  return response;
};

export const createUser = async (name: string, email: string, password: string) => {
  const response = await postRequest('http://localhost:9091/api/users', { name, email, password });
  return response.json();
};

/* Transactions section */

interface TransactionRequest {
  sorting: string,
  limit: string,
  dateFrom: string,
  dateTo: string,
}

export const getTransactions = async ({
  sorting,
  limit = '15',
  dateFrom = '',
  dateTo = '',
}: TransactionRequest) => {
  let queryString = `sorting=${sorting}&limit=${limit}`;
  if (dateFrom !== '' && dateTo !== '') {
    queryString += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
  }
  const response = await getRequest(`http://localhost:9091/api/transactions?${queryString}`);
  return response;
};

interface GroupedTransactionRequest {
  dateFrom: string,
  dateTo: String,
}

export const getGroupedTransactions = async ({ dateFrom, dateTo }: GroupedTransactionRequest) => {
  const response = await getRequest(`http://localhost:9091/api/transactions/month/${dateFrom}/${dateTo}`);
  return response;
};

interface TransferRequest {
  userId: number,
}

export const transferBetweenAccounts = async ({
  userId,
}: TransferRequest) => {
  console.log(`Transfered from user ${userId}`);
};

interface CreateTransactionRequest {
  userId: number,
  categoryId: number,
  amount: number,
  rate: number,
  accountId: number,
  currencyId: number,
  budgetId: number,
  transactionDate: number,
  type: string,
  description: string,
}
export const createTransaction = async ({
  userId,
  categoryId,
  amount,
  rate,
  accountId,
  currencyId,
  budgetId,
  transactionDate,
  type,
  description,
}: CreateTransactionRequest) => {
  const response = await postRequest('http://localhost:9091/api/transactions',
    {
      userId,
      categoryId,
      amount,
      rate,
      accountId,
      currencyId,
      budgetId,
      transactionDate,
      type,
      description,
    });

  return response;
};

interface UpdateTransactionRequest extends CreateTransactionRequest {
  id: number,
}

export const updateTransaction = async ({
  id,
  userId,
  categoryId,
  amount,
  rate,
  accountId,
  budgetId,
  transactionDate,
  type,
  description,
}: UpdateTransactionRequest) => {
  const response = await patchRequest('http://localhost:9091/api/transactions',
    {
      id,
      userId,
      categoryId,
      amount,
      rate,
      accountId,
      budgetId,
      transactionDate,
      type,
      description,
    });
  return response;
};

export const deleteTransaction = async (id: number) => {
  const response = await deleteRequest('http://localhost:9091/api/transactions', { id });
  return response;
};

/* Categories section */

export const getCategories = async () => {
  const response = await getRequest('http://localhost:9091/api/categories');
  return response;
};

interface CreateCategoryRequest {
  name: string,
  parentName: string,
  isParent: boolean,
}

export const createCategory = async ({ name, parentName, isParent }: CreateCategoryRequest) => {
  const response = await postRequest('http://localhost:9091/api/categories',
    {
      name,
      parentName,
      isParent,
    });
  return response;
};

interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: number,
  isSystem: boolean,
}

export const updateCategory = async ({
  id,
  name,
  parentName,
  isParent,
  isSystem,
}: UpdateCategoryRequest) => {
  const response = await patchRequest('http://localhost:9091/api/categories',
    {
      id,
      name,
      parentName,
      isParent,
      isSystem,
    });
  return response;
};

export const deleteCategory = async (id: number) => {
  const response = await deleteRequest('http://localhost:9091/api/categories', { id });
  return response;
};

/* Accounts section */

export const getAccounts = async () => {
  const response = await getRequest('http://localhost:9091/api/accounts');
  return response;
};

export interface CreateAccountRequest {
  userId: number,
  source: string,
  amount: number,
  description: string,
  isMain: boolean
}

export const createAccount = async ({
  userId,
  source,
  amount,
  description,
  isMain,
}: CreateAccountRequest) => {
  const response = await postRequest('http://localhost:9091/api/accounts',
    {
      userId,
      source,
      amount,
      description,
      isMain,
    });
  return response;
};

export const deleteAccount = async (id: number) => {
  const response = await deleteRequest('http://localhost:9091/api/accounts', { id });
  return response;
};

interface UpdateAccountRequest extends CreateAccountRequest {
  id: number
}

export const updateAccount = async ({
  id,
  userId,
  source,
  amount,
  description,
  isMain,
}: UpdateAccountRequest) => {
  const response = await patchRequest('http://localhost:9091/api/accounts',
    {
      id,
      userId,
      source,
      amount,
      description,
      isMain,
    });
  return response;
};

/* Currencies section */

export const getCurrencies = async () => {
  const response = await getRequest('http://localhost:9091/api/currencies');
  return response;
};

interface CreateCurrencyRequest {
  code: string,
  sign: string,
  verbalName: string,
  isDefault: boolean,
  comments: string,
}

interface UpdateCurrencyRequest {
  code: string,
  sign: string,
  verbalName: string,
  isDefault: boolean,
  comments: string,
  id: number,
}

export const createCurrency = async ({
  code,
  sign,
  verbalName,
  isDefault,
  comments,
}: CreateCurrencyRequest) => {
  const response = await postRequest('http://localhost:9091/api/currencies',
    {
      code,
      sign,
      verbalName,
      isDefault,
      comments,
    });
  return response;
};

export const updateCurrency = async ({
  code,
  sign,
  verbalName,
  isDefault,
  comments,
  id,
}: UpdateCurrencyRequest) => {
  const response = await patchRequest('http://localhost:9091/api/currencies',
    {
      code,
      sign,
      verbalName,
      isDefault,
      comments,
      id,
    });
  return response;
};

export const deleteCurrency = async (id: number) => {
  const response = await deleteRequest('http://localhost:9091/api/currencies', { id });
  return response;
};

/* Rates section */

export const getRates = async () => {
  const response = await getRequest('http://localhost:9091/api/rates');
  return response;
};

interface CreateRateRequest {
  currencyId: number,
  rateDate: string,
  rate: number,
  description: string,
}

export const createRate = async ({
  currencyId,
  rateDate,
  rate,
  description,
}: CreateRateRequest) => {
  const response = await postRequest('http://localhost:9091/api/rates',
    {
      currencyId,
      rateDate,
      rate,
      description,
    });
  return response;
};

/* Budget section */

export const getBudget = async () => {
  const response = await getRequest('http://localhost:9091/api/budget');
  return response;
};

export const getBudgetForPeriod = async (payload: IGetBudgetForPeriod) => {
  const url = `http://localhost:9091/api/budget/date?dateFrom=${payload.dateFrom}&dateTo=${payload.dateTo}`;
  const response = await getRequest(url);
  return response;
};

interface CreateBudgetRequest {
  budgetDate: string,
  title: string,
  amount: number,
  categoryId: number,
  description: string,
}

export const createBudget = async ({
  budgetDate,
  title,
  amount,
  categoryId,
  description,
}: CreateBudgetRequest) => {
  const response = await postRequest('http://localhost:9091/api/budget',
    {
      budgetDate,
      title,
      categoryId,
      amount,
      description,
    });
  return response;
};

interface GetBudgetRequest {
  dateFrom: string,
  dateTo: string,
}

export const getBudgetUsage = async ({
  dateFrom,
  dateTo,
}: GetBudgetRequest) => {
  const response = await getRequest(`http://localhost:9091/api/budget/period?dateFrom=${dateFrom}&dateTo=${dateTo}`);
  return response;
};

interface UpdateBudgetRequest extends CreateBudgetRequest {
  id: number,
  isCompleted: boolean,
}

export const updateBudget = async ({
  id,
  budgetDate,
  title,
  amount,
  categoryId,
  description,
  isCompleted,
}: UpdateBudgetRequest) => {
  const response = await patchRequest('http://localhost:9091/api/budget',
    {
      id,
      budgetDate,
      title,
      amount,
      categoryId,
      description,
      isCompleted,
    });
  return response;
};

export const deleteBudget = async (id: number) => {
  const response = await deleteRequest('http://localhost:9091/api/budget', { id });
  return response;
};

/* nbrb.by section */
export const getRate = async (code: string, date: string) => {
  console.log(code, date);
  const response = await getRequest(`https://www.nbrb.by/api/exrates/rates/${code.toLowerCase()}?paramMode=2&onDate=${date}`);
  const body = await response.json();
  return body.Cur_OfficialRate / body.Cur_Scale;
};
