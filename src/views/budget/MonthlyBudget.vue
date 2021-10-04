<template>
  <div class="row justify-between">
    <h5>Monthly Budget</h5>
    <span class="text-subtitle2">Planned {{ monthSum }}</span>
    <q-btn round color="primary" label="+" @click="addBudgetClick()"></q-btn>
  </div>
  <div
    class="row"
    v-for="(chunk, rowIndex) in chunked(groupedByCategory, 3)"
    :key="rowIndex">
    <div
      v-for="(category, colIndex) in chunk"
      class="col-4 align-center"
      :key="category.name">
      <q-card
        class="q-ma-sm monthly-card"
        @mouseover="hover = colIndex + rowIndex * 3"
        @mouseleave="hover = -1"
        :style="selectedCategoryIndex >= 0 && !isActiveCategory(category)
          ? 'filter: blur(3px);' : ''"
        :class="isActiveCategory(category)
          ? 'bg-blue-grey-4 text-white' : ''"
        :flat="hover !== colIndex + rowIndex * 3"
        @click="categoryClick(category.name, colIndex, rowIndex)">
        <q-card-section>
          <span class="text-h6 flex no-wrap overflow-hidden">
            {{ category.name }}
          </span>
        </q-card-section>
        <div>
          <div class="flex flex-center">
            <q-circular-progress
              show-value
              class="text-black q-pb-sm"
              :value="getUsage(category).usagePercent"
              size="140px"
              :color="getUsage(category).mainColor"
              :track-color="getUsage(category).trackColor"
              :thickness="0.2">
              <div class="circular-inner text-subtitle2 text-weight-bold">
                {{ Math.floor(getUsage(category).usageAmount * 100 / category.amount) }}%
              </div>
              <div class="circular-inner text-subtitle1 text-blue-grey-8">
                {{ getUsage(category).usageAmount }}
              </div>
              <div class="circular-inner text-h5 text-weight-bold">
                {{ category.amount }}
              </div>
            </q-circular-progress>
          </div>
        </div>
      </q-card>
      <div
        class="arrow text-blue-grey-4"
        v-show="category.name === selectedCategoryName && selectedCategoryIndex >= 0">
      </div>
    </div>
    <div class="row justify-center" style="width: 100%;">
      <div class="row bg-blue-grey-4 justify-center sub-categories" v-show="rowIndex === row">
        <div class="row justify-center text-h4 text-white q-pt-md">
          {{ selectedCategoryName }}
        </div>
        <div class="row justify-center" style="width: 100%;">
        <q-card
          v-for="(budgetItem, budgetIndex) in selectedCategoryItems"
          :key="budgetItem.name"
          flat
          bordered
          class="q-ma-lg monthly-card--sub">
          <q-carousel
            v-model="selectedCategorySlideIndexes[budgetIndex].model"
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            control-color="blue-grey-7"
            navigation
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
                <q-btn
                  :color="item.isCompleted ? 'negative': 'secondary'"
                  rounded
                  dense
                  no-caps
                  flat
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
    </div>
  </div>
  <q-dialog v-model="createForm">
    <AddForm
      :categories="categories"
      :createBudget="createBudget"
      :budget="budgetCopy"
      />
  </q-dialog>
  <q-dialog v-model="editForm">
    <EditForm
      :categories="categories"
      :item="selectedBudget"
      :updateBudget="updateBudget"
      :deleteBudget="deleteBudget"
      @duplicateClick="makeDuplicate($event)"
      @closeForm="editForm = false"
    />
  </q-dialog>
</template>
<script>
import { ref } from 'vue';
import moment from 'moment';
import AddForm from './forms/AddForm.vue';
import EditForm from './forms/EditForm.vue';

export default {
  name: 'Monthly Budget',

  inheritAttrs: false,

  components: {
    AddForm,
    EditForm,
  },

  setup() {
    return {
      createForm: ref(false),
      editForm: ref(false),
    };
  },

  props: {
    budgetItems: { type: Array, required: true },
    categoryItems: { type: Array, required: true },
    createBudget: { type: Function, required: true },
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
    budgetUsage: { type: Array, required: true },
    updateStatusBudget: { type: Function, required: true },
  },

  data() {
    return {
      hover: -1,
      row: -1,
      column: -1,
      clicked: -1,
      selectedCategoryName: '',
      selectedBudget: {},
      selectedCategorySlideIndexes: [],
      selectedCategoryIndex: -1,
      budgetCopy: {},
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

    monthSum() {
      return this.currentMonth.reduce((acc, item) => (
        acc + item.amount
      ), 0);
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
        const sortedGroupedBudgets = item[1].sort((a, b) => {
          if (a.budgetDate < b.budgetDate) {
            return -1;
          }
          if (a.budgetDate > b.budgetDate) {
            return 1;
          }
          return 0;
        });
        arr.push({
          name: item[0],
          value: sortedGroupedBudgets,
          amount: item[1].reduce((acc, subItem) => acc + subItem.amount, 0),
        });
        categoryClass[categoryName] = arr;
      });

      const groupedList = [];
      Object.entries(categoryClass).forEach((item) => {
        const categoryItem = {
          name: item[0],
          value: item[1],
          amount: item[1].reduce((acc, subItem) => acc + subItem.amount, 0),
        };
        if (categoryItem.name === 'undefined') {
          groupedList.unshift(categoryItem);
        } else {
          groupedList.push(categoryItem);
        }
      });

      return groupedList.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    },

    selectedCategoryItems() {
      const selectedCategory = this.groupedByCategory.find((item) => (
        item.name === this.selectedCategoryName
      ));
      return selectedCategory?.value;
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

    getUsage(category) {
      if (this.budgetUsage.length > 0) {
        const usageAmount = this.budgetUsage.find((item) => (
          item.name === category.name
        ))?.amount?.toFixed(2) || 0;
        let usagePercent = Math.floor((usageAmount * 100) / category.amount);
        let mainColor = '';
        let trackColor = '';
        if (usagePercent > 100) {
          const grade = Math.floor((usagePercent % 100) / 10);
          mainColor = `red-${grade + 5}`;
          trackColor = `red-${Math.floor(usagePercent / 100) + 1}`;
          usagePercent %= 100;
        } else {
          mainColor = `green-${Math.floor(usagePercent / 10) + 1}`;
          trackColor = 'grey-2';
        }
        return {
          usageAmount,
          usagePercent,
          mainColor,
          trackColor,
        };
      }
      return {
        usageAmount: 0,
        usagePercent: 0,
        className: '',
        trackColor: '',
      };
    },

    getShortDate(longDate) {
      return moment(longDate).format('Do');
    },

    isActiveCategory(category) {
      return category.name === this.selectedCategoryName && this.selectedCategoryIndex >= 0;
    },

    addBudgetClick() {
      this.budgetCopy = {};
      this.createForm = true;
    },

    categoryClick(categoryName, column, row) {
      this.selectedCategoryName = categoryName;
      this.row = row;
      this.column = column;

      const index = column + row * 3;

      if (this.selectedCategoryIndex === index) {
        this.selectedCategoryIndex = -1;
        this.selectedCategoryId = -1;
        this.row = -1;
        this.column = -1;
      } else {
        this.selectedCategoryIndex = index;
      }

      const selectedCategory = this.groupedByCategory.find((item) => (
        item.name === this.selectedCategoryName
      ));
      this.selectedCategorySlideIndexes = selectedCategory?.value.map((item) => (
        { ...item, model: item.value.length - 1 }
      ));
    },

    budgetItemClick(item) {
      this.selectedBudget.id = item.id;
      this.selectedBudget.budgetDate = item.budgetDate.substr(0, 10);
      this.selectedBudget.title = item.title;
      this.selectedBudget.amount = item.amount;
      this.selectedBudget.categoryId = item.categoryId;
      this.selectedBudget.description = item.description;
      this.selectedBudget.isCompleted = item.isCompleted;
      this.editForm = true;
    },

    completeItem(item) {
      const completedItem = {
        ...item,
        isCompleted: !item.isCompleted,
      };

      this.updateStatusBudget(completedItem);
    },

    completeItems(items) {
      items.forEach((item) => {
        const completedItem = {
          ...item,
          isCompleted: !item.isCompleted,
        };
        this.updateStatusBudget(completedItem);
      });
    },

    makeDuplicate(budget) {
      this.budgetCopy = budget;
      this.createForm = true;
    },
  },

  watch: {
    groupedByCategory() {
      const selectedCategory = this.groupedByCategory.find((item) => (
        item.name === this.selectedCategoryName
      ));
      this.selectedCategorySlideIndexes = selectedCategory?.value.map((item) => (
        { ...item, model: item.value.length - 1 }
      ));
    },
  },
};
</script>
<style scoped>
.monthly-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  height: 220px;
  cursor: pointer;
  -webkit-user-select: none;
}

.monthly-card--sub {
  display: flex;
  flex-direction: column;
  width: 180px;
  height: 160px;
}

.arrow {
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 15px solid;
  margin: 0 70px;
  width: 50px;
}

.sub-categories {
  width: 100%;
  border-radius: 10px;
}

.circular-inner {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
