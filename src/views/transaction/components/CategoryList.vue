<template>
  <div v-if="!isCategoryListLoading">
    <div class="row justify-center">
      <div class="col-10 items-center sub-categories">
        <div class="row justify-center">
          <q-card flat bordered
            v-for="category in subCategories"
            :key="category.id"
            @click="selectCategory(category)"
            class="column bg-secondary q-pb-sm q-ma-sm avatar-container align-center">
            <div class="row text-center text-white text-weight-bolder">
              <span>{{ category.name }}</span>
            </div>
          </q-card>
        </div>
      </div>
      <div class="col-2 main-categories-list self-end">
        <q-tabs
          v-model="categoryTabs"
          vertical
          indicator-color="white"
          active-bg-color="white"
          active-color="primary"
          switch-indicator
          no-caps
          dense
          class="text-dark">
          <q-tab
            v-for="category in mainCategories"
            :name="category.id"
            :label="category.name"
            :key="category.id"
            class="main-category-tab"
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
  },

  computed: {
    mainCategories() {
      const categories = this.categoryList.filter((item) => (
        item.parentName === '' && !item.isSystem
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
      this.subCategories = this.categoryList.filter((item) => item.parentName === category.name);
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
