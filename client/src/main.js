import './style/2_new.css'

import { createApp, provide, h } from 'vue'
import App from './App.vue'

import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
const cache = new InMemoryCache()

const httpLink = createHttpLink({
    uri: 'http://localhost:5555/graphql',
})

const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
})

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

app.mount('#app');