<template>
  <q-card class="shadow-24" style="width: 400px;">
    <q-card-section>
      <h4>Add income</h4>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-select
        clearable
        outlined
        map-options
        option-value="uuid"
        option-label="source"
        v-model="input.account"
        :options="accountList"
        label="Account" />
    </q-card-section>
    <q-card-section>
      <q-select
        clearable
        outlined
        map-options
        option-value="uuid"
        option-label="name"
        v-model="input.category"
        :options="systemCategories"
        label="Category" />
    </q-card-section>
    <q-card-section>
      <q-select
        clearable
        outlined
        map-options
        option-value="uuid"
        option-label="username"
        v-model="input.user"
        :options="userList"
        label="User" />
    </q-card-section>
    <q-card-section>
      <q-input outlined stack-label label="Amount" v-model="input.amount" />
    </q-card-section>
    <q-card-section>
        <CurrencyDropdown
          :currencyList="currencyList"
          :ratesList="ratesList"
          :selectedDate="activeDate"
          :currencyListLoaded="currencyListLoaded"
          @selectCurrency="input.currency = $event" />
    </q-card-section>
    <q-card-section>
      <q-input
        outlined
        type="date"
        stack-label
        label="Date"
        v-model="input.transactionDate"
        />
    </q-card-section>
    <q-card-section>
      <q-input
        outlined
        stack-label
        type="textarea"
        label="Description"
        v-model="input.description" />
    </q-card-section>

    <q-card-actions align="center" class="action-buttons">
      <q-btn color="primary" rounded style="width: 100px;" @click="save()">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  Account,
  Category,
  Currency,
  Rate,
  User,
  AccountSaveIncomeForm,
} from '@/types';
import CurrencyDropdown from '@/components/dropdown/CurrencyDropdown.vue';

export default defineComponent({
  name: 'Add account form',

  components: {
    CurrencyDropdown,
  },

  emits: [
    'save',
  ],

  props: {
    currencyListLoaded: { type: Boolean, required: true },
    accountList: { type: Array as PropType<Array<Account>>, required: true },
    categoryList: { type: Array as PropType<Array<Category>>, required: true },
    currencyList: { type: Array as PropType<Array<Currency>>, required: true },
    ratesList: { type: Array as PropType<Array<Rate>>, required: true },
    userList: { type: Array as PropType<Array<User>>, required: true },
  },

  data() {
    return {
      activeDate: '',
      input: {
        account: {} as Account,
        amount: 0,
        category: {} as Category,
        user: {} as User,
        currency: {} as Currency,
        transactionDate: '',
        description: '',
      } as AccountSaveIncomeForm,
    };
  },

  computed: {
    systemCategories() {
      return this.categoryList.filter((item: Category) => item.isIncome);
    },
  },

  methods: {
    setActiveDate() {
      this.activeDate = this.input.transactionDate;
    },

    save() {
      this.$emit('save', this.input);
    },
  },

  watch: {
    'input.transactionDate': {
      handler() {
        this.setActiveDate();
      },
    },
  },

  mounted() {
    this.activeDate = this.input.transactionDate;
  },
});
</script>
