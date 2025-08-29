import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import { setupPermissionDirective } from './directives/permission'
document.title = import.meta.env.VITE_APP_TITLE
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
// 注册权限指令
setupPermissionDirective(app)
app.mount('#app')