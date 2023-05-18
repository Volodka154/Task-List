<template>
    <div class="form form-bordered-text display-flex">
        <div class="form-change">
            <table class="table-fixed">
                <thead>
                    <th class="th-main text-align-left">Добавление задания</th>
                    <th class="th-main text-align-right">
                        <img class="icon maxi-icon" 
                             src="CloseOutlined.svg"
                             @click="onClickExitBtn(false)"
                             title="Закрыть">
                    </th>
                </thead>
            </table>    
        </div>
        <!--Задание-->
        <div class="row">
            <label>Задание: </label>
            <img v-if="!title"
                 class="mini-icon required-input-field noHover"  
                 src="StarFilled.svg"
                 :class="redWarning">
            <textarea   class="form-input form-input__title"
                        type="text"
                        v-model="title">
            </textarea>
        </div>
        <!--Кнопки (добавить удалить)-->
        <div>
            <label>Список задач: </label>
            <img class="icon maxi-icon margin-left-5" 
                 src="PlusOutlined.svg"
                 @click="addOne"
                 title="Добавить задачу">
            <img class="icon maxi-icon margin-left-5" 
                 src="MinusOutlined.svg"
                 @click="delOne(selectedTaskIndex)"
                 title="Удалить задачу">
        </div>
        <!--Таблица-->
        <div class="form-scroll form-bordered-text">
            <table class="table-fixed">
                <thead>
                <tr>
                    <th class="th-main frst-coll">Название</th>
                    <th class="th-main">Содержание задачи</th>
                </tr>
                </thead>
            </table>
            <div class="scroll-table-body">
                <table class="table-fixed">
                    <tbody> 
                    <tr v-for="(task, index) in miniTaskList"
                        :key="index"
                        @click="editIndex(index)"
                        :class="getSubTaskClassName(selectedTaskIndex,index)"
                        >
                        <td class="frst-col td-main">
                            <textarea class="form-input form-input__stretched"
                                      type="text"
                                      v-model="task.title">
                            </textarea>
                        </td>
                        <td class="td-main">
                            <textarea class="form-input form-input__stretched"
                                      type="text"
                                      v-model="task.text">
                            </textarea>
                        </td> 
                    </tr>
                    </tbody>
                </table>            
            </div>
        </div>
        <!--Кнопки (отправить отменить)-->
        <div class="text-align-right">
            <button class="button-send"
                    @click="onClickSaveBtn"
                    >Сохранить
            </button>
            <button class="button-send"
                    @click="onClickExitBtn(false)"
                    >Отменить
            </button>
        </div>
        <!-- Состояние загрузки в базу -->
        <div v-if="isLoadTask"
             class="exit-back-color exit-save"
             >the saving process...
        </div>
    </div>
    <!--Выход-->
    <div class="exit-back-color"
         v-if="isExitConfirmModalShow">
        <div class="exit-comp">
            <div>
                <img class="icon mini-icon exit-but" 
                     src="CloseOutlined.svg"
                     @click="isExitConfirmModalShow = false"
                     title="Закрыть">
            </div>
            <p>Отменить все изменения?</p>
            <button class="button-send"
                    @click="onClickSaveBtn"
                    >Сохранить
            </button>
            <button class="button-send"
                    @click="onClickExitBtn(true)"
                    >Отменить
            </button>
        </div>
    </div>
</template>

<script>
import { useMutation } from '@vue/apollo-composable'
import { CREATE_MAIN_TASK, CREATE_MINI_TASK } from '../querys/mutations'

import { router } from '../routes'

export default {
    data(){
        const { mutate: createMain} = useMutation(CREATE_MAIN_TASK)
        const { mutate: createMini, loading: isLoadTask } = useMutation(CREATE_MINI_TASK)

        return{
            createMain,           // мутация для создания главной заметки
            createMini,           // мутация для создания мини заметки
            isLoadTask,

            selectedTaskIndex: null,
            warning: false,
            isExitConfirmModalShow: false,   // exit Window
            title: '',
            miniTaskList:[
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
            if(this.selectedTaskIndex !== null){
                this.miniTaskList.splice(this.selectedTaskIndex + 1, 0, { title: '', text: '', done: false})
            }
            else{
                this.miniTaskList.push({ title: '', text: '', done: false})
            }
        },
        delOne(index){
            if (index !== null){
                this.miniTaskList.splice(index,1)
                this.selectedTaskIndex = null
            }
        },
        async onClickSaveBtn(){
            // только если название введено
            if(this.title){
                // очищаю массив от пустого пространства
                this.miniTaskList = this.miniTaskList.filter(miniTaskItem => {
                    // если нет названия для подзадачи, берем и назначаем 10 символов из ее описания
                    if (!miniTaskItem.title && miniTaskItem.text){
                        miniTaskItem.title = miniTaskItem.text.substring(0, 10) + '...'
                    }
                    return (miniTaskItem.text || miniTaskItem.title)
                })
                // создаю главную задачу
                const newMainObject = (await this.createMain({
                    titleTaskInput: {title: this.title}
                })).data.createMainTask
                // добавляем к ней подзадачи
                await Promise.all(this.miniTaskList.map(
                    miniTaskItem => this.createMini({
                        id: newMainObject.id,
                        titleTaskInput: { title: miniTaskItem.title },
                        textTaskInput: { text: miniTaskItem.text }
                    })
                ))
                // возвращаемся в app
                router.push('/tasks')
            }
            else{
                this.isExitConfirmModalShow = false
                this.warning = true
            }
        },
        onClickExitBtn(isExit){
            this.isExitConfirmModalShow = true
            if(isExit){
                router.push('/tasks')
            }
        },
        editIndex(index){
            this.selectedTaskIndex = (this.selectedTaskIndex === index) ? null : index
        },
        getSubTaskClassName(index, ourindex){
            return{
                'select-this' : index !== null && ourindex === index
            }
        }
    },
    computed:{
        redWarning(){
            if(this.warning){
                return 'red-warning animated flash'
            }
            return ''
        }
    }
}
</script>