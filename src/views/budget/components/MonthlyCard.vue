<template>
  <q-card
    class="q-ma-sm monthly-card"
    @mouseover="hover = cardIndex"
    @mouseleave="hover = null"
    :style="selectedCategory.index >= 0 && !isActiveCategory()
            ? 'filter: blur(3px);' : ''"
    :class="isActiveCategory()
            ? 'bg-blue-grey-4 text-white' : ''"
    :flat="hover !== cardIndex"
    @click="categoryClick(category.name, column, row)">
    <q-card-section>
      <span class="text-h6 flex no-wrap overflow-hidden">
        {{ category.name }}
      </span>
    </q-card-section>
    <div>
      <div class="flex flex-center">
        <q-circular-progress show-value
          class="text-black q-pb-sm"
          :value="getUsage().usagePercent"
          size="140px"
          :color="getUsage().mainColor"
          :track-color="getUsage().trackColor"
          :thickness="0.2">
          <div class="circular-inner text-subtitle2 text-weight-bold">
            {{ usagePercent }}
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
    selectedCategory: { type: Object, required: true },
    column: { type: Number, required: true },
    row: { type: Number, required: true },
  },

  data() {
    return {
      hover: null,
    };
  },

  computed: {
    cardIndex() {
      return this.column + this.row * 3;
    },

    usagePercent() {
      const percentage = this.getUsage().usagePercent;
      return Number.isNaN(percentage) ? 'Unplanned' : `${percentage} %`;
    },
  },

  methods: {
    isActiveCategory() {
      return this.category.name === this.selectedCategory.name && this.selectedCategory.index >= 0;
    },

    categoryClick(categoryName, column, row) {
      this.$emit('categoryClick', { categoryName, column, row });
    },

    getUsage() {
      const usage = {
        usageAmount: 0,
        usagePercent: 0,
        mainColor: '',
        trackColor: '',
      };

      if (this.budgetUsage.length > 0) {
        usage.usageAmount = this.budgetUsage.find((item) => (
          item.name === this.category.name
        ))?.amount?.toFixed(2) || 0;
        usage.usagePercent = Math.floor((usage.usageAmount * 100) / this.category.amount);
        if (usage.usagePercent > 100) {
          const grade = Math.floor((usage.usagePercent % 100) / 10);
          usage.mainColor = `red-${grade + 5}`;
          usage.trackColor = `red-${Math.floor(usage.usagePercent / 100) + 1}`;
          usage.usagePercent %= 100;
        } else {
          usage.mainColor = `green-${Math.floor(usage.usagePercent / 10) + 1}`;
          usage.trackColor = 'grey-2';
        }
      }

      return { ...usage };
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

.circular-inner {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
