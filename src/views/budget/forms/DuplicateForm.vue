<template>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="sync" color="primary" text-color="white" />
      <span class="q-ml-sm">
        You are about to duplicate your recurrent budget items.
      </span>
      <div v-show="duplicatedItems.length > 0 && dataRequested && !isLoading">
        <h5>Following items created</h5>
        <p v-for="item in duplicatedItems" :key="item.title">
          <q-checkbox v-model="itemsToDuplicate" :val="item.uuid" />
          <span>{{ formattedDate(item.date) }} - {{ item.title }}</span>
        </p>
        <p>
          <q-btn
            color="primary"
            :disable="itemsToDuplicate.length === 0"
            @click="duplicateSelected"
            label="Duplicate selected" />
        </p>
      </div>
      <div v-show="duplicatedItems.length === 0 && dataRequested && !isLoading">
        <h5>Nothing to duplicate</h5>
      </div>

    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="OK" color="primary" v-close-popup />
      <q-btn flat
        label="Current month"
        color="primary"
        @click="requestItems('monthly')" />
      <q-btn flat
        label="Current week"
        @click="requestItems('weekly')"
        color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { parseISO, getDate } from 'date-fns';

interface BudgetedItem {
  uuid: string,
  date: string,
  title: string,
}

export default defineComponent({
  name: 'Duplicate budget form',

  data() {
    return {
      dataRequested: false,
    };
  },

  props: {
    duplicatedItems: { type: Array as PropType<Array<BudgetedItem>>, required: true },
    getDuplicateCandidates: { type: Function, required: true },
    duplicateBudget: { type: Function, required: true },
    isLoading: { type: Boolean, default: false },
  },

  setup() {
    return {
      itemsToDuplicate: ref([]),
    };
  },

  methods: {
    requestItems(type: string) {
      this.dataRequested = true;
      this.getDuplicateCandidates(type);
    },

    duplicateSelected() {
      this.duplicateBudget(this.itemsToDuplicate);
    },

    formattedDate(dateToFormat: string): number {
      console.log(dateToFormat);
      return getDate(parseISO(dateToFormat));
    },
  },
});
</script>
