// const TOKEN = store.getters.users.token;
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import store from '@/store';

const TOKEN = store.getters;

/* General requests */

export const BASE_URL = 'http://127.0.0.1:8000';

export const getRequest = (url: string) => {
  const options = {
    method: 'GET',
    headers: new Headers({
      Authorization: `Token ${store.getters.token}`,
    }),
  };

  return fetch(`${BASE_URL}/${url}`, options);
};

export const postRequest = (url: string, requestBody: object) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Token ${store.getters.token}`,
  });

  const options = {
    method: 'POST',
    headers,
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(`${BASE_URL}/${url}`, options);
};

export const patchRequest = (url: string, requestBody: object) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Token ${store.getters.token}`,
  });

  const options = {
    method: 'PATCH',
    headers,
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(`${BASE_URL}/${url}`, options);
};

export const deleteRequest = (url: string, requestBody: object = {}) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Token ${store.getters.token}`,
  });

  const options = {
    method: 'DELETE',
    headers,
    mode: 'cors' as RequestMode,
    body: JSON.stringify(requestBody),
  };

  return fetch(`${BASE_URL}/${url}`, options);
};

/* nbrb.by section */
export const getRate = async (code: string, date: string) => {
  const response = await getRequest(`https://www.nbrb.by/api/exrates/rates/${code.toLowerCase()}?paramMode=2&onDate=${date}`);
  const body = await response.json();
  return body.Cur_OfficialRate / body.Cur_Scale;
};
