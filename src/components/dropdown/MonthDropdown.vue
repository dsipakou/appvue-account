<template>
  <q-select stack-label dense
    label="Month"
    class="month-dropdown"
    :options="monthsList"
    v-model="dropdown"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'MonthDropdown',

  computed: {
    monthsList() {
      const months = [];
      for (let i = 0; i < 12; i += 1) {
        months.push(enUS!.localize!.month(i, { width: 'abbreviated' }));
      }
      return months;
    },
  },
});
</script>
