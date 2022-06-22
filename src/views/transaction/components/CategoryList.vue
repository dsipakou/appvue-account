<template>
  <div v-if="!isCategoryListLoading">
    <div class="main-category-container">
      <div v-for="category in mainCategories" :key="category.uuid" class="main-category-inner">
        <q-icon size="lg" name="thumb_up" />
        <span style="display: flex;">{{ category.name }}</span>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-10 items-center sub-categories">
        <div v-if="isAvailable" class="row justify-center">
          <q-card flat bordered
            v-for="category in subCategories"
            :key="category.uuid"
            @click="selectCategory(category)"
            class="column bg-secondary q-pb-sm q-ma-sm avatar-container align-center">
            <div class="row text-center text-white text-weight-bolder">
              <span>{{ category.name }}</span>
            </div>
          </q-card>
        </div>
        <div v-else class="column text-center text-h3 text-wight-bold">
          Choose an account
        </div>
      </div>
      <div class="col-2 main-categories-list self-end">
        <q-tabs vertical switch-indicator no-caps dense inline-label
          v-model="categoryTabs"
          indicator-color="white"
          active-bg-color="white"
          active-color="primary"
          class="text-dark">
          <q-tab :ripple="false"
            v-for="category in mainCategories"
            :name="category.uuid"
            :label="category.name"
            :key="category.uuid"
            @click="chooseCategory(category)"/>
        </q-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';

export default {
  name: 'CategoryList',

  emits: [
    'selectCategory',
  ],

  setup() {
    return {
      categoryTabs: ref(''),
    };
  },

  data() {
    return {
      subCategories: [],
    };
  },

  props: {
    categoryList: { type: Array, default: () => [] },
    isCategoryListLoading: { type: Boolean, required: true },
    isAvailable: { type: Boolean, default: false },
  },

  computed: {
    mainCategories() {
      const categories = this.categoryList.filter((item) => (
        item.parent === null && !item.isIncome
      )).sort((a, b) => {
        const left = a.name;
        const right = b.name;
        if (left > right) {
          return 1;
        }
        if (left < right) {
          return -1;
        }
        return 0;
      });
      return categories;
    },
  },

  methods: {
    chooseCategory(category) {
      this.subCategories = this.categoryList.filter((item) => item.parent === category.uuid);
    },

    selectCategory(category) {
      this.selectedCategory = category;
      const payload = {
        category,
      };
      this.$emit('selectCategory', payload);
    },
  },
};
</script>
<style>
.main-category-tab {
  max-height: 124px;
}

.main-category-container {
  display: flex;
  overflow: scroll;
  overflow-y: hidden;
}

.main-category-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  border-radius: 2px;
  background: white;
  margin: 0 2px;
  min-width: 80px;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.main-categories-list {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.sub-categories {
  margin-top: 30px;
  border-radius: 10px 0 0 10px;
  background-color: white;
  padding: 20px 0;
  justify-content: center;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  width: 120px;
  align-items: center;
  justify-content: flex-end;
  min-height: 100px;
}
</style>
