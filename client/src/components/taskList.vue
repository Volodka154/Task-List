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
            @click="editTask(allTaskList)"
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
    <!-- Модальное окно удаления -->
    <delete-task  v-if="isModalDeleteWindow"
                  :propsId="allTaskList[selectedTaskIndex].id"
                  :propsTitle="allTaskList[selectedTaskIndex].title"
                  @closed-window="confirmDetTask">
    </delete-task>
  </div>
</template>

<script>
import showTask from './showTask.vue'
import delTask from './delTask.vue'

import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'

import { GET_TASK_AMOUNT } from '../querys/querys'

import { router } from '../routes.js' 

export default {
  components:{
    'show-task': showTask,
    'delete-task': delTask
  },  
  setup(){
    const { result, error, loading, refetch } = useQuery(GET_TASK_AMOUNT);
    const valueFromQuery = computed(() => result.value?.getTask??[])

    onMounted(() => {
      refetch()
    })
    const addTask = () => {
      router.push({ name: 'add-new-task' })
    }
    const editTask = (allTask) => {
      if(selectedTaskIndex.value !== null){
        router.push({ 
          name: 'edit-task', 
          params: { 
            id: allTask[selectedTaskIndex.value].id,
          },
          query: {
            title: allTask[selectedTaskIndex.value].title,
            tasks: JSON.stringify(allTask[selectedTaskIndex.value].tasks),
          }      
        })
      }
    }
    const delTask = () => {
      if(selectedTaskIndex.value !== null){
        isModalDeleteWindow.value = true
      }
    }
    const confirmDetTask = () => {
      isModalDeleteWindow.value = false
      refetch()
    }
    const acceptIndexFromComponent = (index) => {
      selectedTaskIndex.value = index
    }

    const selectedTaskIndex = ref(null)
    const isModalDeleteWindow = ref(false)
    const isVisibleForm = ref(true)
    const option = ref(0)    // 1 - добавить, 2 - редактировать, 3 - удалить
    return {
      selectedTaskIndex,
      isVisibleForm,
      isModalDeleteWindow,
      option,
      allTaskList: valueFromQuery,
      result,
      error,
      loading,
      refetch,

      addTask,
      editTask,
      delTask,
      confirmDetTask,
      acceptIndexFromComponent
    }
  },
}
</script>