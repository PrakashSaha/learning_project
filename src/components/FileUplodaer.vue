<template>
    <!-- @vue-expect-error -->
    <div
      ref="mainImageDropZoneRef"
      class="rounded-lg h-40 border dark:border-gray-600 flex items-center justify-center mt-2 transition-all overflow-hidden"
      :class="{
        'animate-pulse ring-4 ring-teal-500 bg-teal-50 border-teal-500 dark:border-teal-400 ring-opacity-20': isOverDropZone,
      }"
      @click="open"
    >
      <div class="text-center cursor-pointer">
        <p>Drag some files here</p>
        <p class="text-xs mt-1 text-gray-500">or click here to upload</p>
      </div>
    </div>
  </template>

<script setup lang="ts">
import {ref} from 'vue';
import { useDropZone, useFileDialog } from '@vueuse/core'

//////////////////////////////////////////////////////////////////
////////////* functionality for drop zone *//////////////////////
////////////////////////////////////////////////////////////////
const emit = defineEmits(['onDrop', 'onChange'])
const props = defineProps<{multiple: boolean}>()
const mainImageDropZoneRef = ref<HTMLDivElement>();
function onDrop(files: File[] | null) {
         emit('onDrop', files)
}

/////////////////////////////////////////////////////////////////
////////////////////* handleing the drop zone */////////////////
///////////////////////////////////////////////////////////////
const { isOverDropZone } = useDropZone(mainImageDropZoneRef, {
  onDrop, 
  multiple: true, // control multi-file drop
  preventDefaultForUnhandled: false, // whether to prevent default behavior for unhandled events
})

////////////////////////////////////////////////////////////////////
/////////////////* handleing the click and drop area */////////////
//////////////////////////////////////////////////////////////////
const { open, onChange } = useFileDialog({
    accept: 'Image/*',
    multiple: props.multiple
})
onChange((files) => { emit('onChange', files)})

</script>

<style scoped>

</style>