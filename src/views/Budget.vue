<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-mt-lg justify-center">
        <div class="col-8 q-px-md">
          <div class="row justify-between">
            <h5>Monthly Budget</h5>
            <q-btn round color="primary" label="+" @click="createForm = true"></q-btn>
          </div>
        </div>
        <div class="col-4 q-px-md">
          <div class="row justify-between">
            <h5>This week</h5>
            <span>'$1000'</span>
          </div>
          <div class="row">
            <div class="col">
              <q-card flat bordered class="q-mt-lg">
                <q-card-section>
                  <q-card
                    v-for="item in currentWeek"
                    :key="item.id"
                    class="q-my-md"
                    flat
                    bordered>
                    <q-card-section horizontal class="justify-between">
                      <q-card-section>
                        {{ item.title }}
                      </q-card-section>
                      <q-card-section>
                        {{ item.amount }}
                      </q-card-section>
                    </q-card-section>
                  </q-card>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="createForm">
      <q-card style="width: 400px;">
        <q-card-section>
          <h4>Make your plans</h4>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            type="date"
            stack-label
            label="Date"
            v-model="input.date"
            />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Name" v-model="input.title" />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Amount" v-model="input.amount" />
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            stack-label
            label="Description"
            type="textarea"
            v-model="input.description"
            />
        </q-card-section>
        <q-card-actions align="center" class="action-buttons">
          <q-btn color="primary" rounded style="width: 100px;" @click="save()">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Budget',

  setup() {
    return {
      createForm: ref(false),
    };
  },

  data() {
    return {
      input: {
        date: '',
        amount: 0,
        name: '',
        description: '',
      },
    };
  },

  computed: {
    ...mapGetters([
      'budgetList',
    ]),

    currentWeek() {
      return this.budgetList;
    },
  },

  methods: {
    ...mapActions([
      'createBudget',
    ]),

    save() {
      const budget = {
        budgetDate: this.input.date,
        title: this.input.title,
        amount: this.input.amount,
        description: this.input.description,
      };
      this.createBudget(budget);
      this.createForm = false;
    },
  },
};
</script>
