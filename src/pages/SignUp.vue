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
</template>

<script>
import { createUser } from '@/service';

export default {
  name: 'SignUp',
  data() {
    return {
      input: {
        name: '',
        email: '',
        password: '',
        passwordAgain: '',
      },
    };
  },
  methods: {
    signup() {
      createUser(this.input.name, this.input.email, this.input.password);
    },
  },
};
</script>
