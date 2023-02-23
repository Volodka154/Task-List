<template>
  <div  class="form form-bordered-text" 
        v-if="visible"
        >
    <p class="main">Список заданий</p>
    <!-- Кнопки -->
    <div>
      <i class="fa-solid fa-plus maxi-i"
        v-on:click="addTask"
        title="Добавить задание"></i> 

      <i class="fa-solid fa-pencil maxi-i"
          v-on:click="editTask"
          title="Изменить задание"></i> 
          
      <i class="fa-solid fa-minus maxi-i"
          v-on:click="delTask"
          title="Удалить задание"></i> 
    </div>

    <!-- Начинает таблица -->
    <div class="form-scroll form-bordered-text">
      <table>
        <thead>
          <tr>
            <th class="frst-coll">Задание</th>
            <th>Подзадача</th>
          </tr>
        </thead>
      </table>
      <div class="scroll-table-body ">
        <table>
          <tbody>
            <tr class="border-bottom" 
              v-for="(task, index) in All_Task"
              v-bind:key="task.id"
              v-on:click="editIndex(index)"
              v-bind:class="selectThis(indexForDelete,index)"
              v-on:dblclick="editTask">
                <td class="frst-col"><span>{{ task.title.substr(0, 17) }}</span>
                  <span v-if="task.title.length > 17">...</span>
                </td>
                <div  v-for="(mini_task,index2) in task.tasks" 
                      v-bind:key="mini_task._id">
                    <!-- не выводить больше 3х -->
                    <div v-if="index2 < 3">

                      <div v-if="mini_task.done">
                          <td class="frst-colm">
                            <i class="fa-solid fa-check main-mini-i"></i>
                          </td>
                          <td><s>{{ mini_task.title.substr(0, 25) }}</s>
                            <span v-if="mini_task.title.length > 25">...</span>
                          </td>
                          
                      </div>
                      <div v-else>
                          <td class="frst-colm">
                            <div class="main-mini-i ii"></div>    
                          </td>
                          <td><span>{{ mini_task.title.substr(0, 25) }}</span>
                            <span v-if="mini_task.title.length > 25">...</span>
                          </td>
                      </div>

                    </div>   
                </div>
                <div v-if="task.tasks.length > 3">
                      <span>...</span>
                </div>                 
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <add-task   v-if="option === 1"
              v-on:click-save="saveTask($event)">
  </add-task>

  <edit-task  v-if="option === 2"       
              :ID="All_Task[indexForDelete].id"
              :titles="All_Task[indexForDelete].title"
              :taskss="All_Task[indexForDelete].tasks"
              v-on:click-save="saveTask($event)">
  </edit-task>

  <del-task   v-if="option === 3"
              :ID="All_Task[indexForDelete].id"
              :titles="All_Task[indexForDelete].title"
              v-on:click-save="saveTask($event)">
  </del-task>

</template>

<script>
import addTask from './components/addTask.vue'
import editTask from './components/editTask.vue'
import delTask from './components/delTask.vue'
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'

// достать все заметки
const GET_TASK_AMOUNT = gql`
  query {
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

export default {
  components:{
    'add-task': addTask,
    'edit-task': editTask,
    'del-task': delTask
  },  
  data(){
    // вызываем все заметки  
    const { result, loading, error, refetch } = useQuery(GET_TASK_AMOUNT);
    const datat = computed(() => result.value?.getTask??[])

    return {
      refetch,

      indexForDelete: null,
      visible: true,
      option: 0,    // 1 - добавить, 2 - редактировать, 3 - удалить
      All_Task: datat,
      datat,
      loading: loading,
      error: error,
    }
  },
  methods:{
    // добавить заметку
    addTask(){
      this.option = 1;
      this.visible = false
    },
    // редактировать заметку
    editTask(){
      if(this.indexForDelete !== null){
        this.option = 2;
        this.visible = false;
      }
    },
    // удалить заметку
    delTask(){
      if(this.indexForDelete !== null){
        this.option = 3;
      }
    },
    // после сохранения
    saveTask(){
      this.refetch()

      this.indexForDelete = null;
      this.option = 0;
      this.visible = true
    },
    // выбранная заметка для :class
    selectThis(index, ourindex){
      if(index !== null && ourindex === index){
          return 'delete-this';
      }
      return ''
    },
    // редактируем индекс выбираемой заметки при нажатии 
    editIndex(index){
      // отменить выделение
      if(this.indexForDelete === index){
        this.indexForDelete = null
      }
      // выделить
      else {
        this.indexForDelete = index
      }
    },
  }
}
</script>


<style>
/* Название */
.main{
    text-align: center;
    font-size: 30px;
}


/* Обязательное поле ввода */
.required-input-field{
    position: absolute;
    z-index: 0;
    opacity: 0.2;
    border-style: solid;
    border-width: 0px;
    font-size: small;
    background-color: #ffffff00;
    color: #e37373;
    text-align: center;
    margin-top: 14px;
    margin-left: 10px;
}
.red-warning{
    opacity: 1;
    transition: 2s;
}


/* Изменение цвета строки при выборе */
.delete-this{
    background-color: #83cf6a32;
}

table{
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
}

th{
    letter-spacing: 2px;
    text-align: center;
    background-color: #16c0af3c; 
    padding: 5px;
}

.border-bottom{
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #83cf6a71;
}

td{
    letter-spacing: 1px;
    padding: 5px;
    vertical-align: middle;

    overflow-x: auto;
    max-width: 100%;

}

tbody tr:hover { 
    background-color: #16c0af15; 
}
tbody tr:active { 
    background-color: #83cf6a32; 
}

:root {
  --form-width-transform-time: 1s;
}

/*@media (min-width: 500px){
  .form{
    max-width: 450px;
    transition: var(--form-width-transform-time);
  }

}*/
@media (min-width: 650px){
  .form{
    max-width: 600px;
    transition: var(--form-width-transform-time);
  }
}
@media (min-width: 800px){
  .form{
    max-width: 750px;
    transition: var(--form-width-transform-time);
  }
}
@media (min-width: 950px){
  .form{
    max-width: 900px;
    transition: var(--form-width-transform-time);
  }
}
@media (min-width: 1200px){
  .form{
    max-width: 1100px;
    transition: var(--form-width-transform-time);
  }
}



@media (min-height: 0px){
  .form{
    height: 450px;
    transition: var(--form-width-transform-time);
  }
  .scroll-table-body {
    height: 82%;
    transition: var(--form-width-transform-time);
  }
  .form-scroll{
    margin: 15px 5px;
    max-height: 42%;
    transition: var(--form-width-transform-time);
  } 
}
@media (min-height: 500px){
  .form{
    height: 450px;
    transition: var(--form-width-transform-time);
  }
  .scroll-table-body {
    height: 82%;
    transition: var(--form-width-transform-time);
  }
  .form-scroll{
    margin: 15px 5px;
    max-height: 42%;
    transition: var(--form-width-transform-time);
  } 
}
@media (min-height: 850px){
  .form{
    margin-top: 50px;
    height: 800px;
    transition: var(--form-width-transform-time);
  }
  .scroll-table-body {
    height: 93.5%;
    transition: var(--form-width-transform-time);
  }
  .form-scroll{
    margin: 15px 5px;
    max-height: 68%;
    transition: var(--form-width-transform-time);

  } 
}

</style>