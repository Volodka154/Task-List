const Task = require('../models/Task');
const miniTask = require('../models/miniTask');

module.exports = {
    Query: {
        async task(_,{ID}) {
            return await Task.findById(ID)
        },
        async getTask(_, {amount}) {
            return await Task.find().limit(amount)
        }
    },


    Mutation: {
        // Создание главной заметки, а точнее только ее название. Возвращаем полностью элемент.
        // createMainTask(titleTaskInput: TitleTaskInput): MainTask!
        async createMainTask(_, {titleTaskInput: {title}}) {
            // создаем задачу
            const createdTask = new Task({
                title: title,
                done: false,
            })
            // сохранение в mongodb
            const res = await createdTask.save()
            return {
                id: res.id,
                ...res._doc // возьмите и покажите 
            }
        },

        // Создание мини заметки по id в главной заметке. Возвращаем 
        // createMiniTask(titleTaskInput: TitleTaskInput, textTaskInput: TextTaskInput): MainTask!
        async createMiniTask(_, {ID, titleTaskInput: {title}, textTaskInput: {text}}) {
            // обращаемся по id основной задачи и создаем подзадачу
            const createdMiniTask = new miniTask({
                title: title,
                text: text,
                done: false,
                createAt: new Date().toISOString()
            });
            // поиск по id
            const taskParent = await Task.findById(ID)
            // добавление в массив
            taskParent.tasks.push(createdMiniTask)
            // сохранение в mongodb
            const res = await taskParent.save()
            return {
                id: res.id,
                ...res._doc // возьмите и покажите 
            }       
        },

        // Удаление мини заметки по id главной заметки и id мини заметки. Возвращаем главную заметку
        async deleteTask(_,{mainID}) {
            // удаление большой заметки
            console.log('зашли в удаление')
            if (mainID){
                await Task.deleteOne({ _id: mainID })   
                return true
            }
            return false
        },

        // Редактирование всей заметки
        async editTask(_, {mainID, titleTaskInput: {title: title}, mass}){
            // редактирование названия большой заметки
            await Task.updateOne({ _id: mainID }, { title: title})
            // редактирование мини заметок (удаляем и перезаписываем все)
            // находим главную заметку
            const taskParent = await Task.findById(mainID)
            // очищаем массив мини заметок
            taskParent.tasks.splice(0, taskParent.tasks.length);

            for (let i = 0; i < mass.length; i++){
                // обращаемся по id основной задачи и создаем подзадачу
                const createdMiniTask = new miniTask({
                    title: mass[i].title,
                    text: mass[i].text,
                    done: mass[i].done,
                    createAt: new Date().toISOString()
                });
                taskParent.tasks.splice(i,0,createdMiniTask);

            }
            await taskParent.save()
            return true            
        },
    }
};