/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from '../index';

interface TransactionRequest {
  sorting: string,
  limit: string,
  dateFrom: string,
  dateTo: string,
}

interface IncomeRequest {
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
  const response = await getRequest(`transactions?${queryString}`);
  return response;
};

export const getIncome = async ({
  dateFrom = '',
  dateTo = '',
}: IncomeRequest) => {
  const qs = `dateFrom=${dateFrom}&dateTo=${dateTo}`;
  const response = await getRequest(`transactions/income?${qs}`);
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
  const response = await getRequest(`transactions/report?dateFrom=${dateFrom}&dateTo=${dateTo}&currency=${currency}`);
  return response;
};

interface GroupedByParentTransactionRequest {
  dateFrom: string,
  dateTo: string,
}

export const getGroupedByParentTransactions = async ({
  dateFrom,
  dateTo,
}: GroupedByParentTransactionRequest) => {
  const response = await getRequest(`transactions/grouped?dateFrom=${dateFrom}&dateTo=${dateTo}`);
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
  user: string,
  category: string,
  amount: number,
  rate: number,
  account: string,
  currency: string,
  budget: string,
  transactionDate: number,
  type: string,
  description: string,
}
export const createTransaction = async ({
  user,
  category,
  amount,
  rate,
  account,
  currency,
  budget,
  transactionDate,
  type,
  description,
}: CreateTransactionRequest) => {
  const response = await postRequest('transactions/',
    {
      user,
      category,
      amount,
      rate,
      account,
      currency,
      budget,
      transactionDate,
      type,
      description,
    });

  return response;
};

interface UpdateTransactionRequest extends CreateTransactionRequest {
  uuid: string,
}

export const updateTransaction = async ({
  uuid,
  user,
  category,
  amount,
  currency,
  account,
  budget,
  transactionDate,
  type,
  description,
}: UpdateTransactionRequest) => {
  const response = await patchRequest(`transactions/${uuid}/`,
    {
      user,
      category,
      amount,
      currency,
      account,
      budget,
      transactionDate,
      type,
      description,
    });
  return response;
};

export const deleteTransaction = async (uuid: string) => {
  const response = await deleteRequest(`transactions/${uuid}/`);
  return response;
};
