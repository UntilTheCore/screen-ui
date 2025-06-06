import Button from './src/button.vue'
import { App } from 'vue'

Button.install = (app: App) => {
  app.component('SButton', Button)
}

export default Button
export { Button }