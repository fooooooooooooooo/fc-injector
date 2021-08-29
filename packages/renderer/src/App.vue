<template>
  <div class="centered">
    <h1>FC2 Injector</h1>
    <span
      v-if="state === 0"
      class="has-text-danger"
    > Not Injected</span>
    <span
      v-if="state === 1"
      class="has-text-success"
    > Injected </span>
    <span
      v-if="state === 2"
      class="has-text-danger"
    >
      Not Injected, injecting...
    </span>
    <span
      v-if="state === 3"
      class="has-text-success"
    >
      Injected, ejaculating...
    </span>
  </div>
  <app-navigation />
  <router-view />
</template>

<script>
import { ref, watchEffect, onBeforeMount, onUnmounted } from 'vue';
import AppNavigation from '@/components/AppNavigation.vue';
import constants from '../../shared/constants';
import { useStorage } from '@vueuse/core';
export default {
  name: 'App',
  components: {
    AppNavigation,
  },
  setup() {
    const state = ref(0);

    window.ipcRenderer.receive(
      constants.injectedGet + constants.responseSuffix,
      (data) => {
        // data: true if injected
        data ? (state.value = 1) : (state.value = 0);
      },
    );

    window.ipcRenderer.receive(
      constants.inject + constants.responseSuffix,
      (data) => {
        // data: true if inject successful
        data ? (state.value = 1) : (state.value = 0);
      },
    );

    window.ipcRenderer.receive(
      constants.uninject + constants.responseSuffix,
      (data) => {
        // data: true if uninject successful
        data ? (state.value = 0) : (state.value = 1);
      },
    );

    window.ipcRenderer.receive(constants.changingState, () => {
      if (state.value === 0) state.value = 2;
      if (state.value === 1) state.value = 3;
    });

    /**
     * @param {import('vue').Ref<number>} s
     */
    function setGlobalState(s) {
      window.injectionState = s;
    }

    function saveCss() {
      const css = useStorage('editor-value', '');

      window.ipcRenderer.send(constants.cssSave, css.value);
    }

    window.ipcRenderer.receive(
      constants.cssGet + constants.responseSuffix,
      (data) => {
        const css = useStorage('editor-value', '');
        css.value = data;
      },
    );

    watchEffect(() => {
      setGlobalState(state);
    });

    onBeforeMount(() => {
      window.ipcRenderer.send(constants.cssGet);
      window.ipcRenderer.send(constants.injectedGet);

      document.addEventListener('keydown', (event) => {
        if (event.keyCode === 83 && event.ctrlKey) {
          saveCss();
        }
      });
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', () => {});
    });

    return { state };
  },
};
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;

  height: 100vh;
  width: 100%;

  padding: 1em 4em;
}
</style>
