<template>
    <div    class="form form-bordered-text">
        <div class="form-change">
            <table>
                <thead>
                    <th class="th-l">Изменение задания</th>
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
                    <th class="frst-colm"></th>
                    <th class="scnd-colm">Название</th>
                    <th>Содержание задачи</th>
                </tr>
                </thead>

            </table>
            <div class="scroll-table-body">
                <table>
                    <tbody> 
                    <tr v-for="(task, index) in tasks"
                        v-bind:key="index"
                        v-on:click="editIndex(index)"
                        v-bind:class="deleteThis(indexForDelete,index)"
                        >
                        <td class="frst-colm">
                            <i class="fa-solid fa-check mini-i"
                                v-if="task.done"
                                v-on:click="task.done = !task.done"></i>
                            <div class="ii mini-i"
                                v-else
                                v-on:click="task.done = !task.done">
                            </div>
                        </td>
                        <td class="scnd-colm">
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



        <!-- Состояние загрузки в базу -->
        <div    v-if="loadTask"
                class="exit-back-color exit-save">
                the saving process...
        </div>

        <!--Кнопки (отправить отменить)-->
        <div class="th-r">
            <button class="button-send"
                    v-on:click="save">Сохранить</button>
            <button class="button-send"
                    v-on:click="exit">Отменить</button>
        </div>

    </div>
    <!--Выход-->
    <div    class="exit-back-color"
            v-if="AttemptToExit">
        <div class="exit-comp">
                <div><i class="fa-solid fa-xmark exit-but mini-i" 
                    v-on:click="AttemptToExit = false"
                    title="Закрыть"></i></div>
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


const EDIT_TASK = gql`
    mutation EditTask($mainId: ID!, $titleTaskInput: TitleTaskInput, $mass: [TitleText]) {
        editTask(mainID: $mainId, titleTaskInput: $titleTaskInput, mass: $mass)
    }

`
export default {
    props: ['ID', 'titles', 'taskss'],
    data(){
        const { mutate: editMain, loading: loadTask } = useMutation(EDIT_TASK)

        return{
            editMain,
            loadTask,

            indexForDelete: null,
            warning: false,
            AttemptToExit: false,   // exit Window
            id: this.ID,
            title: this.titles,
            tasks: JSON.parse(JSON.stringify(this.taskss))
        }
    },
    methods:{
        addOne(){
            if(this.indexForDelete !== null){
                this.tasks.splice(this.indexForDelete + 1, 0, { title: '', text: '', done: false})
            }
            else{
                this.tasks.push({ title: '', text: '', done: false })
            }
        },
        delOne(index){
            if (index !== null){
                this.tasks.splice(index,1)
                this.indexForDelete = null
            }
        },
        deleteThis(index, ourindex){
            if(index !== null && ourindex === index){
                return 'delete-this'
            }
        },
        exit(if_save){
            this.AttemptToExit = true
            if(if_save === true){
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
        async save(){
            // только если название введено
            if(this.title){
                // очищаю массив от пустого пространства
                for(let i = 0; i < this.tasks.length; i++){
                    if(this.tasks[i].title === '' && this.tasks[i].text === ''){
                        this.tasks.splice(i, 1)
                        i--
                    }
                }
                // введем массив необходимых элементов, чтоб передать его
                const massiv = []
                for(let i = 0; i < this.tasks.length; i++){
                    massiv.push({
                        title: this.tasks[i].title,
                        text: this.tasks[i].text,
                        done: this.tasks[i].done
                    })
                }
                await this.editMain({
                    mainId: this.id,
                    titleTaskInput: {
                        title: this.title
                    },
                    mass: massiv
                                  
                })
                this.$emit('click-save')
            }
            else{
                this.AttemptToExit = false
                this.warning = true
            }
        },


    },
    computed:{
        redWarning(){
            if(this.warning) {
                return 'red-warning'
            }
            return ''
        },

    }
}
</script>

<style>
.th-l{
    text-align: left;
    padding-left: 5px;
}

.th-r{
    text-align: right;
    padding: 0px;
}
.frst-colm{
    width: 32px;
}
.scnd-colm{
    width: 30%;
}
</style>