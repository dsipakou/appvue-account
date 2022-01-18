<template>
  <q-page class="bg-white window-height row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-black q-my-md">Signup to Flying Budget</h5>
      </div>
      <div class="row">
        <q-card bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled v-model="input.name" type="text" label="Name" />
              <q-input square filled v-model="input.email" type="email" label="Email" />
              <q-input square filled v-model="input.password" type="password" label="Password" />
              <q-input square filled
                v-model="input.repeatPassword"
                type="password"
                label="Repeat Password"
                />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated no-caps color="primary" size="lg" class="full-width" label="Signup" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Have account?
              <q-btn no-caps dense flat push
                label="Login to your account"
                style="text-decoration: underline;"
                color="primary"
                to="/login" />
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Signup',

  data() {
    return {
      input: {
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
      },
    };
  },
});
</script>
<style scoped>
.q-card {
  width: 460px;
}
</style>
