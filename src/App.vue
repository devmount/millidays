<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { timeToBeatsParts, now, nowParts, beatsToTime, timeParts, beatsToTimeParts } from '@/lib/millidays';
import { TimeMode } from './lib/clock';
import { PhAt, PhClock } from "@phosphor-icons/vue";
import AnalogClock from "@/components/AnalogClock.vue";
import DotBeat from "@/components/DotBeat.vue";
import DigitalTime from './components/DigitalTime.vue';

const millidays = ref(['0', '0']);
const localtime = ref(['0', '0', '0', '']);

const millisecondsPerBeat = (24 * 60 * 60) / 1000;

const beats = ref<number>();
const convertedBeats = computed(() => beatsToTimeParts(beats.value));

const time = ref<string>();
const convertedTime = computed(() => {
  const d = new Date();
  if (time.value) {
    const [h, m] = time.value.split(':').map(v => v)
    d.setHours(h ? parseInt(h) : 0);
    d.setMinutes(m ? parseInt(m) : 0);
    d.setSeconds(0);
    d.setMilliseconds(0);
  }
  return timeToBeatsParts(d);
});

onMounted(() => {
  setInterval(() => {
    millidays.value = nowParts();
    localtime.value = timeParts();
    document.title = `${now()} - ${new Date().toLocaleTimeString()}`;
  }, millisecondsPerBeat);
});
</script>

<template>
  <header class="grid">
    <!-- Millidays -->
    <section class="beats">
      <analog-clock title="Internet" :mode="TimeMode.Millidays" />
      <h1><dot-beat :parts="millidays" /></h1>
    </section>
    <!-- Local time -->
    <section class="local">
      <analog-clock title="Local" :mode="TimeMode.Milliseconds" />
      <h2><digital-time :parts="localtime" /></h2>
    </section>
  </header>

  <main class="grid">
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

      <h2>Time conversion</h2>
      <p>Basic duration units and their counterparts.</p>
      <table cellspacing="0">
        <tbody>
          <tr>
            <td><code>1</code> day</td>
            <td>&rarr;</td>
            <td><code>1000</code> beats</td>
          </tr>
          <tr>
            <td><code>1</code> hour</td>
            <td>&rarr;</td>
            <td><code>41.67</code> beats</td>
          </tr>
          <tr>
            <td><code>1</code> minute</td>
            <td>&rarr;</td>
            <td><code>0.694</code> beats</td>
          </tr>
          <tr>
            <td><code>1</code> second</td>
            <td>&rarr;</td>
            <td><code>0.01157</code> beats</td>
          </tr>
          <tr class="accent">
            <td><code>1</code> beat</td>
            <td>&rarr;</td>
            <td><code>1</code> min <code>26.4</code>s</td>
          </tr>
          <tr class="accent">
            <td><code>10</code> beats</td>
            <td>&rarr;</td>
            <td><code>14</code> min <code>24</code>s</td>
          </tr>
          <tr class="accent">
            <td><code>100</code> beats</td>
            <td>&rarr;</td>
            <td><code>1</code>h <code>24</code> min</td>
          </tr>
        </tbody>
      </table>

      <div class="conversion">
        <div>Try it out yourself:</div>
        <div>
          <div class="input">
            <ph-at class="icon" :size="20" />
            <input type="number" min="0" maxlength="3" v-model="beats" />
          </div>
          <span>&rarr;</span>
          <digital-time class="result" v-if="beats" :parts="convertedBeats" />
        </div>
        <div>
          <div class="input">
            <ph-clock class="icon" :size="20" />
            <input type="time" v-model="time" />
          </div>
          <span>&rarr;</span>
          <dot-beat class="result" v-if="time" :parts="convertedTime" />
        </div>
      </div>
    </section>
    <section>

      <h2>Common local times</h2>
      <p>These tables show common beats and times converted to the local time of this browser.
      </p>
      <div class="common-times">
        <table cellspacing="0">
          <tbody>
            <tr v-for="h in Array.from(Array(24).keys())">
              <td class="text-right"><digital-time :parts="[String(h), '00']" /></td>
              <td>&rarr;</td>
              <td><dot-beat :parts="timeToBeatsParts(new Date(2026, 3, 19, h, 0))" /></td>
            </tr>
          </tbody>
        </table>
        <table cellspacing="0">
          <tbody>
            <tr v-for="b in Array.from({ length: 20 }, (_, i) => i * 50)">
              <td><dot-beat :parts="[String(b).padStart(3, '0')]" /></td>
              <td>&rarr;</td>
              <td class="text-right">
                <digital-time :parts="beatsToTimeParts(b)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <footer>
    <p>
      Millidays v<code>0</code>.<code>1</code>.<code>1</code> &mdash;
      Created by <a href="https://devmount.com">devmount</a>.
    </p>
    <p>Star this project on <a href="https://github.com/devmount/millidays" target="_blank">GitHub</a>.</p>
  </footer>
</template>

<style scoped>
header {
  align-items: stretch;
  gap: 4rem 8rem;
  padding: 3rem;

  section {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;

    &.beats h1,
    &.local h2 {
      font-size: 5rem;
      font-weight: 700;
    }

    &.beats h1 {
      color: var(--color-accent);
    }

    &.local h2 {
      color: var(--color-heading);
      font-weight: 500;

      :deep(code) {
        font-weight: 700;
      }

      :deep(small) {
        font-size: .5em;
        margin-inline-start: .5rem;
      }
    }
  }
}

main {
  background: var(--color-background);
  background: linear-gradient(145deg, var(--color-background) 0%, var(--color-border) 100%);

  align-items: stretch;
  gap: 4rem;
  padding: 4rem 8rem 6rem 8rem;

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

    tr.accent {
      color: var(--color-accent);
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

.grid {
  display: grid;
  grid-template-columns: 32rem 32rem;
  justify-content: center;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: 1fr;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.conversion {
  padding: 1rem;
  margin-top: 2rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius);

  display: flex;
  flex-direction: column;
  gap: 1rem;

  &>div {
    display: flex;
    gap: 1rem;
    align-items: center;

    input {
      width: 12rem;
    }

    .result {
      font-size: 1.5rem;
    }
  }
}
</style>
