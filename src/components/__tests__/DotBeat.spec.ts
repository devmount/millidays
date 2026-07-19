import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DotBeat from '../DotBeat.vue';

describe('DotBeat', () => {
  it('renders the beat prefixed with @', () => {
    const wrapper = mount(DotBeat, { props: { parts: ['541', '67'] } });
    expect(wrapper.text()).toContain('@');
    expect(wrapper.find('code').text()).toBe('541');
  });

  it('renders the fractional part when present', () => {
    const wrapper = mount(DotBeat, { props: { parts: ['541', '67'] } });
    const codes = wrapper.findAll('code');
    expect(codes).toHaveLength(2);
    expect(codes[1]?.text()).toBe('67');
    expect(wrapper.text()).toContain('.');
  });

  it('omits the fractional part when absent', () => {
    const wrapper = mount(DotBeat, { props: { parts: ['541'] } });
    const codes = wrapper.findAll('code');
    expect(codes).toHaveLength(1);
    expect(wrapper.text()).not.toContain('.');
  });
});
