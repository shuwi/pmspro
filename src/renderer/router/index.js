import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/page/LandingPage').default
    },
    {
      path: '/machine',
      name: 'machine-page',
      component: require('@/components/page/MachinePage').default
    },
    {
      path: '/worker',
      name: 'worker-page',
      component: require('@/components/page/WorkerPage').default
    },
    {
      path: '/group',
      name: 'group-page',
      component: require('@/components/page/GroupPage').default
    },
    {
      path: '/workkind',
      name: 'workkind-page',
      component: require('@/components/page/WorkKindPage').default
    },
    {
      path: '/log',
      name: 'log-page',
      component: require('@/components/page/LogPage').default
    }
  ]
})
