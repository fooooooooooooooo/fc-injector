<template>
  <div class="tabs">
    <ul>
      <li
        :class="homeActive ? 'is-active' : ''"
        @click="clickHome"
      >
        <router-link to="/">
          Home
        </router-link>
      </li>
      <li
        :class="settingsActive ? 'is-active' : ''"
        @click="clickSettings"
      >
        <router-link to="/settings">
          Settings
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AppNavigation',
  setup() {
    const homeActive = ref(true);
    const settingsActive = ref(false);

    const clickSettings = () => {
      homeActive.value = false;
      settingsActive.value = true;
    };

    const clickHome = () => {
      homeActive.value = true;
      settingsActive.value = false;
    };

    return { homeActive, settingsActive, clickHome, clickSettings };
  },
};
</script>

<style scoped>
nav {
  display: flex;
  gap: 1em;
  justify-content: center;
}
</style>
