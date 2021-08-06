/* General requests */

const getRequest = (url) => {
  const options = {
    method: 'GET',
  };

  return fetch(url, options);
};

const postRequest = (url, requestBody) => {
  const options = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

const patchRequest = (url, requestBody) => {
  const options = {
    method: 'PATCH',
    mode: 'cors',
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

const deleteRequest = (url, requestBody) => {
  const options = {
    method: 'DELETE',
    mode: 'cors',
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

/* Users section */

export const getUsers = async () => {
  const response = await getRequest('http://localhost:9091/api/users');
  return response;
};

export const createUser = async (name, email, password) => {
  const response = await postRequest('http://localhost:9091/api/users', { name, email, password });
  return response.json();
};

/* Transactions section */

export const getTransactions = async () => {
  const response = await getRequest('http://localhost:9091/api/transactions');
  return response;
};

export const createTransaction = async ({
  userId,
  categoryId,
  amount,
  accountId,
  transactionDate,
  type,
  description,
}) => {
  const response = await postRequest('http://localhost:9091/api/transactions',
    {
      userId,
      categoryId,
      amount,
      accountId,
      transactionDate,
      type,
      description,
    });

  return response;
};

export const updateTransaction = async ({
  id,
  userId,
  categoryId,
  amount,
  accountId,
  transactionDate,
  type,
  description,
}) => {
  const response = await patchRequest('http://localhost:9091/api/transactions',
    {
      id,
      userId,
      categoryId,
      amount,
      accountId,
      transactionDate,
      type,
      description,
    });
  return response;
};

export const deleteTransaction = async (id) => {
  const response = await deleteRequest('http://localhost:9091/api/transactions', { id });
  return response;
};

/* Categories section */

export const getCategories = async () => {
  const response = await getRequest('http://localhost:9091/api/categories');
  return response;
};

export const createCategory = async ({ name, parentName, isParent }) => {
  const response = await postRequest('http://localhost:9091/api/categories',
    {
      name,
      parentName,
      isParent,
    });
  return response;
};

export const updateCategory = async ({
  id,
  name,
  parentName,
  isParent,
  isSystem,
}) => {
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

export const deleteCategory = async (id) => {
  const response = await deleteRequest('http://localhost:9091/api/categories', { id });
  return response;
};

/* Accounts section */

export const getAccounts = async () => {
  const response = await getRequest('http://localhost:9091/api/accounts');
  return response;
};

export const createAccount = async ({
  userId,
  source,
  amount,
  description,
}) => {
  const response = await postRequest('http://localhost:9091/api/accounts',
    {
      userId,
      source,
      amount,
      description,
    });
  return response;
};

export const deleteAccount = async (id) => {
  const response = await deleteRequest('http://localhost:9091/api/accounts', { id });
  return response;
};

export const updateAccount = async ({
  id,
  userId,
  source,
  amount,
  description,
}) => {
  const response = await patchRequest('http://localhost:9091/api/accounts',
    {
      id,
      userId,
      source,
      amount,
      description,
    });
  return response;
};

/* Currencies section */

export const getCurrencies = async () => {
  const response = await getRequest('http://localhost:9091/api/currencies');
  return response;
};

/* Rates section */

export const getRates = async () => {
  const response = await getRequest('http://localhost:9091/api/rates');
  return response;
};

export const createRate = async ({
  currencyId,
  rateDate,
  rate,
  description,
}) => {
  console.log(currencyId, rateDate, rate, description);
  const response = await postRequest('http://localhost:9091/api/rates',
    {
      currencyId,
      rateDate,
      rate,
      description,
    });
  return response;
};

/* nbrb.by section */
export const getRate = async (code, date) => {
  const response = await getRequest(`https://www.nbrb.by/api/exrates/rates/${code.toLowerCase()}?paramMode=2&onDate=${date}`);
  const body = await response.json();
  return body.Cur_OfficialRate;
};
