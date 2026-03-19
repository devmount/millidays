<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fromDate, now, toDate } from '@/lib/millidays';
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
    <!-- Millidays -->
    <section class="beats">
      <analog-clock title="Internet" :mode="TimeMode.Millidays" />
      <h1>{{ millidays }}</h1>
    </section>
    <!-- Local time -->
    <section class="local">
      <analog-clock title="Local" :mode="TimeMode.Milliseconds" />
      <h2>{{ localtime }}</h2>
    </section>

  </header>

  <main>
    <section>
      <h2>Internet time</h2>
      <p>
        <i>Internet time</i> (aka <i>.beat</i> time or <i>Swatch Internet time</i>)
        is a <strong>decimal time system</strong> which is <strong>timezone agnostic</strong>.
      </p>
      <p>
        Instead of seconds, minutes and hours, it features <i>millidays</i> (aka <i>beats</i>),
        which represent the 1000th part of the mean solar day.
        It starts at midnight UTC+1 with <code>@000</code> and counts up to <code>@999</code>.
      </p>
      <p>
        Check out <a href="https://gwil.garden/internet-time/">gwil.garden/internet-time</a> for a nice overview
        and different implementations of this topic.
        Or <a href="https://en.wikipedia.org/wiki/Swatch_Internet_Time" target="_blank">Wikipedia</a> for the historical
        background of time values based on the decimal system.
      </p>
    </section>
    <section>
      <h2>Time conversion</h2>
      <table cellspacing="0">
        <tbody>
          <tr>
            <td>1 beat</td>
            <td>1 min 26.4s</td>
          </tr>
          <tr>
            <td>1 day</td>
            <td>1000 beats</td>
          </tr>
          <tr>
            <td>1 hour</td>
            <td>41.67 beats</td>
          </tr>
          <tr>
            <td>1 minute</td>
            <td>0.694 beats</td>
          </tr>
          <tr>
            <td>1 second</td>
            <td>0.01157 beats</td>
          </tr>
        </tbody>
      </table>

      <h2>Common local times</h2>
      <div class="common-times">
        <table cellspacing="0">
          <tbody>
            <tr v-for="h in [4, 6, 8, 10, 12, 15, 17, 20, 22]">
              <td>{{ h }}:00</td>
              <td><code>{{ fromDate(new Date(2026, 3, 19, h + 1, 0)) }}</code></td>
            </tr>
          </tbody>
        </table>
        <table cellspacing="0">
          <tbody>
            <tr v-for="b in Array.from(Array(10).keys())">
              <td><code>@{{ b }}00</code></td>
              <td>{{ toDate(b * 100).toLocaleTimeString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <footer>
    <p>Created by <a href="https://devmount.com">devmount</a>.</p>
    <p>Star this project on <a href="https://github.com/devmount/millidays" target="_blank">GitHub</a>.</p>
  </footer>
</template>

<style scoped>
header {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 4rem 8rem;
  padding: 2rem;

  section {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;


    &.beats h1 {
      font-size: 6rem;
      color: var(--color-accent);
      font-weight: 700;
    }

    &.local h2 {
      font-size: 6rem;
      color: var(--color-heading);
      font-weight: 500;
    }
  }
}

main {
  background: var(--color-background);
  background: linear-gradient(145deg, var(--color-background) 0%, var(--color-border) 100%);

  display: grid;
  grid-template-columns: 32rem 32rem;
  justify-content: center;
  align-items: stretch;
  gap: 4rem;
  padding: 2rem 8rem 6rem 8rem;

  section {
    flex: 0 0 auto;

    &>.common-times {
      display: flex;
      flex-wrap: wrap;
      align-items: start;
      gap: 2rem;
    }
  }

  h2 {
    color: var(--color-accent);
    font-weight: 900;
    font-size: 3rem;
  }

  table {
    tr:nth-child(odd) {
      background-color: rgba(0, 0, 0, 25%);
    }

    td {
      padding: .125rem 1rem;
    }

    td:nth-child(2) {
      padding-left: 1rem;
    }
  }
}

footer {
  padding: 6rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 1200px) {
  main {
    grid-template-columns: 1fr;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
