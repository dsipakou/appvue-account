/* eslint-disable import/prefer-default-export */

export const makeSelectList = (items, labelField, optional = '', isDisabled = false) => items.map((item) => {
  const obj = {};
  obj.label = item[optional] ? `${item[optional]}/${item[labelField]}` : `${item[labelField]}`;
  obj.value = item.id;
  if (isDisabled) {
    obj.disable = true;
  }
  return obj;
});

export const makeSelectItem = (id, label, isDisabled = false) => {
  const obj = {};
  obj.label = label;
  obj.value = id;
  if (isDisabled) {
    obj.disable = true;
  }
  return obj;
};
