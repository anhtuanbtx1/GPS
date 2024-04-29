import Layout from './layout'
const VModal = {
  install(Vue) {
    this.EvenBus = new Vue()
    // eslint-disable-next-line vue/multi-word-component-names, vue/component-definition-name-casing
    Vue.component('v-modal', Layout)
    Vue.prototype.$modal = {
      open(params) {
        VModal.EvenBus.$emit('open', params)
      },
      close(params) {
        VModal.EvenBus.$emit('close', params)
      },
    }
  },
};

export default VModal;
