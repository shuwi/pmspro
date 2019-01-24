import Vue from 'vue'
import store from './store'
import router from './router'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import App from './App'
import Vuebar from 'vuebar'
import VueShortkey from 'vue-shortkey'
import AppDAO from './store/db'
import MysqlAppDAO from './store/mysqldb'
import WorkersRepository from './repositories/workersRepository'
import MachinesRepository from './repositories/machinesRepository'
import CardsRepository from './repositories/cardsRepository'

import LogsRepository from './repositories/logsRepository'
import WorkKindRepository from './repositories/workkindRepository'
import ClassNoRepository from './repositories/classnoRepository'
import WorkersMysqlRepository from './repositories/workersMysqlRepository'
import CommandRepository from './repositories/commandRepository'

require('autolink-js')
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.http = Vue.prototype.$http = axios

const EventBus = new Vue()
const dao = new AppDAO('PMS.db')
const workersRepo = new WorkersRepository(dao)
const cardsRepo = new CardsRepository(dao)

const mysqldao = new MysqlAppDAO()
const logsRepo = new LogsRepository(mysqldao)
const machinesRepo = new MachinesRepository(mysqldao)
const workkindRepo = new WorkKindRepository(mysqldao)
const classNoRepo = new ClassNoRepository(mysqldao)
const workersMysqlRepo = new WorkersMysqlRepository(mysqldao)
const commandRepo = new CommandRepository(mysqldao)

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  },
  $workersRepo: {
    get: function () {
      return workersRepo
    }
  },
  $machinesRepo: {
    get: function () {
      return machinesRepo
    }
  },
  $cardsRepo: {
    get: function () {
      return cardsRepo
    }
  },
  $logsRepo: {
    get: function () {
      return logsRepo
    }
  },
  $workkindRepo: {
    get: function () {
      return workkindRepo
    }
  },
  $classNoRepo: {
    get: function () {
      return classNoRepo
    }
  },
  $workersMysqlRepo: {
    get: function () {
      return workersMysqlRepo
    }
  },
  $commandRepo: {
    get: function () {
      return commandRepo
    }
  }
})

Vue.use(iView)
Vue.use(Vuebar)
Vue.use(VueShortkey)

Vue.directive('focus', {
  componentUpdated: function (el) {
    el.getElementsByTagName('input')[0].focus()
  }
})

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  template: '<App/>',
  store,
  router
}).$mount('#app')
