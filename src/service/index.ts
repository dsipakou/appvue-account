/* General requests */

import { IGetBudgetForPeriod } from '@/types/Budget';

export const BASE_URL = 'http://127.0.0.1:8000';

export const getRequest = (url: string) => {
  const options = {
    method: 'GET',
  };

  return fetch(url, options);
};

export const postRequest = (url: string, requestBody: object) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const options = {
    method: 'POST',
    headers,
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

export const patchRequest = (url: string, requestBody: object) => {
  const options = {
    method: 'PATCH',

    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

export const deleteRequest = (url: string, requestBody: object = {}) => {
  const options = {
    method: 'DELETE',
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

/* Users section */

export interface LoginPayload {
  email: string,
  password: string,
}

export interface SignupPayload {
  name: string,
  email: string,
  password: string,
}

export interface ResetUserPayload {
  email: string,
  password: string,
}

export const userLogin = async ({ email, password }: LoginPayload) => {
  const response = await postRequest('http://localhost:9091/api/login', { email, password });
  return response;
};

export const getUsers = async () => {
  const response = await getRequest('http://localhost:9091/api/users');
  return response;
};

export const createUser = async ({ name, email, password }: SignupPayload) => {
  const response = await postRequest('http://localhost:9091/api/users', { name, email, password });
  return response.json();
};

export const resetUser = async ({ email, password }: ResetUserPayload) => {
  const response = await postRequest('http://localhost:9091/api/reset', { email, password });
  return response;
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
  dateTo: string,
  currency: string,
}

export const getGroupedTransactions = async ({
  dateFrom,
  dateTo,
  currency,
}: GroupedTransactionRequest) => {
  const response = await getRequest(`http://localhost:9091/api/transactions/month?dateFrom=${dateFrom}&dateTo=${dateTo}&currency=${currency}`);
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
  currencyId,
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
      currencyId,
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
  const response = await getRequest(`${BASE_URL}/categories/`);
  return response;
};

interface CreateCategoryRequest {
  name: string,
  parent: string | undefined,
}

export const createCategory = async ({ name, parent }: CreateCategoryRequest) => {
  const response = await postRequest(`${BASE_URL}/categories/`,
    {
      name,
      parent,
    });
  return response;
};

interface UpdateCategoryRequest extends CreateCategoryRequest {
  uuid: string,
  isIncome: boolean,
}

export const updateCategory = async ({
  uuid,
  name,
  parent,
  isIncome,
}: UpdateCategoryRequest) => {
  const response = await patchRequest(`${BASE_URL}/categories/`,
    {
      uuid,
      name,
      parent,
      isIncome,
    });
  return response;
};

export const deleteCategory = async (uuid: number) => {
  const response = await deleteRequest(`${BASE_URL}/categories/${uuid}/`);
  return response;
};

/* Accounts section */

export const getAccounts = async () => {
  const response = await getRequest(`${BASE_URL}/accounts/`);
  return response;
};

export interface CreateAccountRequest {
  user: number,
  source: string,
  amount: number,
  description: string,
  isMain: boolean
}

export const createAccount = async ({
  user,
  source,
  amount,
  description,
  isMain,
}: CreateAccountRequest) => {
  const response = await postRequest(`${BASE_URL}/accounts/`,
    {
      user,
      source,
      amount,
      description,
      isMain,
    });
  return response;
};

export const deleteAccount = async (uuid: string) => {
  const response = await deleteRequest(`${BASE_URL}/accounts/${uuid}`);
  return response;
};

interface UpdateAccountRequest extends CreateAccountRequest {
  uuid: number
}

export const updateAccount = async ({
  uuid,
  user,
  source,
  amount,
  description,
  isMain,
}: UpdateAccountRequest) => {
  const response = await patchRequest(`${BASE_URL}/accounts/${uuid}`,
    {
      user,
      source,
      amount,
      description,
      isMain,
    });
  return response;
};

/* Rates section */

export const getRates = async () => {
  const response = await getRequest(`${BASE_URL}/rates/`);
  return response;
};

export const getRateChartData = async (range: number) => {
  const response = await getRequest(`${BASE_URL}/rates/chart?range=${range}`);
  return response;
};

export interface CreateRateRequest {
  currency: string,
  rateDate: string,
  rate: number,
  description?: string,
}

export const createRate = async ({
  currency,
  rateDate,
  rate,
  description,
}: CreateRateRequest) => {
  const response = await postRequest(`${BASE_URL}/rates/`,
    {
      currency,
      rateDate,
      rate: Number(rate),
      description,
    });
  return response;
};

/* Budget section */

export const getBudget = async () => {
  const response = await getRequest('http://localhost:9091/api/budget');
  return response;
};

export const getBudgetUsage = async (payload: IGetBudgetForPeriod) => {
  const url = `http://localhost:9091/api/budget/usage?dateFrom=${payload.dateFrom}&dateTo=${payload.dateTo}`;
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

export const getBudgetPlan = async ({
  dateFrom,
  dateTo,
}: GetBudgetRequest) => {
  const response = await getRequest(`http://localhost:9091/api/budget/planned?dateFrom=${dateFrom}&dateTo=${dateTo}`);
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
