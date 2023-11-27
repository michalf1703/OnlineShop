import { createApp } from "vue";
import App from "./App.vue";

//mitt - bibloteka, ktorej używamy do komunikacji między komponentami 
import mitt from "mitt";
const emitter = mitt();

const app = createApp(App)

app.config.globalProperties.$emitter = emitter;

app.mount("#app");