import {
  format,
  parse,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
} from 'date-fns';

export const DATE_FORMAT = 'yyyy-MM-dd';

export const getFirstDayOfWeek = (dayOfWeek: string): string => {
  const parsedDate = parse(dayOfWeek, DATE_FORMAT, new Date());
  return format(startOfWeek(parsedDate, { weekStartsOn: 1 }), DATE_FORMAT);
};

export const getFirstDayOfMonth = (dateString: string): string => {
  const parsedDate = parse(dateString, DATE_FORMAT, new Date());
  return format(startOfMonth(parsedDate), DATE_FORMAT);
};

export const getLastDayOfWeek = (dayOfWeek: string): string => {
  const parsedDate = parse(dayOfWeek, DATE_FORMAT, new Date());
  return format(endOfWeek(parsedDate, { weekStartsOn: 1 }), DATE_FORMAT);
};

export const getLastDayOfMonth = (dateString: string): string => {
  const parsedDate = parse(dateString, DATE_FORMAT, new Date());
  return format(endOfMonth(parsedDate), DATE_FORMAT);
};
