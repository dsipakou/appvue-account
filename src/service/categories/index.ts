import {
  BASE_URL,
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from '../index';

interface CreateCategoryRequest {
  name: string,
  parent: string | undefined,
}

interface UpdateCategoryRequest extends CreateCategoryRequest {
  uuid: string,
  isIncome: boolean,
}

export const getCategories = async () => {
  const response = await getRequest(`${BASE_URL}/categories/`);
  return response;
};

export const createCategory = async (payload: CreateCategoryRequest) => {
  const response = await postRequest(`${BASE_URL}/categories/`,
    {
      name: payload.name,
      parent: payload.parent,
    });
  return response;
};

export const updateCategory = async (payload: UpdateCategoryRequest) => {
  const response = await patchRequest(`${BASE_URL}/categories/${payload.uuid}/`,
    {
      name: payload.name,
      parent: payload.parent,
      isIncome: payload.isIncome,
    });
  return response;
};

export const deleteCategory = async (uuid: number) => {
  const response = await deleteRequest(`${BASE_URL}/categories/${uuid}/`);
  return response;
};
