import { App } from 'vue'
import ResponsiveLayout from './src/responsive-layout.vue'

ResponsiveLayout.install = (app: App) => {
  app.component('SResponsiveLayout', ResponsiveLayout)
}

export {
  ResponsiveLayout
}