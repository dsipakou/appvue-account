import { GetBudgetForPeriod } from '@/types/Budget';
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
  const url = `budget/usage?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`;
  const response = await getRequest(url);
  return response;
};

export const getWeeklyBudgetUsage = async (data: GetBudgetForPeriod) => {
  const url = `budget/weekly-usage?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`;
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
