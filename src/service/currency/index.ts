import {
  BASE_URL,
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from '../index';

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

export const getCurrencies = async () => {
  const response = await getRequest('currencies/');
  return response;
};

export const createCurrency = async (data: CreateCurrencyRequest) => {
  const response = await postRequest('currencies/',
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
  const response = await patchRequest(`currencies/${data.uuid}/`,
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
  const response = await deleteRequest(`currencies/${uuid}/`);
  return response;
};
