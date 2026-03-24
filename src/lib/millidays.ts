// Heavily inspired by https://github.com/sgwilym/dot-beat-time
// Extended by variable precision handling

const format = (beats: number, precision: number): string => {
  const totalLength = 3 + (precision ? precision + 1 : 0);
  const millidays = beats.toFixed(precision).padStart(totalLength, '0');

  return `@${millidays}`;
};

export const beats = (date?: Date): number => {
  const d = date ?? new Date();

  const seconds =
    d.getUTCMilliseconds() / 1000 + d.getUTCSeconds() + d.getUTCMinutes() * 60 + (d.getUTCHours() + 1) * 3600;

  const beats = (seconds * 1000) / (60 * 60 * 24);

  return beats >= 1000 ? beats - 1000 : beats;
};

export const fromDate = (date: Date, precision: number = 2): string => {
  return format(beats(date), precision);
};

export const fromDateParts = (date: Date, precision: number = 2): string[] => {
  return format(beats(date), precision).substring(1).split('.');
};

export const now = (precision?: number): string => {
  return fromDate(new Date(), precision ?? 2);
};

export const nowParts = (precision?: number): string[] => {
  return now(precision).substring(1).split('.');
};

export const toDate = (beats: number): Date => {
  const seconds = (beats * 24 * 60 * 60) / 1000;

  const d = new Date(seconds * 1000);

  var newDate = new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000);

  var offset = d.getTimezoneOffset() / 60;
  var hours = d.getHours();

  newDate.setHours(hours - offset - 2);

  return newDate;
};
