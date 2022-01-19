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
              <q-input square filled v-model="email" type="email" label="Email" />
              <q-input square filled
                v-model="password"
                type="password"
                label="Password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated no-caps
              color="primary"
              size="lg"
              class="full-width"
              label="Login"
              @click="login()"/>
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Not reigistered?
              <q-btn no-caps dense flat push
                label="Create an account"
                style="text-decoration: underline;"
                color="primary"
                to="/signup" />
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { userLogin } from '@/service';

export default defineComponent({
  name: 'Login',

  data() {
    return {
      email: '',
      password: '',
    };
  },

  methods: {
    login() {
      const payload = {
        email: this.email,
        password: this.password,
      };
      userLogin(payload);
    },
  },
});
</script>
<style scoped>
.q-card {
  width: 460px;
}
</style>
