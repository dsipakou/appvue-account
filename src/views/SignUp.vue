<template>
  <div class="signup-form">
    <form>
      <h3>Sign up</h3>

      <div>
        <label>Name</label>
        <input v-model="input.name" placeholder="Name" />
      </div>
      <div>
        <label>E-mail</label>
        <input v-model="input.email" placeholder="E-mail" />
      </div>
      <div>
        <label>Password</label>
        <input v-model="input.password" placeholder="Password" />
      </div>
      <div>
        <label>Re-enter password</label>
        <input v-model="input.passwordAgain" placeholder="Re-enter password">
      </div>
      <div>
        <button type="button" v-on:click="signup()">Sign up</button>
      </div>
    </form>
  </div>
  <div>
    <q-card style="width: 400px;">
      <q-form>
        <q-card-section>
          <q-input outlined stack-label
            label="E-mail"
            v-model="input.login.email"
            />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label
            label="Password"
            v-model="input.login.password"
            />
        </q-card-section>
        <q-card-section>
          <q-btn color="primary" rounded @click="login()" label="Login" />
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { userLogin, createUser } from '../service';

export default {
  name: 'SignUp',
  data() {
    return {
      input: {
        name: '',
        email: '',
        password: '',
        passwordAgain: '',
        login: {
          email: '',
          password: '',
        },
      },
    };
  },
  methods: {
    signup() {
      createUser(this.input.name, this.input.email, this.input.password);
    },

    login() {
      const payload = {
        email: this.input.login.email,
        password: this.input.login.password,
      };
      userLogin(payload);
    },
  },
};
</script>
