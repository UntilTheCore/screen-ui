import Input from './src/input.vue'
import { App } from 'vue'

Input.install = (app: App) => {
  app.component('SInput', Input)
}

export {
  Input
}