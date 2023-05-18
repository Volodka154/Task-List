import { createRouter, createWebHashHistory } from 'vue-router'

import appE404 from './components/appE404'
import taskList from './components/taskList'
import addTask from './components/addTask'
import editTask from './components/editTask'

const routes = [
    { path: '', 
      redirect: {name: 'tasks'}
    },
    { path: '/tasks', 
      name: 'tasks', 
      component: taskList,
    },
    { path: '/tasks/add-new-task', 
      name: 'add-new-task', 
      component: addTask
    },
    { path: '/tasks/edit-task/:id', 
      name: 'edit-task',
      props: (route) => ({ 
        propsId: route.params.id, 
        propsTitle: route.query.title, 
        propsTasks: JSON.parse(route.query.tasks) 
      }),
      component: editTask
    },
    { path: '/:catchAll(.*)', 
      component: appE404 
    }
]

export const router = createRouter({
    routes: routes,
    history: createWebHashHistory()
})