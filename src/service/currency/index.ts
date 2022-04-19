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

interface UpdateCurrencyRequest extends CreateCurrencyRequest {
  uuid: string,
}

export const createCurrency = async (data: CreateCurrencyRequest) => {
  const response = await postRequest(`${BASE_URL}/currencies/`,
    {
      code: data.code,
      sign: data.sign,
      verbalName: data.verbalName,
      isDefault: data.isDefault,
      comments: data.comments,
    });
  return response;
};

export const updateCurrency = async (data: UpdateCurrencyRequest) => {
  const response = await patchRequest(`${BASE_URL}/currencies/${payload.uuid}/`,
    {
      code: data.code,
      sign: data.sign,
      verbalName: data.verbalName,
      isDefault: data.isDefault,
      comments: data.comments,
    });
  return response;
};

export const deleteCurrency = async (uuid: string) => {
  const response = await deleteRequest(`${BASE_URL}/currencies/${uuid}/`);
  return response;
};
