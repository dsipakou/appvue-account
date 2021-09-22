<template>
  <div class="q-pa-md">
    <div class="row q-ma-sm justify-center">
      <span class="text-h4">Daily Transactions</span>
    </div>
    <div class="row q-ma-lg justify-center">
      <div class="col-6">
        <q-pagination outline
          padding="sm md"
          class="days-pagination"
          color="grey"
          text-color="black"
          :max="30"
          :max-pages="9"
          :boundary-numbers="false"
          :ellipses="false"
          direction-links
          v-model="activeDay">
        </q-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { ref } from 'vue';

export default {
  name: 'DailyTransactions',
  inheritAttrs: false,

  setup() {
    return {
      activeDay: ref(2),
    };
  },

  computed: {
    days() {
      return Array.from({ length: moment().daysInMonth() }, (_, i) => i + 1);
    },
  },
};
</script>
<style scoped>
.header__title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
}

.days-carousel {
  display: flex;
  justify-content: center;
  height: 100px;
  background: none;
}
</style>
