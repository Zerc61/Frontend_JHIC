import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./assets/css/app.css";

import App from "./App.vue";
import router from "./router";

const options = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  draggable: true,
  draggablePercent: 0.6,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast, options);

app.mount("#app");
