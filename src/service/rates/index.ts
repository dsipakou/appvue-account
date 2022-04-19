import {
  BASE_URL,
  getRequest,
  postRequest,
} from '../index';

interface CreateRateRequest {
  currency: string,
  rateDate: string,
  rate: number,
  description?: string,
}

export const getRates = async () => {
  const response = await getRequest('rates/');
  return response;
};

export const getRateChartData = async (range: number) => {
  const response = await getRequest(`rates/chart?range=${range}`);
  return response;
};

export const createRate = async (data: CreateRateRequest) => {
  const response = await postRequest('rates/',
    {
      currency: data.currency,
      rateDate: data.rateDate,
      rate: Number(data.rate),
      description: data.description,
    });
  return response;
};
