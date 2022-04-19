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

export const createAccount = async (payload: CreateAccountRequest) => {
  const response = await postRequest(`${BASE_URL}/accounts/`,
    {
      user: payload.user,
      source: payload.source,
      amount: payload.amount,
      description: payload.description,
      isMain: payload.isMain,
    });
  return response;
};

export const updateAccount = async (payload: UpdateAccountRequest) => {
  const response = await patchRequest(`${BASE_URL}/accounts/${payload.uuid}/`,
    {
      user: payload.user,
      source: payload.source,
      amount: payload.amount,
      description: payload.description,
      isMain: payload.isMain,
    });
  return response;
};

export const deleteAccount = async (uuid: string) => {
  const response = await deleteRequest(`${BASE_URL}/accounts/${uuid}/`);
  return response;
};
