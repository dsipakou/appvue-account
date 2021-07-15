const postRequest = (url, requestBody) => {
  const options = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(requestBody),
  };

  return fetch(url, options);
};

const getRequest = (url) => {
  const options = {
    method: 'GET',
  };

  return fetch(url, options);
};

export const createUser = async (name, email, password) => {
  const response = await postRequest('http://localhost:9091/api/users', { name, email, password });
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

export const createTransaction = async (userId, category, amount, accountId, description) => {
  const response = await postRequest('http://localhost:9091/api/transactions',
    {
      userId,
      category,
      amount,
      accountId,
      description,
    });
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

export const getUsers = async () => {
  const response = await getRequest('http://localhost:9091/api/users');
  return response.json();
};

export const getAccounts = async () => {
  const response = await getRequest('http://localhost:9091/api/accounts');
  return response.json();
};

export const getTransactions = async () => {
  const response = await getRequest('http://localhost:9091/api/transactions');
  return response.json();
};

export const getCategories = async () => {
  const response = await getRequest('http://localhost:9091/api/categories');
  return response.json();
};
