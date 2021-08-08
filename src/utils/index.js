/* eslint-disable import/prefer-default-export */

export const makeSelectList = (items, labelField, optional = '') => items.map((item) => {
  const obj = {};
  obj.label = item[optional] ? `${item[optional]}/${item[labelField]}` : `${item[labelField]}`;
  obj.value = item.id;
  return obj;
});
