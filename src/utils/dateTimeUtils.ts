import {
  format,
  parse,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

const DATE_FORMAT = 'yyyy-MM-dd';

export const getFirstDayOfWeek = (dayOfWeek: string): string => {
  const parsedDate = parse(dayOfWeek, DATE_FORMAT, new Date());
  return format(startOfWeek(parsedDate, { weekStartsOn: 1 }), DATE_FORMAT);
};

export const getLastDayOfWeek = (dayOfWeek: string): string => {
  const parsedDate = parse(dayOfWeek, DATE_FORMAT, new Date());
  return format(endOfWeek(parsedDate, { weekStartsOn: 1 }), DATE_FORMAT);
};
