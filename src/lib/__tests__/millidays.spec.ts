import { describe, it, expect } from 'vitest';
import { beats, timeToBeats, now, beatsToTime } from '@/lib/millidays';

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
});
