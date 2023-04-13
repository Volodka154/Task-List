import gql from 'graphql-tag'

// мутация на создание главной заметки
export const CREATE_MAIN_TASK = gql`
    mutation createMainTask($titleTaskInput: TitleTaskInput) {
        createMainTask(titleTaskInput: $titleTaskInput) {
            id
            title
            tasks {
                _id
                title
                text
                createAt
            }
        }   
    } 
`

// мутация на создание мини заметки
export const CREATE_MINI_TASK = gql`
    mutation CreateMiniTask($id: ID!, $titleTaskInput: TitleTaskInput, $textTaskInput: TextTaskInput) {
        createMiniTask(ID: $id, titleTaskInput: $titleTaskInput, textTaskInput: $textTaskInput) {
            title
            tasks {
                title
                text
                createAt
            }
        }
    }
`

// мутация на изменение заметки
export const EDIT_TASK = gql`
    mutation EditTask($mainId: ID!, $titleTaskInput: TitleTaskInput, $mass: [TitleText]) {
        editTask(mainID: $mainId, titleTaskInput: $titleTaskInput, mass: $mass)
    }
`

// удалить главную заметку
export const DELETE_MAIN = gql`
  mutation DeleteTask($mainId: ID!) {
    deleteTask(mainID: $mainId)
  }
`
