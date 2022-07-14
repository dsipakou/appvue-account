<template>
  <div v-if="!isCategoryListLoading">
    <div class="row justify-center">
      <div v-for="category in mainCategories"
        class="main-category-inner"
        :class="selectedMainCategory === category.uuid ? 'selected' : ''"
        :key="category.uuid"
        :name="category.uuid"
        @click="chooseCategory(category)"
      >
        <q-icon size="lg" name="thumb_up" />
        <span class="main-category-title">{{ category.name }}</span>
      </div>
    </div>
    <div class="row justify-center" v-show="selectedMainCategory !== ''">
      <div class="col-12 items-center sub-categories">
        <div class="row justify-center">
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
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CategoryList',

  emits: [
    'selectCategory',
  ],

  data() {
    return {
      selectedMainCategory: '',
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
      this.selectedMainCategory = category.uuid;
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
<style scoped>
.main-category-tab {
  max-height: 124px;
}

.main-category-container {
  display: flex;
  width: 80%;
  margin: auto;
  justify-content: center;
  flex-wrap: wrap;
}

.main-category-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  border-radius: 2px;
  background: white;
  margin: 2px;
  padding: 4px 2px 0 2px;
  min-width: 80px;
  max-width: 80px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.main-category-title {
  text-align: center;
  width: 100%;
  overflow: hidden;
}

.selected {
  background: grey;
  color: white;
}

.main-categories-list {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.sub-categories {
  margin-top: 30px;
  border-radius: 10px;
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
