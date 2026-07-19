import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  beats,
  timeToBeats,
  timeToBeatsParts,
  now,
  nowParts,
  beatsToTime,
  timeParts,
  beatsToTimeParts,
} from '@/lib/millidays';

const TIMEZONES = [
  'UTC',
  'Europe/Berlin',
  'America/New_York',
  'Pacific/Kiritimati', // UTC+14
  'Etc/GMT+12', // UTC-12
  'Asia/Kolkata', // UTC+5:30
  'Asia/Kathmandu', // UTC+5:45
  'Australia/Lord_Howe', // UTC+10:30 / DST +11
  'Asia/Singapore', // UTC+8
];

describe('millidays.ts', () => {
  describe('beats function', () => {
    it('calculates beats from a given date', () => {
      const date = new Date('2026-03-22T00:00:00Z');
      const result = beats(date);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1000);
    });

    it('uses current date when no date provided', () => {
      const result = beats();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1000);
    });

    it('returns different values for different times of day', () => {
      const morning = beats(new Date('2026-03-22T06:00:00Z'));
      const evening = beats(new Date('2026-03-22T18:00:00Z'));
      expect(morning).not.toBe(evening);
    });

    it('returns same beats for same UTC time on different dates', () => {
      const time1 = beats(new Date('2026-03-22T12:00:00Z'));
      const time2 = beats(new Date('2026-03-23T12:00:00Z'));
      expect(time1).toBe(time2);
    });

    it('handles midnight UTC', () => {
      const result = beats(new Date('2026-03-22T00:00:00Z'));
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1000);
    });

    it('handles milliseconds', () => {
      const date1 = new Date('2026-03-22T12:00:00.000Z');
      const date2 = new Date('2026-03-22T12:00:00.500Z');
      const result1 = beats(date1);
      const result2 = beats(date2);
      expect(result2).toBeGreaterThan(result1);
    });
  });

  describe('timeToBeats function', () => {
    it('returns formatted beat string from date', () => {
      const date = new Date('2026-03-22T12:00:00Z');
      const result = timeToBeats(date);
      expect(result).toMatch(/^@\d+\.\d{2}$/);
    });

    it('uses precision parameter', () => {
      const date = new Date('2026-03-22T12:00:00Z');
      const result0 = timeToBeats(date, 0);
      const result3 = timeToBeats(date, 3);
      expect(result0).toMatch(/^@\d+$/);
      expect(result3).toMatch(/^@\d+\.\d{3}$/);
    });

    it('pads with zeros to maintain format', () => {
      const date = new Date('2026-03-22T00:00:00Z');
      const result = timeToBeats(date);
      const parts = result.split('@')[1] ?? [];
      expect(parts.length).toBeGreaterThanOrEqual(3);
    });

    it('uses default precision of 2', () => {
      const date = new Date('2026-03-22T12:00:00Z');
      const result = timeToBeats(date);
      const parts = result.split('.');
      expect(parts[1]).toHaveLength(2);
    });

    it('formats with @ prefix', () => {
      const date = new Date('2026-03-22T12:00:00Z');
      const result = timeToBeats(date);
      expect(result).toMatch(/^@/);
    });

    it('handles zero precision', () => {
      const date = new Date('2026-03-22T12:00:00Z');
      const result = timeToBeats(date, 0);
      expect(result).not.toContain('.');
    });

    it('returns consistent results for same time', () => {
      const date = new Date('2026-03-22T12:00:00Z');
      const result1 = timeToBeats(date, 2);
      const result2 = timeToBeats(date, 2);
      expect(result1).toBe(result2);
    });
  });

  describe('now function', () => {
    it('returns current beat time as formatted string', () => {
      const result = now();
      expect(result).toMatch(/^@\d+\.\d{2}$/);
    });

    it('uses default precision of 2', () => {
      const result = now();
      const parts = result.split('.');
      expect(parts[1]).toHaveLength(2);
    });

    it('accepts precision parameter', () => {
      const result3 = now(3);
      expect(result3).toMatch(/^@\d+\.\d{3}$/);
    });

    it('returns different values over time', async () => {
      const result1 = now(4);
      await new Promise((resolve) => setTimeout(resolve, 100));
      const result2 = now(4);
      expect(result1).not.toBe(result2);
    });

    it('returns @ prefix', () => {
      const result = now();
      expect(result).toMatch(/^@/);
    });

    it('handles zero precision', () => {
      const result = now(0);
      expect(result).not.toContain('.');
    });
  });

  describe('beatsToTime function', () => {
    it('converts beats number to Date object', () => {
      const result = beatsToTime(500);
      expect(result).toBeInstanceOf(Date);
    });

    it('returns a valid Date', () => {
      const result = beatsToTime(500);
      expect(!isNaN(result.getTime())).toBe(true);
    });

    it('handles beats at start of day', () => {
      const result = beatsToTime(0);
      expect(result).toBeInstanceOf(Date);
    });

    it('handles beats at end of day', () => {
      const result = beatsToTime(999);
      expect(result).toBeInstanceOf(Date);
    });

    it('handles fractional beats', () => {
      const result = beatsToTime(500.5);
      expect(result).toBeInstanceOf(Date);
    });

    it('converts beats in ascending order to later dates', () => {
      const date1 = beatsToTime(100);
      const date2 = beatsToTime(500);
      expect(date2.getTime()).toBeGreaterThan(date1.getTime());
    });

    it('handles very small beats values', () => {
      const result = beatsToTime(0.001);
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('timezone consistency', () => {
    it('returns same beats regardless of timezone', () => {
      // Create dates with the same UTC time but different timezone interpretations
      const date1 = new Date('2026-03-22T12:00:00.000+01:00');
      const date2 = new Date('2026-03-22T13:00:00.000+02:00');
      const date3 = new Date('2026-03-22T11:00:00.000+00:00');
      const date4 = new Date('2026-03-22T10:00:00.000-01:00');

      const beats1 = beats(date1);
      const beats2 = beats(date2);
      const beats3 = beats(date3);
      const beats4 = beats(date4);

      expect(beats1).toBe(beats2);
      expect(beats2).toBe(beats3);
      expect(beats3).toBe(beats4);
    });

    it('returns different beats for different UTC times', () => {
      const date1 = new Date('2026-03-22T12:00:00.000+01:00');
      const date2 = new Date('2026-03-22T12:00:00.000+02:00');

      const beats1 = beats(date1);
      const beats2 = beats(date2);

      expect(beats1).not.toBe(beats2);
    });

    it('has midnight beats set to zero', () => {
      const midnightUTC = new Date('2026-03-22T00:00:00.000+01:00');
      const result = beats(midnightUTC);

      expect(result).toBe(0);
    });

    it('timeToBeats returns same formatted beat for same UTC moment', () => {
      const date1 = new Date('2026-03-22T15:30:45.000+01:00');
      const date2 = new Date('2026-03-22T16:30:45.000+02:00');

      const formatted1 = timeToBeats(date1, 2);
      const formatted2 = timeToBeats(date2, 2);

      expect(formatted1).toBe(formatted2);
    });

    it('beat calculation accounts for UTC offset correctly', () => {
      // Create two dates at the same local time but different UTC times
      const dateA = new Date('2026-03-22T12:00:00Z'); // UTC noon
      const dateB = new Date('2026-03-22T13:00:00Z'); // UTC 1 PM

      const beatsA = beats(dateA);
      const beatsB = beats(dateB);

      // One hour difference should result in different beat values
      expect(Math.abs(beatsB - beatsA)).toBeCloseTo(1000 / 24, 1);
    });

    it('one day cycle is 1000 beats regardless of timezone', () => {
      const startOfDay = new Date('2026-03-22T00:00:00.000+01:00');
      const endOfDay = new Date('2026-03-22T23:59:59.000+01:00');

      const beatsStart = beats(startOfDay);
      const beatsEnd = beats(endOfDay);

      expect(beatsEnd).toBeGreaterThan(beatsStart);
      expect(beatsEnd).toBeLessThan(1000);
    });
  });

  describe('beats function edge cases', () => {
    it('wraps around to 0 at the BMT day boundary (23:00 UTC)', () => {
      const result = beats(new Date('2026-03-22T23:00:00.000Z'));
      expect(result).toBe(0);
    });

    it('is just under 1000 right before the BMT day boundary', () => {
      const result = beats(new Date('2026-03-22T22:59:59.999Z'));
      expect(result).toBeCloseTo(1000, 0);
      expect(result).toBeLessThan(1000);
    });
  });

  describe('timeToBeatsParts function', () => {
    it('returns beat and fractional parts as separate array entries', () => {
      const date = new Date('2026-03-22T12:00:00Z');
      const parts = timeToBeatsParts(date);
      expect(parts).toHaveLength(2);
      expect(parts[0]).toMatch(/^\d{3}$/);
      expect(parts[1]).toMatch(/^\d{2}$/);
    });

    it('respects precision', () => {
      const date = new Date('2026-03-22T12:00:00Z');
      expect(timeToBeatsParts(date, 3)[1]).toHaveLength(3);
    });

    it('omits the fractional part entirely when precision is 0', () => {
      const date = new Date('2026-03-22T12:00:00Z');
      const parts = timeToBeatsParts(date, 0);
      expect(parts).toHaveLength(1);
    });
  });

  describe('nowParts function', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns current beat as [beats, fraction] using default precision', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-22T12:00:00Z'));
      const parts = nowParts();
      expect(parts).toEqual(['541', '67']);
    });

    it('respects a custom precision', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-22T12:00:00Z'));
      const parts = nowParts(0);
      expect(parts).toEqual(['542']);
    });
  });

  describe('timeParts function', () => {
    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllEnvs();
      vi.restoreAllMocks();
    });

    it('uses the current time when no date is provided', () => {
      vi.useFakeTimers();
      vi.stubEnv('TZ', 'UTC');
      vi.setSystemTime(new Date('2026-03-22T14:05:00Z'));
      expect(timeParts()).toEqual(['2', '05', '00', 'PM']);
    });

    it('splits hours, minutes, seconds and am/pm mode into separate entries', () => {
      vi.stubEnv('TZ', 'UTC');
      const date = new Date('2026-03-22T09:05:03Z');
      expect(timeParts(date)).toEqual(['9', '05', '03', 'AM']);
    });

    it.each(TIMEZONES)('produces a valid, well-formed result in %s', (tz) => {
      vi.stubEnv('TZ', tz);
      const date = new Date('2026-03-22T09:05:03Z');
      const parts = timeParts(date);
      expect(parts.length).toBeGreaterThanOrEqual(3);
      expect(parts[0]).toMatch(/^\d{1,2}$/);
      expect(parts[1]).toMatch(/^\d{2}$/);
      expect(parts[2]).toMatch(/^\d{2}$/);
    });

    it('produces different local hours for the same instant in different timezones', () => {
      const date = new Date('2026-03-22T09:05:03Z');

      vi.stubEnv('TZ', 'UTC');
      const utcHour = timeParts(date)[0];

      vi.stubEnv('TZ', 'Pacific/Kiritimati');
      const kiritimatiHour = timeParts(date)[0];

      expect(kiritimatiHour).not.toBe(utcHour);
    });

    it('does not append a mode entry when the locale time string has no am/pm marker', () => {
      vi.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('14:05:03');
      expect(timeParts(new Date())).toEqual(['14', '05', '03']);
    });

    it('handles an empty locale time string without throwing', () => {
      vi.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('');
      expect(timeParts(new Date())).toEqual(['']);
    });
  });

  describe('beatsToTimeParts function', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('defaults to beats 0 (Unix epoch midnight)', () => {
      vi.stubEnv('TZ', 'UTC');
      expect(beatsToTimeParts()).toEqual(['12', '00', '00', 'AM']);
    });

    it('converts a given beats value to local time parts', () => {
      vi.stubEnv('TZ', 'UTC');
      expect(beatsToTimeParts(500)).toEqual(['12', '00', '00', 'PM']);
    });

    it.each(TIMEZONES)('produces a well-formed result in %s', (tz) => {
      vi.stubEnv('TZ', tz);
      const parts = beatsToTimeParts(250);
      expect(parts.length).toBeGreaterThanOrEqual(3);
      expect(parts[0]).toMatch(/^\d{1,2}$/);
      expect(parts[1]).toMatch(/^\d{2}$/);
    });

    it('produces different local hours for the same beats value in different timezones', () => {
      vi.stubEnv('TZ', 'UTC');
      const utcHour = beatsToTimeParts(500)[0];

      vi.stubEnv('TZ', 'Pacific/Kiritimati');
      const kiritimatiHour = beatsToTimeParts(500)[0];

      expect(kiritimatiHour).not.toBe(utcHour);
    });
  });
});
