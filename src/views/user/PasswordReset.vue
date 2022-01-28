<template>
  <q-page class="bg-white window-height row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-black q-my-md">Change your password</h5>
      </div>
      <div class="row">
        <q-card bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled v-model="input.email" type="email" label="Email" />
              <q-input square filled
                v-model="input.password"
                type="password"
                label="Password" />
              <q-input square filled
                v-model="input.repeatPassword"
                type="password"
                label="Repeat Password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated no-caps
              color="primary"
              size="lg"
              class="full-width"
              label="Reset"
              @click="reset()"/>
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <q-btn no-caps dense flat push
              label="Back to login"
              style="text-decoration: underline;"
              color="primary"
              to="/login" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'PasswordReset',

  data() {
    return {
      input: {
        email: '',
        password: '',
        repeatPassword: '',
      },
    };
  },

  methods: {
    ...mapActions([
      'resetUser',
    ]),

    reset() {
      this.resetUser({ email: this.input.email, password: this.input.password });
      console.log('Requested password reset');
    },
  },
});
</script>
<style scoped>
.q-card {
  width: 460px;
}
</style>
