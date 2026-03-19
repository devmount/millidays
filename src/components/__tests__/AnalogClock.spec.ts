import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import { TimeMode } from '@/lib/clock';
import MillidaysClock from '../AnalogClock.vue';

describe('MillidaysClock', () => {
  it('renders properly', () => {
    const wrapper = mount(MillidaysClock, { props: { mode: TimeMode.Millidays, title: 'test' } });
    expect(wrapper.text()).toContain('test');
  });
});
