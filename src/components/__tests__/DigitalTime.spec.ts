import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DigitalTime from '../DigitalTime.vue';

describe('DigitalTime', () => {
  it('renders hours and minutes', () => {
    const wrapper = mount(DigitalTime, { props: { parts: ['14', '05'] } });
    const codes = wrapper.findAll('code');
    expect(codes[0]?.text()).toBe('14');
    expect(codes[1]?.text()).toBe('05');
  });

  it('does not render seconds when parts[2] is absent', () => {
    const wrapper = mount(DigitalTime, { props: { parts: ['14', '05'] } });
    expect(wrapper.findAll('code')).toHaveLength(2);
    expect(wrapper.text()).not.toContain('::');
  });

  it('renders seconds when parts[2] is present', () => {
    const wrapper = mount(DigitalTime, { props: { parts: ['14', '05', '30'] } });
    const codes = wrapper.findAll('code');
    expect(codes).toHaveLength(3);
    expect(codes[2]?.text()).toBe('30');
  });

  it('renders am/pm mode in small element when parts[3] is present', () => {
    const wrapper = mount(DigitalTime, { props: { parts: ['2', '05', '30', 'PM'] } });
    expect(wrapper.find('small').text()).toBe('PM');
  });

  it('renders empty small element when parts[3] is absent', () => {
    const wrapper = mount(DigitalTime, { props: { parts: ['14', '05', '30'] } });
    expect(wrapper.find('small').text()).toBe('');
  });

  it('renders empty small element when parts has no fourth entry at all', () => {
    const wrapper = mount(DigitalTime, { props: { parts: ['14', '05'] } });
    expect(wrapper.find('small').text()).toBe('');
  });
});
