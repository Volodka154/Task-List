<template>
  <div class="form form-bordered-text display-flex" 
       v-if="isVisibleForm">
    <p class="main">Список заданий</p>
    <!-- Кнопки -->
    <div>
      <img class="icon maxi-icon margin-left-5" 
           src="PlusOutlined.svg"
           @click="addTask"
           title="Добавить задание">

      <img class="icon maxi-icon margin-left-5" 
           src="EditOutlined.svg"
           @click="editTask"
           title="Изменить задание">

      <img class="icon maxi-icon margin-left-5" 
           src="MinusOutlined.svg"
           @click="delTask"
           title="Удалить задание">
    </div>

    <!-- Показ задач -->
    <show-task v-if="!loading && !error"
               :taskForShow="allTaskList"
               @click-edit-index="acceptIndexFromComponent($event)">
    </show-task>
    <p v-else-if="error">error...</p>
    <p v-else>loading...</p>
  </div>

  <add-task v-if="option === 1"
            @click-save="saveTask($event)">
  </add-task>

  <edit-task v-if="option === 2"       
             :ID="allTaskList[selectedTaskIndex].id"
             :titles="allTaskList[selectedTaskIndex].title"
             :taskss="allTaskList[selectedTaskIndex].tasks"
             @click-save="saveTask($event)">
  </edit-task>

  <del-task v-if="option === 3"
            :ID="allTaskList[selectedTaskIndex].id"
            :titles="allTaskList[selectedTaskIndex].title"
            @click-save="saveTask($event)">
  </del-task>

</template>

<script>
import addTask from './components/addTask.vue'
import editTask from './components/editTask.vue'
import delTask from './components/delTask.vue'
import showTask from './components/showTask.vue'

import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'
import { ref } from 'vue'

import { GET_TASK_AMOUNT } from './querys/querys'


export default {
  components:{
    'add-task': addTask,
    'edit-task': editTask,
    'del-task': delTask,
    'show-task': showTask
  },  
  setup(){
    const { result, error, loading, refetch } = useQuery(GET_TASK_AMOUNT);
    const valueFromQuery = computed(() => result.value?.getTask??[])

    const addTask = () => {
      option.value = 1;
      isVisibleForm.value = false
    }
    const editTask = () => {
      if(selectedTaskIndex.value !== null){
        option.value = 2;
        isVisibleForm.value = false;
      }
    }
    const delTask = () => {
      if(selectedTaskIndex.value !== null){
        option.value = 3;
      }
    }
    const saveTask = () => {
      refetch()

      selectedTaskIndex.value = null;
      option.value = 0;
      isVisibleForm.value = true
    }
    const acceptIndexFromComponent = (index) => {
      selectedTaskIndex.value = index
    }

    const selectedTaskIndex = ref(null)
    const isVisibleForm = ref(true)
    const option = ref(0)    // 1 - добавить, 2 - редактировать, 3 - удалить
    return {
      selectedTaskIndex,
      isVisibleForm,
      option,
      allTaskList: valueFromQuery,
      result,
      error,
      loading,
      refetch,

      addTask,
      editTask,
      delTask,
      saveTask,
      acceptIndexFromComponent
    }
  },
}
</script>