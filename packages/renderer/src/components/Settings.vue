<template>
  <label
    class="label"
    for="fc-location"
  > FC2 Location </label>

  <div class="field has-addons">
    <div class="control we-wide">
      <input
        v-model="fcLocation"
        class="input"
        name="fc-location"
        type="text"
        placeholder="C:\Users\username\Documents\Fightcade"
      >
    </div>
    <div class="control">
      <a
        class="button is-primary"
        @click="browseFc"
      > Browse </a>
    </div>
  </div>

  <label
    class="label"
    for="css-location"
  > User CSS Location </label>

  <div class="field has-addons">
    <div class="control we-wide">
      <input
        v-model="cssLocation"
        class="input"
        name="css-location"
        type="text"
        placeholder="C:\Users\username\Documents\Fightcade\user.css"
      >
    </div>
    <div class="control">
      <a
        class="button is-primary"
        @click="browseCss"
      > Browse </a>
    </div>
  </div>

  <div class="control">
    <label class="checkbox">
      <input
        v-model="fcDevtools"
        true-value="true"
        false-value="false"
        type="checkbox"
      >
      Enable fightcade devtools
    </label>
  </div>

  <br>

  <div class="buttons">
    <button
      v-if="state === 0 || state === 2"
      class="button is-danger"
      @click="inject"
    >
      Inject
    </button>
    <button
      v-if="state === 1 || state === 3"
      class="button is-danger"
      @click="uninject"
    >
      Ejaculate
    </button>
    <button
      class="button is-primary"
      @click="saveSettings"
    >
      Save Config
    </button>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import constants from '@/../../shared/constants';
export default {
  name: 'Settings',
  setup() {
    const fcLocation = ref('');
    const cssLocation = ref('');
    const fcDevtools = ref('false');

    const state = window.injectionState;

    window.ipcRenderer.receive(
      constants.fcBrowse + constants.responseSuffix,
      (data) => {
        fcLocation.value = data;
      },
    );

    window.ipcRenderer.receive(
      constants.cssBrowse + constants.responseSuffix,
      (data) => {
        cssLocation.value = `${data}\\user.css`;
      },
    );

    window.ipcRenderer.receive(
      constants.settingsGet + constants.responseSuffix,
      (data) => {
        fcLocation.value = data.fightcadePath;
        cssLocation.value = data.cssPath;
        fcDevtools.value = data.enableDevtools;
      },
    );

    function browseCss() {
      window.ipcRenderer.send(constants.cssBrowse);
    }

    function browseFc() {
      window.ipcRenderer.send(constants.fcBrowse);
    }

    function saveSettings() {
      const config = {
        fightcadePath: fcLocation.value,
        cssPath: cssLocation.value,
        enableDevtools: fcDevtools.value === 'false' ? false : true,
      };

      window.ipcRenderer.send(constants.settingsSave, config);
    }

    function getSettings() {
      window.ipcRenderer.send(constants.settingsGet);
    }

    function inject() {
      window.ipcRenderer.send(constants.inject);
    }

    function uninject() {
      window.ipcRenderer.send(constants.uninject);
    }

    onMounted(() => {
      getSettings();
    });

    return {
      fcLocation,
      cssLocation,
      fcDevtools,
      browseFc,
      browseCss,
      saveSettings,
      inject,
      uninject,
      state,
    };
  },
};
</script>
