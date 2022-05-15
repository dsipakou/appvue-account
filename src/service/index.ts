/* General requests */

export const BASE_URL = 'http://127.0.0.1:8000';

export const getRequest = (url: string) => {
  const options = {
    method: 'GET',
  };

  return fetch(`${BASE_URL}/${url}`, options);
};

export const postRequest = (url: string, requestBody: object) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
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
  console.log(code, date);
  const response = await getRequest(`https://www.nbrb.by/api/exrates/rates/${code.toLowerCase()}?paramMode=2&onDate=${date}`);
  const body = await response.json();
  return body.Cur_OfficialRate / body.Cur_Scale;
};
