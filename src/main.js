import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

//引入axios模块
import axios from 'axios'
import VueAxios from 'vue-axios'
//使用axios模块
Vue.use(VueAxios,axios)


// 在跳转前执行
router.beforeEach((to, from, next) => {
  // 获取用户登录状态
  let isLogin = sessionStorage.getItem('isLogin');

  // 注销
  if (to.path == '/logout') {
    // 清空
    sessionStorage.clear();

    // 跳转到登录
    next({path: '/user/user-login'});
  }

  // 如果请求的是登录页
  else if (to.path == '/user/user-login') {
    if (isLogin != null) {
      // 跳转到首页
      next({path: '/dashboard'});
    }
  }

  // 如果为非登录状态
  else if (isLogin == null) {
    // 跳转到登录页
    next({path: '/user/user-login'});
  }

  // 下一个路由
  next();
});

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
