<template>
  <q-card class="shadow-24" style="width: 400px;">
    <q-card-section>
      <h4>Add currency</h4>
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
      <q-btn color="primary" rounded style="width: 100px;" @click="create()">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

interface InputFields {
  code: string,
  sign: string,
  verbalName: string,
  isDefault: boolean,
  comments: string,
}

export default defineComponent({
  name: 'AddForm',

  emits: [
    'closeForm',
  ],

  props: {
    createCurrency: { type: Function, required: true },
  },

  data() {
    return {
      input: {
        code: '',
        sign: '',
        verbalName: '',
        isDefault: false,
        comments: '',
      } as InputFields,
    };
  },

  methods: {
    create() {
      const currency = {
        code: this.input.code,
        sign: this.input.sign,
        verbalName: this.input.verbalName,
        isDefault: this.input.isDefault,
        comments: this.input.comments,
      };

      this.createCurrency(currency);
      this.$emit('closeForm');
    },
  },
});
</script>
