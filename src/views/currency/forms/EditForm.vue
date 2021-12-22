<template>
  <input type="hidden" v-model="input.id" />
  <q-card class="shadow-24" style="width: 400px;">
    <q-card-section>
      <h4>Update currency</h4>
    </q-card-section>
    <q-separator />
    <q-card-section horizontal class="justify-between">
      <q-card-section>
        <q-input outlined stack-label label="Code" v-model="input.code" />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label label="Sign" v-model="input.sign" />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label label="Verbal Name" v-model="input.verbalName" />
      </q-card-section>
    </q-card-section>
    <q-card-section>
      <q-checkbox v-model="input.isDefault" label="Default currency"></q-checkbox>
    </q-card-section>
    <q-card-section>
      <q-input
        outlined
        stack-label
        type="textarea"
        label="Comments"
        v-model="input.comments" />
    </q-card-section>

    <q-card-actions align="center" class="action-buttons">
      <q-btn color="primary" rounded style="width: 100px;" @click="update()">Update</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EditForm',

  props: {
    currency: Object,
    updateCurrency: Function,
  },

  emits: [
    'closeForm',
  ],

  data() {
    return {
      input: {
        id: -1,
        code: '',
        sign: '',
        verbalName: '',
        isDefault: false,
      },
    };
  },

  methods: {
    update() {
      const currency = {
        id: this.input.id,
        sign: this.input.sign,
        code: this.input.code,
        verbalName: this.input.verbalName,
        isDefault: this.input.isDefault,
        comments: this.input.comments,
      };
      this.updateCurrency(currency);
      this.$emit('closeForm');
    },
  },

  mounted() {
    this.input.id = this.currency!.id;
    this.input.verbalName = this.currency!.verbalName;
    this.input.sign = this.currency!.sign;
    this.input.code = this.currency!.code;
    this.input.comments = this.currency!.comments;
    this.input.isDefault = this.currency!.isDefault;
  },
});
</script>
