<template>
  <div
    :class="[isActive ? 'border-indigo-600' : 'border-gray-300', 'mt-1 flex justify-center rounded-lg border-2 border-dashed bg-white px-6 pt-5 pb-6 relative w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto md:mx-0']" @dragenter.prevent @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
    <div
      class="flex transition-all items-center z-10 cursor-pointer justify-center h-10 min-w-[2.5rem] w-10 border-indigo-800 border-2 bg-indigo-600 rounded-full hover:shadow-xl absolute right-2 top-2"
      @click="$emit('showModal')">
      <span class="text-lg font-semibold text-white">?</span>
    </div>
    <div class="space-y-1 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"
        aria-hidden="true">
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div class="flex text-sm text-gray-600">
        <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600">
          <span>Wgraj plik</span>
          <input id="file-upload" name="file-upload" type="file" class="sr-only">
        </label>
        <p class="pl-1">lub przeciągnij i upuść</p>
      </div>
      <p class="text-xs text-gray-500">PNG, JPG do 10MB</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhotoUploader',
  data() {
    return {
      isActive: false,
    }
  },
  methods: {
    onDrop(e) {
      this.$emit('change', e);
    },
    onDragOver() {
      this.isActive = true;
    },
    onDragLeave() {
      this.isActive = false;
    }
  }
}
</script>