<template>
  <div class="row bg-blue-grey-4 justify-center sub-categories">
    <div class="row justify-center text-h4 text-white q-pt-md">
      {{ category.name }}
    </div>
    <div class="row justify-center" style="width: 100%;">
      <q-card flat bordered
        v-for="(budgetItem, budgetIndex) in categoryItems"
        :key="budgetItem.name"
        class="q-ma-lg monthly-card--sub">
        <q-carousel swipeable animated navigation
          v-model="slideIndexes[budgetIndex].model"
          transition-prev="slide-right"
          transition-next="slide-left"
          control-color="blue-grey-7"
          :class="budgetItem.value.every((item) => item.isCompleted) ? 'bg-blue-grey-3': ''"
          class="shadow-1 rounded-borders">
          <q-carousel-slide
            :name="index"
            v-for="(item, index) in budgetItem.value"
            class="q-pa-xs"
            :class="budgetItem.value.every((item) => item.isCompleted) ? 'bg-blue-grey-4':
                        item.isCompleted ? 'bg-blue-grey-2' : ''"
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
    </div>
  </div>
</template>
<script>
import moment from 'moment';

export default {
  name: 'CategoryDetailsPanel',

  props: {
    category: { type: Object, required: true },
    categoryItems: { type: Array, required: true },
    categoryGroup: { type: Array, required: true },
  },

  emits: [
    'editBudgetClick',
  ],

  data() {
    return {
      slideIndexes: {},
    };
  },

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
      this.$emit('editBudgetClick', obj);
    },

    getShortDate(longDate) {
      return moment(longDate).format('Do');
    },

    getBudgetItem(name) {
      return this.selectedItems.find((item) => item.name === name);
    },

    fillIndexes() {
      this.slideIndexes = this.categoryItems.map((item) => (
        {
          model: item.size,
        }
      ));
    },
  },

  watch: {
    category() {
      this.fillIndexes();
    },
  },

  beforeMount() {
    this.fillIndexes();
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
