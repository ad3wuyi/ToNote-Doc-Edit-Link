<template>
  <div id="app">
    pdf path: {{pdf}}
    <pdfAnnotate :src="pdf" :toolbar="toolbar" :commentWrapper="commentWrapper"></pdfAnnotate>
  </div>
</template>

<script>

import pdfAnnotate from 'pdf-annotate-vue'
import "pdf-annotate-vue/src/css/toolbar.css";
import "pdf-annotate-vue/src/css/pdf_viewer.css";

export default {
  components: {
    pdfAnnotate
  },
  data() {
    return {
      pdf: './sample.pdf',
      toolbar: true,
      commentWrapper: true,
    }
  }
}
</script>