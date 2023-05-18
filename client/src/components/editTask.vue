<template>
    <div class="form form-bordered-text display-flex">
        <div class="form-change">
            <table class="table-fixed">
                <thead>
                    <th class="th-main text-align-left">Изменение задания</th>
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
            <textarea class="form-input form-input__title"
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
                    <th class="th-main frst-colm"></th>
                    <th class="th-main scnd-colm">Название</th>
                    <th class="th-main">Содержание задачи</th>
                </tr>
                </thead>
            </table>
            <div class="scroll-table-body">
                <table class="table-fixed">
                    <tbody> 
                    <tr v-for="(task, index) in copyOfMiniTaskList"
                        :key="index"
                        @click="editIndex(index)"
                        :class="getSubTaskClassName(selectedTaskIndex,index)"
                        >
                        <td class="frst-colm td-main">
                            <img v-if="task.done" 
                                 class="icon mini-icon"
                                 src="CheckOutlined.svg"
                                 @click="task.done = !task.done">
                            <img v-else 
                                 class="icon mini-icon"
                                 @click="task.done = !task.done">
                        </td>
                        <td class="scnd-colm td-main">
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
        <!-- Состояние загрузки в базу -->
        <div v-if="isLoadTask"
             class="exit-back-color exit-save"
             >the saving process...
        </div>
        <!--Кнопки (отправить отменить)-->
        <div class="text-align-right">
            <button class="button-send"
                    v-on:click="onClickSaveBtn"
                    >Сохранить
            </button>
            <button class="button-send"
                    v-on:click="onClickExitBtn(false)"
                    >Отменить
            </button>
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
import { EDIT_TASK } from '../querys/mutations'
import { router } from '../routes'

export default {
    props: ['propsId', 'propsTitle', 'propsTasks'],
    data(){
        const { mutate: editMain, loading: isLoadTask } = useMutation(EDIT_TASK)

        return{
            editMain,
            isLoadTask,

            selectedTaskIndex: null,
            warning: false,
            isExitConfirmModalShow: false,   // exit Window
            id: this.propsId,
            title: this.propsTitle,
            copyOfMiniTaskList: this.propsTasks,
        }
    },
    methods:{
        addOne(){
            if(this.selectedTaskIndex !== null){
                this.copyOfMiniTaskList.splice(this.selectedTaskIndex + 1, 0, { title: '', text: '', done: false})
            }
            else{
                this.copyOfMiniTaskList.push({ title: '', text: '', done: false })
            }
        },
        delOne(index){
            if (index !== null){
                this.copyOfMiniTaskList.splice(index,1)
                this.selectedTaskIndex = null
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
        async onClickSaveBtn(){
            // только если название введено
            if(this.title){
                // очищаю массив от пустого пространства
                this.copyOfMiniTaskList = this.copyOfMiniTaskList.filter(miniTaskItem => {
                    // если нет названия для подзадачи, берем и назначаем 10 символов из ее описания
                    if (!miniTaskItem.title && miniTaskItem.text){
                        miniTaskItem.title = miniTaskItem.text.substring(0, 10) + '...'
                    }
                    return (miniTaskItem.text || miniTaskItem.title)
                })
                // введем массив необходимых элементов, чтоб передать его
                const massiv = []
                for(let i = 0; i < this.copyOfMiniTaskList.length; i++){
                    massiv.push({
                        title: this.copyOfMiniTaskList[i].title,
                        text: this.copyOfMiniTaskList[i].text,
                        done: this.copyOfMiniTaskList[i].done
                    })
                }
                await this.editMain({
                    mainId: this.id,
                    titleTaskInput: {
                        title: this.title
                    },
                    mass: massiv      
                })
                // возвращаемся в app
                router.push('/tasks')
            }
            else{
                this.isExitConfirmModalShow = false
                this.warning = true
            }
        },
        getSubTaskClassName(index, ourindex){
            return{
                'select-this' : index !== null && ourindex === index
            }
        },
    },
    computed:{
        redWarning(){
            if(this.warning) {
                return 'red-warning animated flash'
            }
            return ''
        },
    }
}
</script>

<style scoped>
.frst-colm{
    width: 32px;
}
.scnd-colm{
    width: 30%;
}
</style>