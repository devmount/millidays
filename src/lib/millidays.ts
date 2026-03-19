// Heavily inspired by https://github.com/sgwilym/dot-beat-time
// Extended by variable precision handling

const format = (beats: number, precision: number): string => {
  const totalLength = 3 + (precision ? precision + 1 : 0);
  const normalized = beats % 1000;
  const millidays = normalized.toFixed(precision).padStart(totalLength, '0');

  return `@${millidays}`;
};

export const beats = (date?: Date): number => {
  const d = date ?? new Date();

  const seconds =
    d.getUTCMilliseconds() / 1000 + d.getUTCSeconds() + d.getUTCMinutes() * 60 + (d.getUTCHours() + 1) * 3600;

  return (seconds * 1000) / (60 * 60 * 24);
};

export const fromDate = (date: Date, precision: number = 2): string => {
  return format(beats(date), precision);
};

export const now = (precision?: number): string => {
  return fromDate(new Date(), precision ?? 2);
};
