import {
  getRequest,
  patchRequest,
  postRequest,
} from '../index';

interface CreateRateRequest {
  currency: string,
  rateDate: string,
  rate: number,
  description?: string,
  baseCurrency: string,
}

interface UpdateRateRequest {
  uuid: string,
  rate: number,
}

export const getRates = async () => {
  const response = await getRequest('rates/');
  return response;
};

export const getRatesOnDate = async (date: string) => {
  const response = await getRequest(`rates/day/${date}/`);
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
      baseCurrency: data.baseCurrency,
    });
  return response;
};

export const updateRate = async (data: UpdateRateRequest) => {
  const response = await patchRequest(`rates/${data.uuid}/`,
    {
      rate: data.rate,
    });
  return response;
};
