import { describe, it, expect } from 'vitest';
import { TimeMode, rect, text } from '@/lib/clock';

describe('clock.ts', () => {
  describe('TimeMode enum', () => {
    it('has Millidays value', () => {
      expect(TimeMode.Millidays).toBe('md');
    });

    it('has Milliseconds value', () => {
      expect(TimeMode.Milliseconds).toBe('ms');
    });
  });

  describe('rect function', () => {
    it('creates an SVG rect element', () => {
      const element = rect();
      expect(element.tagName).toBe('rect');
      expect(element.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });

    it('sets default width', () => {
      const element = rect();
      expect(element.getAttribute('width')).toBe('10');
    });

    it('sets custom width', () => {
      const element = rect(20);
      expect(element.getAttribute('width')).toBe('20');
    });

    it('sets default height', () => {
      const element = rect();
      expect(element.getAttribute('height')).toBe('1.5');
    });

    it('sets custom height', () => {
      const element = rect(10, 2.5);
      expect(element.getAttribute('height')).toBe('2.5');
    });

    it('sets default x position', () => {
      const element = rect();
      expect(element.getAttribute('x')).toBe('35');
    });

    it('sets custom x position', () => {
      const element = rect(10, 1.5, 40);
      expect(element.getAttribute('x')).toBe('40');
    });

    it('sets default rotation', () => {
      const element = rect();
      expect(element.style.transform).toContain('rotate(-90deg)');
    });

    it('sets custom rotation', () => {
      const element = rect(10, 1.5, 35, 45);
      expect(element.style.transform).toContain('rotate(-45deg)');
    });

    it('sets default color', () => {
      const element = rect();
      expect(element.getAttribute('fill')).toBe('black');
    });

    it('sets custom color', () => {
      const element = rect(10, 1.5, 35, 0, 'red');
      expect(element.getAttribute('fill')).toBe('red');
    });

    it('has rounded corners', () => {
      const element = rect();
      expect(element.getAttribute('rx')).toBe('.5');
      expect(element.getAttribute('ry')).toBe('.5');
    });

    it('has correct transform origin', () => {
      const element = rect(10, 2);
      expect(element.style.transformOrigin).toBe('0px 1px');
    });

    it('has correct translate', () => {
      const element = rect(10, 2);
      expect(element.style.translate).toBe('0px -1px');
    });
  });

  describe('text function', () => {
    it('creates an SVG text element', () => {
      const element = text();
      expect(element.tagName).toBe('text');
      expect(element.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });

    it('sets text content', () => {
      const element = text('Hello');
      expect(element.innerHTML).toBe('Hello');
    });

    it('sets default font family', () => {
      const element = text();
      expect(element.style.fontFamily).toContain('Inter');
    });

    it('sets default font size', () => {
      const element = text();
      expect(element.style.fontSize).toBe('1rem');
    });

    it('sets custom font size', () => {
      const element = text('', 30, 0, 'black', '2rem');
      expect(element.style.fontSize).toBe('2rem');
    });

    it('sets default font weight', () => {
      const element = text();
      expect(element.style.fontWeight).toBe('400');
    });

    it('sets custom font weight', () => {
      const element = text('', 30, 0, 'black', '1rem', '700');
      expect(element.style.fontWeight).toBe('700');
    });

    it('sets default fill color', () => {
      const element = text();
      expect(element.getAttribute('fill')).toBe('black');
    });

    it('sets custom fill color', () => {
      const element = text('', 30, 0, 'blue');
      expect(element.getAttribute('fill')).toBe('blue');
    });

    it('sets text anchor to middle', () => {
      const element = text();
      expect(element.getAttribute('text-anchor')).toBe('middle');
    });

    it('sets dominant baseline to middle', () => {
      const element = text();
      expect(element.getAttribute('dominant-baseline')).toBe('middle');
    });

    it('calculates x position based on radius and angle', () => {
      const element = text('test', 30, 0);
      const x = parseFloat(element.getAttribute('x') || '0');
      expect(x).toBeGreaterThan(0);
    });

    it('calculates y position based on radius and angle', () => {
      const element = text('test', 30, 90);
      const y = parseFloat(element.getAttribute('y') || '0');
      expect(y).toBeGreaterThan(0);
    });

    it('handles 0 radius', () => {
      const element = text('test', 0, 0);
      expect(element.innerHTML).toBe('test');
    });

    it('handles 0 angle', () => {
      const element = text('test', 30, 0);
      expect(element.getAttribute('x')).toBeDefined();
      expect(element.getAttribute('y')).toBeDefined();
    });

    it('handles negative angle', () => {
      const element = text('test', 30, -90);
      expect(element.getAttribute('x')).toBeDefined();
      expect(element.getAttribute('y')).toBeDefined();
    });
  });
});
