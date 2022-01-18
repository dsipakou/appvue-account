<template>
  <q-page class="bg-white window-height row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-black q-my-md">Login to Flying Budget</h5>
      </div>
      <div class="row">
        <q-card bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled v-model="input.name" type="text" label="Name" />
              <q-input square filled v-model="input.email" type="email" label="Email" />
              <q-input square filled v-model="input.password" type="email" label="Password" />
              <q-input square filled
                v-model="input.repeatPassword"
                type="email"
                label="Repeat Password"
                />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated no-caps color="primary" size="lg" class="full-width" label="Signup" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Signup',
});
</script>
