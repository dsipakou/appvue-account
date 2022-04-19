import {
  BASE_URL,
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from '../index';

export const getCurrencies = async () => {
  const response = await getRequest(`${BASE_URL}/currencies`);
  return response;
};

interface CreateCurrencyRequest {
  code: string,
  sign: string,
  verbalName: string,
  isDefault: boolean,
  comments: string,
}

interface UpdateCurrencyRequest {
  code: string,
  sign: string,
  verbalName: string,
  isDefault: boolean,
  comments: string,
  uuid: string,
}

export const createCurrency = async ({
  code,
  sign,
  verbalName,
  isDefault,
  comments,
}: CreateCurrencyRequest) => {
  const response = await postRequest(`${BASE_URL}/currencies/`,
    {
      code,
      sign,
      verbalName,
      isDefault,
      comments,
    });
  return response;
};

export const updateCurrency = async ({
  code,
  sign,
  verbalName,
  isDefault,
  comments,
  uuid,
}: UpdateCurrencyRequest) => {
  const response = await patchRequest(`${BASE_URL}/currencies/${uuid}/`,
    {
      code,
      sign,
      verbalName,
      isDefault,
      comments,
    });
  return response;
};

export const deleteCurrency = async (uuid: string) => {
  const response = await deleteRequest(`${BASE_URL}/currencies/${uuid}/`);
  return response;
};
