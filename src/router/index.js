import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/city',
    component: Layout,
    redirect: '/city/cityList',
    name: 'City',
    meta: { title: '地区管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'cityList',
        name: 'cityList',
        component: () => import('@/views/city/index'),
        meta: { title: '地区列表', icon: 'table' }
      },
      {
        path: 'addCity',
        name: 'addCity',
        component: () => import('@/views/city/addCity'),
        meta: { title: '新增地区', icon: 'tree' }
      },
      {
        path: 'modifyCity/:cityId',
        name: 'modifyCity',
        component: () => import('@/views/city/modifyCity'),
        meta: { title: '修改地区' },
        hidden: true
      }
    ]
  },

  {
    path: '/worksite',
    component: Layout,
    redirect: '/worksite/worksiteList',
    name: 'Worksite',
    meta: { title: '工地管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'cityList',
        name: 'cityList',
        component: () => import('@/views/city/index'),
        meta: { title: '工地列表', icon: 'table' }
      },
      {
        path: 'addCity',
        name: 'addCity',
        component: () => import('@/views/city/addCity'),
        meta: { title: '新增工地', icon: 'tree' }
      },
      {
        path: 'modifyCity/:cityId',
        name: 'modifyCity',
        component: () => import('@/views/city/modifyCity'),
        meta: { title: '修改工地' },
        hidden: true
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
