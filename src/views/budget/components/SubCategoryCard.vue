<template>
  <q-card flat class="container" @click="selectSubCategory(item.uuid)">
    <div class="row col-12 title--main">
      <span>{{ item.title }}</span>
      <div v-show="!isCreatedByActiveUser" class="recurrent-icon">
        <q-badge color="purple">
          {{ getUsername(item.user) }}
        </q-badge>
      </div>
      <div v-show="isRecurrent" class="recurrent-icon">
        <q-icon name="autorenew" style="padding-right: 5px; align-self: center;" />
        <span>{{item.items[0].recurrent}}</span>
      </div>
    </div>
    <div class="row progress-container">
      <div class="row col-12 justify-center remains">
        <span class="number">{{ getDiff.toFixed(2) }}</span>
        <span class="text" v-if="getDiff < 0">over</span>
        <span class="text" v-else>left</span>
      </div>
      <div class="row desc-text multiply">
        <span>{{ item.items?.length }}x</span>
      </div>
      <q-linear-progress
        class="progress-bar"
        :value="getProgressRate"
        :color="getProgressColor"
        size="34px"
        track-color="grey-6">
        <div class="absolute-full flex flex-center progress-text">
          {{ getProgressRateText }}
        </div>
      </q-linear-progress>
      <div class="row bottom">
        <div class="row desc-text col-6">
          <span class="number">{{ item.spentInBaseCurrency?.toFixed(2) }}</span>
          <span class="text">spent</span>
        </div>
        <div class="row desc-text justify-end col-6">
          <span class="text">of</span>
          <span class="number">{{ item.planned }}</span>
        </div>
      </div>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GroupedBudgetUsageItem, User } from '@/types';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';

export default defineComponent({
  name: 'SubCategoryCard',

  props: {
    activeUser: { type: String, required: true },
    item: { type: Object as PropType<GroupedBudgetUsageItem>, required: true },
    userList: { type: Array as PropType<Array<User>>, required: true },
  },

  emits: [
    'selectSubCategory',
  ],

  computed: {
    getDiff(): number {
      return this.item.planned - this.item.spentInBaseCurrency;
    },

    getProgressRate(): number {
      if (this.item.planned === 0) return 1;
      return this.item.spentInBaseCurrency / this.item.planned;
    },

    getProgressColor(): string {
      if (this.item.planned === 0) return 'brown-14';
      if (this.getProgressRate > 1) return 'red-14';
      return 'green-14';
    },

    getProgressRateText(): string {
      if (this.item.planned === 0) return 'Unplanned';
      return `${(this.getProgressRate * 100).toFixed(0)}%`;
    },

    isRecurrent(): boolean {
      return this.item.items.every((item) => item.recurrent === 'monthly' || item.recurrent === 'weekly');
    },

    isCreatedByActiveUser(): boolean {
      return this.userList.find(
        (item: User) => item.email === this.activeUser,
      )?.uuid === this.item.user;
    },
  },

  methods: {
    selectSubCategory(uuid: string) {
      this.$emit('selectSubCategory', uuid);
    },

    getUsername(uuid: string): string {
      return this.userList.find((item: User) => item.uuid === uuid)!.username;
    },
  },
});
</script>
<style scoped>
.container {
  width: 95%;
  height: 162px;
  width: 362px;
  margin: 10px 0;
  border-radius: 10px;
}

.progress-text {
  font-size: 13px;
  color: white;
}

.content {
  display: flex;
  flex-direction: column;
}

.title--main {
  white-space: nowrap;
  font-size: 18px;
  padding: 15px 0 0 15px;
  justify-content: space-between;
}

.recurrent-icon {
  display: flex;
  align-self: center;
  font-size: 13px;
  padding-right: 15px;
}

.caption--main {
  white-space: nowrap;
  font-size: 16px;
}

.remains {
  margin-top: 5px;
  font-size: 14px;
}

.progress-container {
  margin: 0 36px;
}

.multiply {
  font-size: 10px;
  margin-bottom: 5px;
}

.progress-bar {
  font-size: 13px;
  font-weight: bold;
  color: white;
  border-radius: 3px;
}

.bottom {
  font-size: 10px;
  margin-top: 5px;
}

.desc-text {
  padding: 0 5px;
}

.remains>.text, .bottom .text {
  margin: 0 5px;
}

.remains>.number, .bottom .number {
  font-weight: bold;
}
</style>
