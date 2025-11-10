import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import indexRoutes from './router/index'

const app = createApp(App)

app.use(createPinia())
app.use(indexRoutes)
app.mount('#app')
