<template>
<div class="form display-flex" style="padding: 0px; margin-top: 10px;">
    <!-- Таблица -->
    <div class="form-scroll form-bordered-text">
        <table class="table-fixed">
            <thead>
            <tr>
                <th class="frst-coll th-main">Задание</th>
                <th class="th-main">Подзадача</th>
            </tr>
            </thead>
        </table>
        <div class="scroll-table-body">
            <table class="table-fixed">
                <tbody>
                <tr class="border-bottom" 
                    v-for="(task, mainTaskIndex) in taskList"
                    :key="task.id"
                    @click="editIndex(mainTaskIndex)"
                    :class="getSubTaskClassName(selectedTaskIndex,mainTaskIndex)"
                    @dblclick="editTask">
                    <td class="frst-col td-main">
                        <span>{{ task.title.substring(0, 17) }}</span>
                        <span v-if="task.title.length > 17">...</span>
                    </td>
                    <div v-for="(miniTaskItem, miniTaskIndex) in task.tasks" 
                        :key="miniTaskItem._id">
                        <!-- не выводить больше 3х -->
                        <div v-if="miniTaskIndex < 3">
                            <td class="frst-colm td-main">
                                <img class="icon mini-icon noHover" :src="miniTaskItem.done ? 'CheckOutlined.svg' : ' ' ">
                            </td>
                            <td class="td-main">
                                <span :class="miniTaskItem.done ? 'strikethrought-text' : ' '">{{ miniTaskItem.title.substring(0, 25) }}</span>
                                <span v-if="miniTaskItem.title.length > 25">...</span>
                            </td>
                        </div> 
                    </div>
                    <span v-if="task.tasks.length > 3"
                        >...
                    </span>              
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
export default{
    props: ['taskForShow'],
    data(){
        return{
            taskList: this.taskForShow,
            selectedTaskIndex: null,
        }
    },
    methods:{
        // выбранная заметка для :class
        getSubTaskClassName(index, ourindex){
            return{
                'select-this' : index !== null && ourindex === index
            }
        },
        // редактируем индекс выбираемой заметки при нажатии 
        editIndex(index){
            this.selectedTaskIndex = this.selectedTaskIndex === index ? null : index
            this.$emit('click-edit-index', this.selectedTaskIndex)
        },
    }
}
</script>