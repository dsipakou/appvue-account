import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from '../index';

interface CreateAccountRequest {
  user: string,
  source: string,
  amount: number,
  description: string,
  isMain: boolean,
}

interface UpdateAccountRequest extends CreateAccountRequest {
  uuid: string,
}

export const getAccounts = async () => {
  const response = await getRequest('accounts/');
  return response;
};

export const createAccount = async (data: CreateAccountRequest) => {
  const response = await postRequest('accounts/',
    {
      user: data.user,
      source: data.source,
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
      source: data.source,
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
