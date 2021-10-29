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
    path: '/user',
    component: Layout,
    redirect: '/user/user-list',
    name: 'user',
    meta: { title: '员工信息', icon: 'peoples' },
    children: [
      {
        path: 'user-list',
        name: 'user-list',
        component: () => import('@/views/user/user-list'),
        meta: { title: '员工列表', icon: 'el-icon-s-custom' }
      },
      {
        path: 'update-user/:uid',
        name: 'update-user',
        hidden: true,
        component: () => import('@/views/user/update-user'),
        meta: { title: '修改员工', icon: 'tree' }
      },
      {
        path: 'add-user',
        name: 'add-user',
        component: () => import('@/views/user/add-user'),
        meta: { title: '添加员工', icon: 'el-icon-circle-plus-outline' }
      },
    ]
  },

  {
    path: '/machine_type',
    component: Layout,
    redirect: '/machine_type/machine_type-list',
    name: 'machine_type',
    meta: { title: '设备类型管理', icon: 'el-icon-notebook-1' },
    children: [
      {
        path: 'machine_type-list',
        name: 'machine_type-list',
        component: () => import('@/views/machine_type/machine_type-list'),
        meta: { title: '设备类型列表', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'machine_type-update/:typeId',
        name: 'machine_type-update',
        hidden: true,
        component: () => import('@/views/machine_type/machine_type-update'),
        meta: { title: '修改设备类型', icon: 'tree' }
      },
      {
        path: 'machine_type-add',
        name: 'machine_type-add',
        component: () => import('@/views/machine_type/machine_type-add'),
        meta: { title: '添加设备类型', icon: 'el-icon-circle-plus-outline' }
      },
    ]
  },

  {
    path: '/machine',
    component: Layout,
    redirect: '/machine/machine-list',
    name: 'machine',
    meta: { title: '设备管理', icon: 'el-icon-collection' },
    children: [
      {
        path: 'machine-list',
        name: 'machine-list',
        component: () => import('@/views/machine/machine-list'),
        meta: { title: '设备列表', icon: 'el-icon-tickets' }
      },
      {
        path: 'machine-update/:mid',
        name: 'machine-update',
        hidden: true,
        component: () => import('@/views/machine/machine-update'),
        meta: { title: '修改设备', icon: 'tree' }
      },
      {
        path: 'machine-add',
        name: 'machine-add',
        component: () => import('@/views/machine/machine-add'),
        meta: { title: '添加设备', icon: 'el-icon-circle-plus-outline' }
      },
    ]
  },

  {
    path: '/city',
    component: Layout,
    redirect: '/city/cityList',
    name: 'City',
    meta: { title: '地区管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: 'cityList',
        name: 'cityList',
        component: () => import('@/views/city/index'),
        meta: { title: '地区列表', icon: 'el-icon-school' }
      },
      {
        path: 'addCity',
        name: 'addCity',
        component: () => import('@/views/city/addCity'),
        meta: { title: '新增地区', icon: 'el-icon-circle-plus-outline' }
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
        path: 'worksiteList',
        name: 'worksiteList',
        component: () => import('@/views/worksite/worksite-list'),
        meta: { title: '工地列表', icon: 'table' }
      },
      {
        path: 'addWorksite',
        name: 'addWorksite',
        component: () => import('@/views/worksite/worksite-add'),
        meta: { title: '新增工地', icon: 'el-icon-circle-plus-outline' }
      },
      {
        path: 'modifyWorksite/:workId',
        name: 'modifyWorksite',
        component: () => import('@/views/worksite/worksite-modify'),
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
