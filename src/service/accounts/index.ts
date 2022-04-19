import {
  BASE_URL,
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
  const response = await getRequest(`${BASE_URL}/accounts/`);
  return response;
};

export const createAccount = async (data: CreateAccountRequest) => {
  const response = await postRequest(`${BASE_URL}/accounts/`,
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
  const response = await patchRequest(`${BASE_URL}/accounts/${data.uuid}/`,
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
  const response = await deleteRequest(`${BASE_URL}/accounts/${uuid}/`);
  return response;
};
