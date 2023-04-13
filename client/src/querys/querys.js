import { gql } from 'graphql-tag'

// достать все заметки
export const GET_TASK_AMOUNT = gql`
  query getTask{
    getTask {
      id
      title
      tasks {
        _id
        title
        text
        done
      }
    }
  }
`
