<template>
  <q-card flat bordered class="q-ma-lg monthly-card--sub">
    <q-carousel swipeable animated navigation
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      control-color="blue-grey-7"
      class="shadow-1 rounded-borders">
      <q-carousel-slide
        :name="index"
        v-for="(item, index) in budgetItem.value"
        class="q-pa-xs"
        :class="getCarouselItemClass(item)"
        :key="item.id">
        <q-card-section
          @click="budgetItemClick(item)"
          class="q-pa-xs cursor-pointer">
          <div class="text-subtitle1 no-wrap text-weight-bold overflow-hidden">
            {{ item.title }}
          </div>
          <div class="text-h6">
            <span>{{ item.amount }}</span>
            <span class="q-ml-sm text-subtitle2">
              {{ getShortDate(item.budgetDate) }}
            </span>
          </div>
        </q-card-section>
        <q-card-actions style="max-height: 40px;" align="around">
          <q-btn rounded dense no-caps flat
            :color="item.isCompleted ? 'negative': 'secondary'"
            :label="item.isCompleted ? 'Incomplete' : 'Complete'"
            @click=completeItem(item) />
          <div
            v-if="item.isCompleted"
            class="absolute-right q-pt-sm q-pr-sm">
            <q-icon
              name="fas fa-check"
              style="font-size: 4.4em;"
              color="green-9" />
          </div>
        </q-card-actions>
      </q-carousel-slide>
    </q-carousel>
  </q-card>
</template>
<script>
import moment from 'moment';
import { ref } from 'vue';

export default {
  name: 'BudgetCard',

  props: {
    budgetItem: { type: Object, required: true },
    updateStatus: { type: Function, required: true },
  },

  setup(props) {
    return {
      slide: ref(props.budgetItem.size),
    };
  },

  emits: [
    'budgetItemClick',
  ],

  methods: {
    budgetItemClick(item) {
      const obj = {
        id: item.id,
        budgetDate: item.budgetDate.substr(0, 10),
        title: item.title,
        amount: item.amount,
        categoryId: item.categoryId,
        description: item.description,
        isCompleted: item.isCompleted,
      };
      this.$emit('budgetItemClick', obj);
    },

    getShortDate(longDate) {
      return moment(longDate).format('Do');
    },

    getCarouselItemClass(budgetItem) {
      if (this.budgetItem.value.every((item) => item.isCompleted)) {
        return 'bg-blue-grey-4';
      }
      if (budgetItem.isCompleted) {
        return 'bg-blue-grey-2';
      }
      return '';
    },

    completeItem(item) {
      const completedItem = {
        ...item,
        isCompleted: !item.isCompleted,
      };

      this.updateStatus(completedItem);
    },
  },
};
</script>
<style scoped>
.monthly-card--sub {
  display: flex;
  flex-direction: column;
  width: 180px;
  height: 160px;
}
</style>
