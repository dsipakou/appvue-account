<template>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="sync" color="primary" text-color="white" />
      <span class="q-ml-sm">
        You are about to duplicate your recurrent budget items. Continue?
      </span>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancel" color="primary" v-close-popup />
      <q-btn flat label="Monthly items" color="primary" v-close-popup />
      <q-btn flat label="Weekly items" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Duplicate budget form',
});
</script>
