import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import { TimeMode } from '@/lib/clock';
import AnalogClock from '../AnalogClock.vue';

describe('AnalogClock', () => {
  it('renders millidays properly', () => {
    const wrapper = mount(AnalogClock, { props: { mode: TimeMode.Millidays, title: 'test' } });
    expect(wrapper.text()).toContain('750');
    expect(wrapper.text()).toContain('95');
  });

  it('renders milliseconds properly', () => {
    const wrapper = mount(AnalogClock, { props: { mode: TimeMode.Milliseconds, title: 'test' } });
    expect(wrapper.text()).toContain('12');
    expect(wrapper.text()).toContain('55');
  });

  it('renders with correct title', async () => {
    const title = 'My Clock';
    const wrapper = mount(AnalogClock, { props: { mode: TimeMode.Millidays, title } });
    expect(wrapper.text()).toContain(title);
    await wrapper.setProps({ title: 'Updated' });
    expect(wrapper.props('title')).toBe('Updated');
  });

  it('renders SVG element', () => {
    const wrapper = mount(AnalogClock, { props: { mode: TimeMode.Millidays, title: 'test' } });
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('renders circle elements', () => {
    const wrapper = mount(AnalogClock, { props: { mode: TimeMode.Millidays, title: 'test' } });
    const circles = wrapper.findAll('circle');
    expect(circles.length).toBeGreaterThanOrEqual(2);
  });

  it('accepts millidays mode prop', () => {
    const wrapper = mount(AnalogClock, { props: { mode: TimeMode.Millidays, title: 'test' } });
    expect(wrapper.props('mode')).toBe(TimeMode.Millidays);
  });

  it('accepts milliseconds mode prop', () => {
    const wrapper = mount(AnalogClock, { props: { mode: TimeMode.Milliseconds, title: 'test' } });
    expect(wrapper.props('mode')).toBe(TimeMode.Milliseconds);
  });
});
