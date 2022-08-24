/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from '../index';

export interface CreateAccountRequest {
  user: string,
  title: string,
  category: string,
  amount: number,
  description: string,
  isMain: boolean,
}

export interface UpdateAccountRequest extends CreateAccountRequest {
  uuid: string,
}

export const getAccounts = async () => {
  const response = await getRequest('accounts/');
  return response;
};

export const createAccount = async (data: CreateAccountRequest) => {
  console.log(data);
  const response = await postRequest('accounts/',
    {
      user: data.user,
      title: data.title,
      category: data.category,
      amount: data.amount,
      description: data.description,
      isMain: data.isMain,
    });
  return response;
};

export const updateAccount = async (data: UpdateAccountRequest) => {
  const response = await patchRequest(`accounts/${data.uuid}/`,
    {
      user: data.user,
      title: data.title,
      category: data.category,
      amount: data.amount,
      description: data.description,
      isMain: data.isMain,
    });
  return response;
};

export const deleteAccount = async (uuid: string) => {
  const response = await deleteRequest(`accounts/${uuid}/`);
  return response;
};
