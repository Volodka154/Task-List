<template>
    <div    class="form form-bordered-text">
        <div class="form-change">
            <table>
                <thead>
                    <th class="th-l">Добавление задания</th>
                    <th class="th-r"><i class="fa-solid fa-xmark maxi-i" 
                        v-on:click="exit"
                        title="Закрыть"></i></th>
                </thead>
            </table>    
        </div>

        <!--Задание-->
        <div class="row">
            <label>Задание: </label>
            <i  v-if="!title"
                class="fa-solid fa-star required-input-field"
                :class="redWarning"></i>
            <textarea   class="form-input form-input1"
                        type="text"
                        v-model="title">
            </textarea>
        </div>

        <!--Кнопки (добавить удалить)-->
        <div>
            <label>Список задач: </label>
            <i  class="fa-solid fa-plus maxi-i"
                v-on:click="addOne"
                title="Добавить задачу"></i>
            <i  class="fa-solid fa-minus maxi-i"
                v-on:click="delOne(indexForDelete)"
                title="Удалить задачу"></i>
        </div>

        <!--Таблица-->
        <div class="form-scroll form-bordered-text">
            <table>
                <thead>
                <tr>
                    <th class="frst-coll">Название</th>
                    <th>Содержание задачи</th>
                </tr>
                </thead>

            </table>
            <div class="scroll-table-body">
                <table>
                    <tbody> 
                    <tr v-for="(task, index) in miniTask"
                        v-bind:key="index"
                        v-on:click="editIndex(index)"
                        v-bind:class="deleteThis(indexForDelete,index)"
                        >
                        <td class="frst-col">
                            <textarea   class="form-input form-input2"
                                        type="text"
                                        v-model="task.title"
                                        ></textarea>
                        </td>
                        <td>
                            <textarea   class="form-input form-input2"
                                        type="text"
                                        v-model="task.text"
                                        ></textarea>
                        </td> 
                    </tr>
                    </tbody>
                </table>            
            </div>
        </div>

        <!--Кнопки (отправить отменить)-->
        <div class="th-r">
            <button class="button-send"
                    v-on:click="save">Сохранить</button>
            <button class="button-send"
                    v-on:click="exit">Отменить</button>
        </div>

        <!-- Состояние загрузки в базу -->
        <div    v-if="loadTask"
                class="exit-back-color exit-save">
                the saving process...
        </div>

    </div>
    <!--Выход-->
<div    class="exit-back-color"
        v-if="AttemptToExit">
    <div class="exit-comp">
            <div><i class="fa-solid fa-xmark exit-but mini-i" v-on:click="AttemptToExit = false"></i></div>
            <p>Отменить все изменения?</p>
            <button class="button-send"
                    v-on:click="save">Сохранить</button>
            <button class="button-send"
                    v-on:click="exit(true)">Отменить</button>
    </div>

</div>
</template>

<script>
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// мутация на создание главной заметки
const CREATE_MAIN_TASK = gql`
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
const CREATE_MINI_TASK = gql`
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

export default {
    data(){
        const { mutate: createMain} = useMutation(CREATE_MAIN_TASK)
        const { mutate: createMini, loading: loadTask } = useMutation(CREATE_MINI_TASK)

        return{
            createMain,           // мутация для создания главной заметки
            createMini,           // мутация для создания мини заметки
            loadTask,

            indexForDelete: null,
            warning: false,
            AttemptToExit: false,   // exit Window
            title: '',
            miniTask:[
                {
                title: "",
                text: "",
                done: false,
                },
            ]

        }
    },
    methods:{
        addOne(){
            if(this.indexForDelete !== null){
                this.miniTask.splice(this.indexForDelete + 1, 0, { title: '', text: '', done: false})
            }
            else{
                this.miniTask.push({ title: '', text: '', done: false})
            }
        },
        delOne(index){
            if (index !== null){
                this.miniTask.splice(index,1)
                this.indexForDelete = null
            }
        },
        deleteThis(index, ourindex){
            if(index !== null && ourindex === index){
                return 'delete-this'
            }
        },
        async save(){
            // только если название введено
            if(this.title){
                // очищаю массив от пустого пространства
                for(let i = 0; i < this.miniTask.length; i++){
                    if(this.miniTask[i].title === '' && this.miniTask[i].text === ''){
                        this.miniTask.splice(i, 1)
                        i--
                    }
                }
                // создаю главную задачу
                const newMainObject = await this.createMain({
                    titleTaskInput: {title: this.title}
                }).then(response => {
                    return response.data.createMainTask;
                })
                // добавляем к ней подзадачи
                for(let i = 0; i < this.miniTask.length; i++){
                    await this.createMini({
                        id: newMainObject.id,
                        titleTaskInput: { title: this.miniTask[i].title},
                        textTaskInput: { text: this.miniTask[i].text}
                    })
                }                
                // возвращаемся в app
                this.$emit('click-save')
            }
            else{
                this.AttemptToExit = false
                this.warning = true
            }
        },
        exit(data){
            this.AttemptToExit = true
            if(data === true){
                this.$emit('click-save', false)
            }
        },
        editIndex(index){
            if(this.indexForDelete === index){
                this.indexForDelete = null
            }
            else {
                this.indexForDelete = index
            }
        },

    },
    computed:{
        redWarning(){
            if(this.warning){
                return 'red-warning'
            }
            return ''
        },
    }
}
</script>

<style>
.red-warning{
    opacity: 1;
    transition: 2s;
}

.th-l{
    text-align: left;
    padding-left: 5px;
}

.th-r{
    text-align: right;
    padding: 0px;
}

button{
    margin: 5px;
}

</style>