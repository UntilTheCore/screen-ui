import { App } from 'vue'
import Dialog from './src/dialog.vue'

Dialog.install = (app: App) => {
  app.component('SDialog', Dialog)
}

export {
  Dialog
}