<template>
  <!--Удаление-->
  <div class="exit-back-color">
    <div class="exit-comp">
        <div>
          <img class="icon mini-icon exit-but" 
                     src="CloseOutlined.svg"
                     @click="onClickCancelDeleteBtn"
                     title="Закрыть">
        </div>
        <p>Удалить задание с названием "{{ title.length > 15 ? title.substring(0, 15) + '...' : title }}"?</p>
        <button class="button-send"
                v-on:click="onClickConfirmDeleteBtn"
                >Удалить
        </button>
        <button class="button-send"
                v-on:click="onClickCancelDeleteBtn"
                >Отменить
        </button>
    </div>
  </div>
</template>

<script>
import { useMutation } from '@vue/apollo-composable'
import { DELETE_MAIN } from '../querys/mutations'
import { router } from '../routes.js'

export default {
    props: ['propsId', 'propsTitle'],
    data(){
        // удаление заметки
        const { mutate: deleteMain } = useMutation(DELETE_MAIN)
        return {
            deleteMain,

            id: this.propsId,
            title: this.propsTitle
        }
    },
    methods: {
        async onClickConfirmDeleteBtn(){
          await this.deleteMain({
            mainId: this.id,
          })
          this.$emit('closed-window')
        },
        onClickCancelDeleteBtn(){
          this.$emit('closed-window')
        }
    }
}
</script>