<template>
  <q-select stack-label dense
    label="Month"
    class="month-dropdown"
    :options="items"
    v-model="dropdown"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MonthDropdown',

  setup() {
    return {
      items: ['Jan', 'Feb', 'Mar', 'Arp', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    };
  },
});
</script>
