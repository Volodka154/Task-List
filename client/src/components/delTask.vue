<template>
  <!--Удаление-->
  <div class="exit-back-color">
    <div class="exit-comp">
        <div><i class="fa-solid fa-xmark exit-but mini-i" v-on:click="delTask(false)"></i></div>
        <p>Удалить задание с названием "{{ title }}"?</p>
        <button class="button-send"
                v-on:click="delTask(true)">Удалить</button>
        <button class="button-send"
                v-on:click="delTask(false)">Отменить</button>
    </div>
  </div>
</template>

<script>
import { useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag';

// удалить главную заметку
const DELETE_MAIN = gql`
  mutation DeleteTask($mainId: ID!) {
    deleteTask(mainID: $mainId)
  }
`
export default {
    props: ['ID', 'titles'],
    data(){
        // удаление заметки
        const { mutate: deleteMain } = useMutation(DELETE_MAIN)
        return {
            deleteMain,

            id: this.ID,
            title: this.titles
        }
    },
    methods: {
        async delTask(ifDeleted){
          if (ifDeleted){
            await this.deleteMain({
              mainId: this.id,
            })
          }
          this.$emit('click-save', false)
        },

    }

}
</script>