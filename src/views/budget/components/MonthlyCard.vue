<template>
  <q-card
    class="q-ma-sm monthly-card"
    @mouseover="hover = column + row * 3"
    @mouseleave="hover = -1"
    :style="selectedCategoryIndex >= 0 && !isActiveCategory()
            ? 'filter: blur(3px);' : ''"
    :class="isActiveCategory()
            ? 'bg-blue-grey-4 text-white' : ''"
    :flat="hover !== column + row * 3"
    @click="categoryClick(category.name, column, row)">
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
          :value="getUsage().usagePercent"
          size="140px"
          :color="getUsage().mainColor"
          :track-color="getUsage().trackColor"
          :thickness="0.2">
          <div class="circular-inner text-subtitle2 text-weight-bold">
            {{ Math.floor(getUsage().usageAmount * 100 / category.amount) }}%
          </div>
          <div class="circular-inner text-subtitle1 text-blue-grey-8">
            {{ getUsage().usageAmount }}
          </div>
          <div class="circular-inner text-h5 text-weight-bold">
            {{ category.amount }}
          </div>
        </q-circular-progress>
      </div>
    </div>
  </q-card>
</template>
<script>
export default {
  name: 'MonthlyCard',

  props: {
    category: { type: Object, required: true },
    budgetUsage: { type: Array, required: true },
    groupedByCategory: { type: Array, required: true },
    selectedCategoryName: { type: String, required: true },
    column: { type: Number, required: true },
    row: { type: Number, required: true },
  },

  methods: {
    isActiveCategory() {
      return this.category.name === this.selectedCategoryName && this.selectedCategoryIndex >= 0;
    },

    categoryClick(categoryName, column, row) {
      // this.selectedCategoryName = categoryName;
      this.curRow = row;
      this.curColumn = column;

      const index = column + row * 3;

      if (this.selectedCategoryIndex === index) {
        this.selectedCategoryIndex = -1;
        this.selectedCategoryId = -1;
        this.curRow = -1;
        this.curColumn = -1;
      } else {
        this.selectedCategoryIndex = index;
      }

      const selectedCategory = this.groupedByCategory.find((item) => (
        item.name === this.selectedCategoryName
      ));
      this.selectedCategorySlideIndexes = selectedCategory?.value.map((item) => (
        { ...item, model: item.value.length - 1 }
      ));
      this.$emit('categoryClick', { categoryName, column, row });
    },

    getUsage() {
      if (this.budgetUsage.length > 0) {
        const usageAmount = this.budgetUsage.find((item) => (
          item.name === this.category.name
        ))?.amount?.toFixed(2) || 0;
        let usagePercent = Math.floor((usageAmount * 100) / this.category.amount);
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

    mounted() {
    },
  },
};
</script>
