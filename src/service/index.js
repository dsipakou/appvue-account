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

export const getTransactions = async ({ sorting, dateFrom = '', dateTo = '' }) => {
  let queryString = `sorting=${sorting}`;
  if (dateFrom !== '' && dateTo !== '') {
    queryString += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
  }
  const response = await getRequest(`http://localhost:9091/api/transactions?${queryString}`);
  return response;
};

export const getGroupedTransactions = async ({ dateFrom, dateTo }) => {
  const response = await getRequest(`http://localhost:9091/api/transactions/month/${dateFrom}/${dateTo}`);
  return response;
};

export const transferBetweenAccounts = async ({
  userId,
}) => {
  console.log(userId);
};

export const createTransaction = async ({
  userId,
  categoryId,
  amount,
  rate,
  accountId,
  budgetId,
  transactionDate,
  type,
  description,
}) => {
  const response = await postRequest('http://localhost:9091/api/transactions',
    {
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
}) => {
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
  isMain,
}) => {
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
  isMain,
}) => {
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

export const createCurrency = async ({
  code,
  sign,
  verbalName,
  isDefault,
  comments,
}) => {
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

export const createBudget = async ({
  budgetDate,
  title,
  amount,
  categoryId,
  description,
}) => {
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

export const getBudgetUsage = async ({
  dateFrom,
  dateTo,
}) => {
  const response = await getRequest(`http://localhost:9091/api/budget/period?dateFrom=${dateFrom}&dateTo=${dateTo}`);
  return response;
};

export const updateBudget = async ({
  id,
  budgetDate,
  title,
  amount,
  categoryId,
  description,
  isCompleted,
}) => {
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

export const deleteBudget = async (id) => {
  const response = await deleteRequest('http://localhost:9091/api/budget', { id });
  return response;
};

/* nbrb.by section */
export const getRate = async (code, date) => {
  const response = await getRequest(`https://www.nbrb.by/api/exrates/rates/${code.toLowerCase()}?paramMode=2&onDate=${date}`);
  const body = await response.json();
  return body.Cur_OfficialRate / body.Cur_Scale;
};
