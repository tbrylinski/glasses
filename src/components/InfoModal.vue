<template>
  <div class="w-full h-full fixed bg-gray-700 overflow-hidden left-0 top-0 z-20 bg-opacity-80 md:px-8 flex justify-center items-center info-modal" @click="$emit('close')">
    <div class="bg-white w-full max-h-screen overflow-y-auto md:max-w-3xl p-6 pb-20 md:p-10 relative rounded-md" @click.stop>
      <!-- close button -->
      <div class="w-8 h-8 sticky ml-auto md:absolute right-0 top-0 md:right-10 md:top-10 cursor-pointer z-10" @click="$emit('close')">
        <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <!-- modal content -->
      <div class="w-full grid grid-cols-4 md:grid-cols-12 gap-8">
        <div class="col-span-4 md:col-span-5 md:order-2" v-if="image">
          <img :src="imageLink" class="pointer-events-none w-full max-w-xs mx-auto md:mx-0 md:max-w-none" alt="">
        </div>
        <div :class="['text-center md:text-left', image ? 'col-span-4 md:col-span-7' : 'col-span-10']">
          <h2 class="text-3xl font-bold mb-8"><span class="leading-6" v-html="title"></span></h2>
          <div class="info-modal__description" v-html="description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FaceHeight from '../assets/face-height.svg'
import FaceWidth from '../assets/face-width.svg'
import FaceLine1 from '../assets/face-line1.svg'
import FaceLine3 from '../assets/face-line3.svg'

export default {
  name: 'InfoModal',
  props: {
    stepData: {
      type: Object,
      default: null,
    },
    image: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  computed: {
    imageLink() {
      switch (this.image) {
        case 'face-height.svg':
          return FaceHeight;
        case 'face-width.svg':
          return FaceWidth;
        case 'face-line1.svg':
          return FaceLine1;
        case 'face-line3.svg':
          return FaceLine3;
        default:
          return this.image;
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.info-modal {
  &__description {
    :deep() {
      color: theme('colors.gray.600');

      p {
        margin-bottom: theme('margin.4');
        font-size: theme('fontSize.base');
      }

      ul, ol {
        padding-left: theme('padding.4');
        text-align: left;

        li {
          margin-bottom: theme('margin.4');
        }
      }

      ul {
        list-style-type: theme('listStyleType.disc');
      }

      ol {
        list-style-type: theme('listStyleType.decimal');
      }
    }
  }
}
</style>