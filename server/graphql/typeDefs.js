const { gql } = require('apollo-server');

module.exports = gql`
    type MiniTask {
        _id: String
        title: String       # Название задачи
        text: String        # Содержимое задачи
        done: Boolean
        createAt: String    # Время создания 
    }
    type MainTask {
        id: String
        title: String       # Название задачи
        done: Boolean
        tasks: [MiniTask]   # в ней мини задача
    }


    # ввод названия задачи
    input TitleTaskInput {
        title: String      # Название задачи
    }
    # ввод описания задачи
    input TextTaskInput {
        text: String        # Содержимое задачи
    }
    # ввод и описания и задачи
    input TitleText {
        title: String      # Название задачи
        text: String       # Содержимое задачи
        done: Boolean
    }

    # Список запросов
    type Query {
        task(ID: ID!): MainTask!            # достать задачу по id
        getTask(amount: Int): [MainTask]    # достать опр кол-во задач  
    }

    # типа вызываемые функции 
    type Mutation {
        createMainTask(titleTaskInput: TitleTaskInput): MainTask!
        createMiniTask(ID: ID!, titleTaskInput: TitleTaskInput, textTaskInput: TextTaskInput): MainTask!
        deleteTask(mainID: ID!): Boolean
        editTask(mainID: ID!, titleTaskInput: TitleTaskInput, mass: [TitleText]): Boolean
        editDoneTask(mainID: ID!, miniID: ID!): Boolean
    }
`