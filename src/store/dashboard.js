import { ref } from "vue";

export const dashboard = ref({
  token: null,
  status: 'New',
  isOpened: false,
  enableAnno: true,

  setToken(value) { this.token = value },
  setStatus(value) { this.status = value },
  setIsOpened(value) { this.isOpened = value },
  setAnnotation() { this.enableAnno = !this.enableAnno },
})