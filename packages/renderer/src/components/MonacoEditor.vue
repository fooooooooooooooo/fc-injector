<template>
  <div id="container" />
</template>

<script>
import { onMounted, ref, onUnmounted } from 'vue';
import { useDebounceFn, useResizeObserver, useStorage } from '@vueuse/core';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// @ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';

import initialEditorValue from '@/../../shared/initialEditorValue';
import theme from '@/../../shared/theme';

export default {
  name: 'MonacoEditor',
  emits: ['change'],
  /**
   * @param {any} props
   */
  setup(props, { emit }) {
    // @ts-ignore
    self.MonacoEnvironment = {
      /**
       * @param {any} _
       * @param {string} label
       */
      getWorker(_, label) {
        if (label === 'css' || label === 'scss' || label === 'less') {
          return new cssWorker();
        }
        return new editorWorker();
      },
    };

    const editorState = useStorage('editor-state', {});
    const editorValue = useStorage('editor-value', initialEditorValue);

    const container = ref(null);
    let editor;

    const editorObserver = useResizeObserver(container, () => {
      editor.layout();
    });

    onMounted(() => {
      container.value = document.getElementById('container');

      // const monaco = import('monaco-editor/esm/vs/editor/editor.api.js');

      // @ts-ignore
      monaco.editor.defineTheme('nord-theme', theme);

      editor = monaco.editor.create(container.value, {
        language: 'css',
        theme: 'nord-theme',
        fontSize: 16,
        fontFamily: 'JetBrains Mono',
      });

      emit('change', editorValue.value);

      editor.onDidChangeModelContent(
        useDebounceFn(() => {
          if (editorValue.value !== editor.getValue()) {
            editorValue.value = editor.getValue();
            emit('change', editorValue.value);
          }
        }, 500),
      );

      // Set values from storage on load
      if (editorValue.value) {
        editor.setValue(editorValue.value);
        // @ts-ignore
        editor.restoreViewState(editorState.value);
      }
    });

    onUnmounted(() => {
      editor?.dispose();
      editorObserver.stop();
    });

    return { props };
  },
};
</script>

<style>
.monaco-editor,
#container {
  width: 100%;
  height: 80%;
}

.overflow-guard,
#container,
.monaco-editor {
  border-radius: 8px !important;
}

#container {
  box-shadow: 0 0 15px #00000055;
}
</style>
