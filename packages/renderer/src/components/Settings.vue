<template>
  <label class="label"> FC2 Location </label>

  <div class="field has-addons">
    <div class="control we-wide">
      <input
        v-model="fcLocation"
        class="input"
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

  <label class="label"> User CSS Location </label>

  <div class="field has-addons">
    <div class="control we-wide">
      <input
        v-model="cssLocation"
        class="input"
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
  <label
    v-if="u"
    class="label"
  > JS Location </label>

  <div
    v-if="u"
    class="field has-addons"
  >
    <div class="control we-wide">
      <input
        v-model="jsLocation"
        class="input"
        type="text"
        placeholder="C:\Users\username\Documents\Fightcade\user.js"
      >
    </div>
    <div class="control">
      <a
        class="button is-primary"
        @click="browseJs"
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
      Enable devtools
    </label>
  </div>

  <div class="control">
    <label class="checkbox">
      <input
        v-model="fcTransparency"
        true-value="true"
        false-value="false"
        type="checkbox"
      >
      Enable transparency
    </label>
  </div>

  <div class="control">
    <label class="checkbox">
      <input
        v-model="multiInstance"
        true-value="true"
        false-value="false"
        type="checkbox"
      >
      Enable multiple instances
    </label>
  </div>

  <div
    v-if="u"
    class="control"
  >
    <label class="checkbox">
      <input
        v-model="injectJs"
        true-value="true"
        false-value="false"
        type="checkbox"
      >
      Inject JS
    </label>
  </div>
  <br>

  <div class="buttons">
    <button
      v-if="state === 0 || state === 2"
      :disabled="state === 2"
      class="button is-danger"
      @click="inject"
    >
      Inject
    </button>
    <button
      v-if="state === 1 || state === 3"
      :disabled="state === 3"
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
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useMagicKeys } from '@vueuse/core';
import constants from '@/../../shared/constants';
export default {
  name: 'Settings',
  setup() {
    const fcLocation = ref('');
    const cssLocation = ref('');
    const jsLocation = ref('');
    const fcDevtools = ref('false');
    const fcTransparency = ref('false');
    const multiInstance = ref('false');
    const injectJs = ref('false');

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
      constants.jsBrowse + constants.responseSuffix,
      (data) => {
        jsLocation.value = `${data}\\user.js`;
      },
    );

    const w = watch;

    /**
     * @param {import('../../../shared/typeDef').Config} config
     */
    function loadConfig(config) {
      fcLocation.value = config.fightcadePath;
      cssLocation.value = config.cssPath;
      jsLocation.value = config.jsPath;
      fcDevtools.value = config.enableDevtools;
      fcTransparency.value = config.transparency;
      multiInstance.value = config.multiInstance;
      injectJs.value = config.injectJs;
    }

    const m = useMagicKeys;

    window.ipcRenderer.receive(
      constants.settingsGet + constants.responseSuffix,
      (data) => {
        loadConfig(data);
      },
    );

    const ww = watchEffect;

    function browseFc() {
      window.ipcRenderer.send(constants.fcBrowse);
    }

    function browseCss() {
      window.ipcRenderer.send(constants.cssBrowse);
    }

    function browseJs() {
      window.ipcRenderer.send(constants.jsBrowse);
    }

    function f(x) {
      return x === 'false' ? false : true;
    }

    function saveSettings() {
      /**
       * @type {import('../../../shared/typeDef').Config}
       */
      const config = {
        fightcadePath: fcLocation.value,
        cssPath: cssLocation.value,
        jsPath: jsLocation.value,
        enableDevtools: f(fcDevtools.value),
        multiInstance: f(multiInstance.value),
        transparency: f(fcTransparency.value),
        injectJs: f(injectJs.value),
      };

      window.ipcRenderer.send(constants.settingsSave, config);
    }

    const y = String.fromCharCode;

    function getSettings() {
      window.ipcRenderer.send(constants.settingsGet);
    }

    function inject() {
      saveSettings();
      setTimeout(() => {
        window.ipcRenderer.send(constants.inject);
      }, 500);
    }

    function uninject() {
      window.ipcRenderer.send(constants.uninject);
    }

    onMounted(() => {
      getSettings();
    });

    const u = ref(!1),
      { k, arrowRight: r, h, n } = m(),
      i = ref(''),
      p = [72, 72, 82, 78, 75];
    function d() {
      (i.value = ''), (u.value = !u.value);
    }
    for (let b = 0; b < p.length; b++) {
      p[b] = y(p[b]);
    }
    ww(() => {
      i.value === p.join('') && d();
    });
    function c(e) {
      e === p[i.value.length] ? (i.value += e) : (i.value = '');
    }
    w(k, () => {
      k.value && c(y(75));
    });
    w(r, () => {
      r.value && c(y(82));
    });
    w(n, () => {
      n.value && c(y(78));
    });
    w(h, () => {
      h.value && c(y(72));
    });

    return {
      fcLocation,
      cssLocation,
      jsLocation,
      fcDevtools,
      fcTransparency,
      multiInstance,
      injectJs,
      browseFc,
      browseCss,
      browseJs,
      saveSettings,
      inject,
      uninject,
      state,
      u,
    };
  },
};
</script>
