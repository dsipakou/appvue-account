<template>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="sync" color="primary" text-color="white" />
      <span class="q-ml-sm">
        You are about to duplicate your recurrent budget items. Continue?
      </span>
      <div v-show="duplicatedItems.length > 0">
        <h5>Following items created</h5>
        <p v-for="item in duplicatedItems" :key="item.title">
          <span>{{ item.date }} {{ item.title }}</span>
        </p>
      </div>

    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="OK" color="primary" v-close-popup />
      <q-btn flat
        label="Current month"
        color="primary"
        @click="duplicateBudget('monthly')" />
      <q-btn flat
        label="Current week"
        @click="duplicateBudget('weekly')"
        color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface BudgetedItem {
  date: string,
  title: string,
}

export default defineComponent({
  name: 'Duplicate budget form',

  props: {
    duplicatedItems: { type: Array as PropType<Array<BudgetedItem>>, required: true },
    duplicateBudget: { type: Function, required: true },
  },
});
</script>
