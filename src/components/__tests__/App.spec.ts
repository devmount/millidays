import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App.vue', () => {
  beforeEach(() => {
    vi.stubEnv('TZ', 'UTC');
    // Fake timers keep App.vue's setInterval (which never gets cleared) from
    // firing on the real clock after a test has already torn down its DOM.
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('renders both analog clocks', () => {
    const wrapper = mount(App);
    expect(wrapper.findAll('svg.wrapper')).toHaveLength(2);
  });

  it('renders the initial (pre-tick) millidays and local time placeholders', () => {
    const wrapper = mount(App);
    expect(wrapper.find('h1').text()).toBe('@0.0');
    expect(wrapper.find('h2').text()).toBe('0:0:0');
  });

  it('updates millidays, local time and document title after one beat interval tick', async () => {
    vi.setSystemTime(new Date('2026-03-22T12:00:00Z'));
    const wrapper = mount(App);

    const millisecondsPerBeat = (24 * 60 * 60) / 1000;
    await vi.advanceTimersByTimeAsync(millisecondsPerBeat);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('h1').text()).toBe('@541.67');
    expect(wrapper.find('h2').text()).toBe('12:00:00PM');
    expect(document.title).toBe('@541.67 - 12:00:00 PM');
  });

  it('hides the beats-to-time conversion result until a value is entered', () => {
    const wrapper = mount(App);
    expect(wrapper.find('.conversion .result').exists()).toBe(false);
  });

  it('converts an entered beats value to local time', async () => {
    const wrapper = mount(App);
    const input = wrapper.find('input[type="number"]');
    await input.setValue(500);

    const result = wrapper.find('.conversion .result');
    expect(result.exists()).toBe(true);
    expect(result.text()).toBe('12:00:00PM');
  });

  it('hides the time-to-beats conversion result until a value is entered', () => {
    const wrapper = mount(App);
    expect(wrapper.findAll('.conversion .result')).toHaveLength(0);
  });

  it('converts an entered local time to beats', async () => {
    const wrapper = mount(App);
    const input = wrapper.find('input[type="time"]');
    await input.setValue('14:30');

    const results = wrapper.findAll('.conversion .result');
    expect(results).toHaveLength(1);
    expect(results[0]?.text()).toBe('@645.83');
  });

  it('converts the same local time to a different beat value in another timezone', async () => {
    vi.stubEnv('TZ', 'Asia/Tokyo');
    const wrapper = mount(App);
    const input = wrapper.find('input[type="time"]');
    await input.setValue('14:30');

    const results = wrapper.findAll('.conversion .result');
    expect(results[0]?.text()).toBe('@270.83');
  });

  it('renders 24 rows of common local times mapped to beats', () => {
    const wrapper = mount(App);
    const tables = wrapper.findAll('.common-times table');
    const rows = tables[0]?.findAll('tbody tr');
    expect(rows).toHaveLength(24);
    expect(rows?.[0]?.text()).toContain('0:00');
  });

  it('renders 20 rows of common beats mapped to local times', () => {
    const wrapper = mount(App);
    const tables = wrapper.findAll('.common-times table');
    const rows = tables[1]?.findAll('tbody tr');
    expect(rows).toHaveLength(20);
    expect(rows?.[0]?.text()).toContain('@000');
  });
});
