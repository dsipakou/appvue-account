import { GetBudgetForPeriod } from '@/types/Budget';
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from '../index';

export const RECURRENT_OPTIONS = [
  {
    name: 'weekly',
    value: 'Weekly',
  },
  {
    name: 'monthly',
    value: 'Monthly',
  },
];

interface GetBudgetRequest {
  dateFrom: string,
  dateTo: string,
}

interface CreateBudgetRequest {
  budgetDate: string,
  title: string,
  user: string,
  currency: string,
  amount: number,
  category: string,
  description: string,
  recurrent: string | null,
}

interface UpdateBudgetRequest extends CreateBudgetRequest {
  uuid: string,
  isCompleted: boolean,
}

export const getBudget = async () => {
  const response = await getRequest('budget/');
  return response;
};

export const getBudgetArchive = async (data: any) => {
  const response = await getRequest(`budget/archive?date=${data.date}&category=${data.category}`);
  return response;
};

export const getBudgetUsage = async (data: GetBudgetForPeriod) => {
  let url = `budget/usage?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`;
  if (data.user) {
    url += `&user=${data.user}`;
  }
  const response = await getRequest(url);
  return response;
};

export const getWeeklyBudgetUsage = async (data: GetBudgetForPeriod) => {
  let url = `budget/weekly-usage?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`;
  if (data.user) {
    url += `&user=${data.user}`;
  }
  const response = await getRequest(url);
  return response;
};

export const getBudgetPlan = async (data: GetBudgetRequest) => {
  const response = await getRequest(`budget/planned?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`);
  return response;
};

export const createBudget = async (data: CreateBudgetRequest) => {
  const response = await postRequest('budget/',
    {
      budgetDate: data.budgetDate,
      title: data.title,
      category: data.category,
      amount: data.amount,
      user: data.user,
      currency: data.currency,
      recurrent: data.recurrent,
      description: data.description,
    });
  return response;
};

export const updateBudget = async (data: UpdateBudgetRequest) => {
  const response = await patchRequest(`budget/${data.uuid}/`,
    {
      budgetDate: data.budgetDate,
      title: data.title,
      amount: data.amount,
      category: data.category,
      currency: data.currency,
      user: data.user,
      recurrent: data.recurrent,
      description: data.description,
      isCompleted: data.isCompleted,
    });
  return response;
};

export const deleteBudget = async (uuid: number) => {
  const response = await deleteRequest(`budget/${uuid}/`);
  return response;
};

export const getDuplicateCandidates = async (type: string) => {
  const response = await getRequest(`budget/duplicate?type=${type}`);
  return response;
};

export const duplicateBudget = async (uuids: string[]) => {
  const response = await postRequest('budget/duplicate/', { uuids });
  return response;
};
