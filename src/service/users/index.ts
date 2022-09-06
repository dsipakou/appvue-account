/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import {
  getRequest,
  postRequest,
  patchRequest,
} from '../index';

export interface LoginPayload {
  email: string,
  password: string,
}

export interface SignupPayload {
  name: string,
  email: string,
  password: string,
}

export interface ResetUserPayload {
  email: string,
  password: string,
}

export const userLogin = async ({ email, password }: LoginPayload) => {
  const response = await postRequest('users/login/', { email, password });
  return response;
};

export const getUsers = async () => {
  const response = await getRequest('users/');
  return response;
};

export const createUser = async ({ name, email, password }: SignupPayload) => {
  const response = await postRequest('http://localhost:9091/api/users', { name, email, password });
  return response.json();
};

export const resetUser = async ({ email, password }: ResetUserPayload) => {
  const response = await postRequest('http://localhost:9091/api/reset', { email, password });
  return response;
};

export const changeCurrency = async (currencyCode: string) => {
  const response = await patchRequest('users/currency/', { currency: currencyCode });
  return response;
};
