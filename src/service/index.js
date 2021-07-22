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
  return response.json();
};

export const createUser = async (name, email, password) => {
  const response = await postRequest('http://localhost:9091/api/users', { name, email, password });
  return response.json();
};

/* Transactions section */

export const getTransactions = async () => {
  const response = await getRequest('http://localhost:9091/api/transactions');
  return response.json();
};

export const createTransaction = async ({
  userId,
  categoryId,
  amount,
  accountId,
  transactionDate,
  description,
}) => {
  const response = await postRequest('http://localhost:9091/api/transactions',
    {
      userId,
      categoryId,
      amount,
      accountId,
      transactionDate,
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
  description,
}) => {
  console.log(id, userId, categoryId);
  const response = await patchRequest('http://localhost:9091/api/transactions',
    {
      id,
      userId,
      categoryId,
      amount,
      accountId,
      transactionDate,
      description,
    });
  return response.status;
};

export const deleteTransaction = async (id) => {
  const response = await deleteRequest('http://localhost:9091/api/transactions', { id });
  return response.status;
};

/* Categories section */

export const getCategories = async () => {
  const response = await getRequest('http://localhost:9091/api/categories');
  return response.json();
};

export const createCategory = async (name, parentName) => {
  const response = await postRequest('http://localhost:9091/api/categories',
    {
      name,
      parentName,
    });
  return response.json();
};

/* Accounts section */

export const getAccounts = async () => {
  const response = await getRequest('http://localhost:9091/api/accounts');
  return response.json();
};

export const createAccount = async (userId, source, amount, description) => {
  const response = await postRequest('http://localhost:9091/api/accounts',
    {
      userId,
      source,
      amount,
      description,
    });
  return response.json();
};
