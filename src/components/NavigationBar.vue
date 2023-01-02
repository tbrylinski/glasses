<template>
  <div class="w-full fixed left-0 bottom-0 py-4 px-8 shadow-lg mt-auto z-20">
    <div class="w-full relative text-center">
      <div class="inline-flex rounded-md" role="group">
        <button type="button"
          class="border-2 transition bg-gray-200 border-gray-400 hover:shadow-xl rounded-md text-gray-600 py-4 px-8 mr-4"
          @click="$emit('prev')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>
        <button type="button"
          :class="['border-2 flex items-center transition rounded-md text-white py-4 pl-8 pr-6', isNextStepEnabled ? 'bg-indigo-600 border-indigo-800 cursor-pointer hover:shadow-xl' : 'bg-indigo-400 border-indigo-600 cursor-not-allowed']"
          @click="$emit('next')">
          Next
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6 ml-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhotoUploader',
  props: {
    isNextStepEnabled: Boolean,
  }
}
</script>