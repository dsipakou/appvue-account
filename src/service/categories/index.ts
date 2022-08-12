import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from '../index';

interface CreateCategoryRequest {
  name: string,
  parent: string | null,
  type: string,
}

interface UpdateCategoryRequest extends CreateCategoryRequest {
  uuid: string,
  isIncome: boolean,
}

export const getCategories = async () => {
  const response = await getRequest('categories/');
  return response;
};

export const createCategory = async (data: CreateCategoryRequest) => {
  const response = await postRequest('categories/',
    {
      name: data.name,
      parent: data.parent,
      type: data.type,
    });
  return response;
};

export const updateCategory = async (data: UpdateCategoryRequest) => {
  const response = await patchRequest(`categories/${data.uuid}/`,
    {
      name: data.name,
      parent: data.parent,
      isIncome: data.isIncome,
    });
  return response;
};

export const deleteCategory = async (uuid: number) => {
  const response = await deleteRequest(`categories/${uuid}/`);
  return response;
};
