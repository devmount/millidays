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

export const timeToBeats = (date: Date, precision: number = 2): string => {
  return format(beats(date), precision);
};

export const timeToBeatsParts = (date: Date, precision: number = 2): string[] => {
  return format(beats(date), precision).substring(1).split('.');
};

export const now = (precision?: number): string => {
  return timeToBeats(new Date(), precision ?? 2);
};

export const nowParts = (precision?: number): string[] => {
  return now(precision).substring(1).split('.');
};

export const beatsToTime = (beats: number): Date => {
  const milliseconds = beats * 24 * 60 * 60;
  return new Date(milliseconds);
};

export const timeParts = (date?: Date) => {
  const t = date ? date.toLocaleTimeString() : new Date().toLocaleTimeString();
  const [time, mode] = t.split(' ');
  const parts = time?.split(':') ?? ['0', '0', '0'];
  if (mode) {
    parts.push(mode);
  }
  return parts;
};

export const beatsToTimeParts = (beats?: number): string[] => {
  const d = beatsToTime(beats ?? 0);
  return timeParts(d);
};
