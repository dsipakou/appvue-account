/* eslint-disable import/prefer-default-export */

export const makeSelectList = (items:any[], labelField:string, optional:string = '', isDisabled:boolean = false) => items.map((item) => {
  const obj: { label?: string, value?:number, disable?:boolean } = {};
  obj.label = item[optional] ? `${item[optional]}/${item[labelField]}` : `${item[labelField]}`;
  obj.value = item.id;
  if (isDisabled) {
    obj.disable = true;
  }
  return obj;
});

export const makeSelectItem = (id:number, label:string, isDisabled:boolean = false) => {
  const obj: { label?: string, value?: number, disable?: boolean } = {};
  obj.label = label;
  obj.value = id;
  if (isDisabled) {
    obj.disable = true;
  }
  return obj;
};
