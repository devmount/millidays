<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { now } from '@/lib/millidays';
import AnalogClock from "@/components/AnalogClock.vue";
import { TimeMode } from './lib/clock';

const millidays = ref('');
const localtime = ref('');

const millisecondsPerBeat = (24 * 60 * 60) / 1000;

onMounted(() => {
  setInterval(() => {
    millidays.value = now();
    localtime.value = new Date().toLocaleTimeString();
    document.title = `${millidays.value} - ${localtime.value}`;
  }, millisecondsPerBeat);
});
</script>

<template>
  <header>

  </header>

  <main>
    <section class="beats">
      <analog-clock title="Internet" :mode="TimeMode.Millidays" />
      <h1>{{ millidays }}</h1>
    </section>
    <section class="local">
      <analog-clock title="Local" :mode="TimeMode.Milliseconds" />
      <h2>{{ localtime }}</h2>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 2rem;

  section {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;


    &.beats h1 {
      font-family: var(--font-mono);
      font-size: 6rem;
      font-weight: 700;
    }

    &.local h2 {
      font-size: 4rem;
      color: var(--color-heading);
    }
  }
}
</style>
