<template>
  <MonacoEditor />
</template>

<script>
import MonacoEditor from '@/components/MonacoEditor.vue';

export default {
  name: 'Home',
  components: {
    MonacoEditor,
  },
  setup(props) {
    return { props };
  },
};
</script>
