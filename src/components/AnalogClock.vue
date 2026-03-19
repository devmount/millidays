<script setup lang="ts">
import { rect, text, TimeMode } from '@/lib/clock';
import { beats } from '@/lib/millidays';
import { onMounted, useTemplateRef } from 'vue';

const props = defineProps<{
  mode: TimeMode,
  title: string,
}>()

const wrapper = useTemplateRef('wrapper');

const base = props.mode === TimeMode.Millidays ? 1000 : 12;
const baseTicks = props.mode === TimeMode.Millidays ? 100 : 60;
const majorTicks = props.mode === TimeMode.Millidays ? 25 : 15;
const minorTicks = props.mode === TimeMode.Millidays ? 5 : 5;
const rotationOffset = 360 / baseTicks;

onMounted(() => {
  // Draw title
  wrapper.value?.appendChild(text(props.title, 15, -90, '#F2613F', '.4rem', '700'));

  // Draw ticks and labels
  for (let i = 0; i < baseTicks; i++) {
    const majorLabel = (i === 0 ? base : (i / baseTicks * base)).toString();
    const minorLabel = (i).toString();

    if ((i % majorTicks == 0 || i == 0)) {
      wrapper.value?.appendChild(rect(15, .75, 35, i * rotationOffset, 'hsl(0, 0%, 70%)'));
      wrapper.value?.appendChild(text(majorLabel, 30, i * rotationOffset - 90, 'hsl(0, 0%, 70%)', '.4rem', '700'));
    } else if (i % minorTicks == 0) {
      wrapper.value?.appendChild(rect(12, .75, 35, i * rotationOffset, 'hsl(0, 0%, 40%)'));
      wrapper.value?.appendChild(text(minorLabel, 32, i * rotationOffset - 90, 'hsl(0, 0%, 30%)', '.25rem'));
    } else {
      wrapper.value?.appendChild(rect(10, .5, 35, i * rotationOffset, 'hsl(0, 0%, 30%)'));
    }
  }

  const minorHand = rect(40, 1, 0, 0, 'white'); // second or millibeat
  const majorHand = rect(25, 1.5, 0, 0, 'white'); // minute or decibeat
  const baseHand = rect(15, 2, 0, 0, 'white'); // hour or beat

  wrapper.value?.appendChild(minorHand);
  wrapper.value?.appendChild(majorHand);
  wrapper.value?.appendChild(baseHand);

  const render = () => {
    const time = new Date();
    const bts = beats();

    const minorDegrees = props.mode === TimeMode.Millidays
      ? bts * (360 / 1) - 90
      : (time.getMilliseconds() * 6 / 1000) + (time.getSeconds() * 6) - 90;
    const majorDegrees = props.mode === TimeMode.Millidays
      ? bts * (360 / 100) - 90
      : (time.getSeconds() / 10) + (time.getMinutes() * 6) - 90;
    const baseDegrees = props.mode === TimeMode.Millidays
      ? bts * (360 / 1000) - 90
      : (time.getMinutes() / 2.5) + (time.getHours() * 30) - 90;

    minorHand.style.transform = `rotate(${minorDegrees}deg)`;
    majorHand.style.transform = `rotate(${majorDegrees}deg)`;
    baseHand.style.transform = `rotate(${baseDegrees}deg)`;

    requestAnimationFrame(render);
  };

  render();
});
</script>

<template>
  <svg class="wrapper" xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" ref="wrapper">
    <circle cx="0" cy="0" r="49.5" class="clock"></circle>
    <circle cx="0" cy="0" r="2" class="clock-joint"></circle>
  </svg>
</template>

<style scoped>
.wrapper {
  height: 20rem;
  width: 20rem;
}

.clock {
  stroke: hsl(0, 0%, 20%);
  fill: hsl(0, 0%, 10%);
}

.clock-joint {
  fill: white;
}
</style>
