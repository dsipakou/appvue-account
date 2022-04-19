/* General requests */

export const BASE_URL = 'http://127.0.0.1:8000';

export const getRequest = (url: string) => {
  const options = {
    method: 'GET',
  };

  return fetch(`${BASE_URL}/${url}`, options);
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

  return fetch(`${BASE_URL}/${url}`, options);
};

export const patchRequest = (url: string, requestBody: object) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const options = {
    method: 'PATCH',
    headers,
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(`${BASE_URL}/${url}`, options);
};

export const deleteRequest = (url: string, requestBody: object = {}) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const options = {
    method: 'DELETE',
    headers,
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(`${BASE_URL}/${url}`, options);
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

/* nbrb.by section */
export const getRate = async (code: string, date: string) => {
  console.log(code, date);
  const response = await getRequest(`https://www.nbrb.by/api/exrates/rates/${code.toLowerCase()}?paramMode=2&onDate=${date}`);
  const body = await response.json();
  return body.Cur_OfficialRate / body.Cur_Scale;
};
