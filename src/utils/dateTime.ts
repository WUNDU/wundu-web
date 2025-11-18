const pad = (value: number) => value.toString().padStart(2, "0");

export const formatDateTimeLocal = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const normalizeDateTimePayload = (value: string): string => {
  if (!value) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return formatDateTimeLocal(parsed);
};

export const isFutureDateTime = (value: string, now: Date = new Date()): boolean => {
  if (!value) {
    return false;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.getTime() > now.getTime();
};
