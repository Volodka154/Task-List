const {HTTP_LINK} = require('../../environment');

import './style/2_new.css'
import './style/animate.css'

import { createApp } from 'vue'
import App from './App.vue'

import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

import {router} from './routes.js'

const cache = new InMemoryCache()

const httpLink = createHttpLink({
  uri: HTTP_LINK,
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

const app = createApp(App)
app.provide(DefaultApolloClient, apolloClient)
app.use(router)
app.mount('#app');