<template>
  <div class="row justify-between">
    <h5>Monthly Budget</h5>
    <span class="text-subtitle2">Planned {{ monthSum }}</span>
    <q-btn round color="primary" label="+" @click="createForm = true"></q-btn>
  </div>
  <div
    class="row"
    v-for="(chunk, rowIndex) in chunked(groupedByCategory, 3)"
    :key="rowIndex">
    <div
      v-for="(category, colIndex) in chunk"
      class="col-4"
      :key="category.name">
      <q-card
        class="q-ma-sm monthly-card"
        @mouseover="hover = colIndex + rowIndex * 3"
        @mouseleave="hover = -1"
        :flat="hover !== colIndex + rowIndex * 3"
        @click="categoryClick(category, colIndex + rowIndex * 3)">
        <q-card-section>
          <span class="text-h6 overflow-hidden">
            {{ category.name }}
          </span>
        </q-card-section>
      </q-card>
      <q-slide-transition>
        <div class="col-8" v-show="selectedCategory === colIndex + rowIndex * 3">
          <q-card
            v-for="budget in category.value"
            :key="budget.value[0].id"
            flat
            bordered
            class="q-ma-lg monthly-card"
            >
            <q-card-section>
              <div class="text-h6 overflow-hidden">
                {{ budget.value[0].title }}
              </div>
            <div class="text-subtitle2">
              {{ budget.value[0].amount }}
            </div>
            </q-card-section>
            <q-card-actions class="align-bottom" align="around">
              <div v-if="budget.value.length > 1">
                <q-btn
                  color="primary"
                  rounded
                  dense
                  flat
                  v-for="(item, index) in budget.value"
                  :key="item.id"
                  @click="budgetItemClick(item)"
                  :label="index + 1" />
              </div>
              <div v-else>
                <q-btn
                  color="primary"
                  rounded
                  dense
                  flat
                  @click="budgetItemClick(budget.value[0])"
                  label="Edit" />
              </div>
              <div
                v-if="budget.value.every((item) => item.isCompleted)"
                class="absolute-right q-pt-sm q-pr-sm">
                <q-btn
                  flat
                  dense
                  icon="fas fa-check"
                  color="green"
                  @click="completeItems(budget.value)" />
              </div>
              <div
                class="absolute-right q-pt-sm q-pr-sm"
                v-else>
                <q-btn
                  no-caps
                  flat
                  dense
                  label="Done"
                  @click="completeItems(budget.value)" />
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </q-slide-transition>
    </div>
  </div>
</template>
<script>
import moment from 'moment';

export default {
  name: 'Monthly Budget',

  props: {
    budgetItems: {
      type: Array,
      required: true,
    },
    categoryItems: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      hover: -1,
      clicked: -1,
    };
  },

  computed: {
    categories() {
      return this.categoryItems.filter((item) => item.isParent);
    },

    currentMonth() {
      return this.budgetItems.filter((item) => (
        moment(item.budgetDate).month() === moment().month()
      ));
    },

    groupedByCategory() {
      const groupedMonth = this.currentMonth.reduce((acc, item) => {
        const arr = acc[item.title] || [];
        arr.push(item);
        acc[item.title] = arr;
        return acc;
      }, {});

      const categoryClass = {};
      Object.entries(groupedMonth).forEach((item) => {
        const { categoryId } = item[1][0];
        const categoryName = categoryId === null
          ? 'undefined'
          : this.categories.find((category) => category.id === categoryId).name;
        const arr = categoryClass[categoryName] || [];
        arr.push({ name: item[0], value: item[1] });
        categoryClass[categoryName] = arr;
      });

      const groupedList = [];
      Object.entries(categoryClass).forEach((item) => {
        const categoryItem = {
          name: item[0],
          value: item[1],
        };
        if (categoryItem.name === 'undefined') {
          groupedList.unshift(categoryItem);
        } else {
          groupedList.push(categoryItem);
        }
      });

      return groupedList;
    },
  },

  methods: {
    chunked(items, len) {
      const chunks = [];
      let i = 0;
      const n = items.length;

      while (i < n) {
        chunks.push(items.slice(i, i += len));
      }

      return chunks;
    },

    categoryClick(category, index) {
      this.category = category;
      this.selectedCategory = this.selectedCategory === index ? -1 : index;
    },
  },
};
</script>
<style scoped>
.monthly-card {
  width: 190px;
  height: 150px;
  font-size: 1.2em;
  justify-content: center;
}
</style>