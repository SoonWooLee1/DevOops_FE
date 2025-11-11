import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import indexRoutes from './router/index'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(indexRoutes)
app.mount('#app')
