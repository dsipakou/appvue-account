<template>
  <q-card flat bordered class="main-panel">
    <div class="row justify-center col-12">
      <span>{{ weekDays[0].formated }} - {{ weekDays[weekDays.length - 1].formated }}</span>
    </div>
    <div class="row justify-left">
      <q-timeline color="grey-5" side="right" layout="comfortable" class="timeline">
        <q-timeline-entry
          v-for="day in weekDays"
          :key="day.formated">
          <template v-slot:subtitle>
            <span>{{ day.formated }}</span>
          </template>
        </q-timeline-entry>
      </q-timeline>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { startOfWeek, addDays, format } from 'date-fns';

const DATE_FORMAT = 'dd MMM';

export default defineComponent({
  name: 'Week Budget',

  computed: {
    weekDays() {
      const firstDayOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const days = [];
      for (let i = 0; i < 7; i += 1) {
        days.push({
          full: addDays(firstDayOfWeek, i),
          formated: format(addDays(firstDayOfWeek, i), DATE_FORMAT),
        });
      }
      return days;
    },
  },
});
</script>
<style scoped>
.main-panel {
  margin: 5px 0;
  width: 100%;
  max-width: 100%;
  justify-content: start;
  align-content: start;
  padding: 15px;
  border-radius: 20px;
  background-color: #EEE;
}
</style>

<style>
.q-timeline__subtitle {
  width: auto !important;
  text-transform: none !important;
  font-size: 12px !important;
  font-weight: normal !important;
  color: rgba(0, 0, 0, 1) !important;
}
</style>
