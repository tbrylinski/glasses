<template>
  <main class="relative overflow-hidden bg-gray-100 w-full min-h-screen flex flex-col my-auto">
    <div class="w-full md:hidden h-auto bg-indigo-200 relative">
      <img src="../../src/assets/photo.jpg" class="w-full mix-blend-luminosity" alt="Cover photo">
      <div class="absolute w-full h-full bg-indigo-600 left-0 top-0 mix-blend-overlay"></div>
    </div>
    <div class="w-full mx-auto my-auto z-10 py-8 md:py-0 px-8">
      <div class="columns-1">
        <h1 class="text-5xl md:text-6xl w-full font-bold mb-10 text-center md:text-left">
          <span class="leading-6 text-black"><span class="text-indigo-600">Znajdź okulary</span> pasujące <br
              class="hidden md:block">do Twojej twarzy</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-700 w-full md:w-7/12 lg:w-6/12 mb-8 md:mb-20 text-center md:text-left">
          Wgraj zdjęcie swojej twarzy, aby następnie korzystając z naszej aplikacji znaleźć najbardziej pasujące do Ciebie oprawki.</p>
        <PhotoUploader @change="uploadPhoto" @showModal="showModal = true"></PhotoUploader>
        <InfoModal v-show="showModal" title="<span class='text-indigo-600'>Wgraj poprawne zdjęcie</span> swojej twarzy" description="<p>Prawidłowe zdjęcie to określania kształtu twarzy nie powinno być ładne! Nie przejmuj się tym, jak na nim wyglądasz. Skup się na najważniejszych kwestiach:</p><ul><li>zdjęcie musi być wykonane dokładnie na wprost z jak najbardziej naturalną miną (niestety nie możesz się uśmiechać)</li><li>na twarzy nie powinno być makijażu, biżuterii czy okularów</li><li>włosy zwiąż z tyłu głowy lub zaczesz tak, aby nie nachodziły na twarz; jeśli posiadasz grzywkę, również ją zepnij, aby odsłonić czoło</li><li>pamiętaj, że np. broda może nadawać Twojej twarzy inny kształt niż jest w rzeczywistości, dlatego przy określaniu kształtu twarzy najlepiej byłoby pozbyć się zarostu</li></ul>" image="" @close="showModal = false"></InfoModal>
      </div>
    </div>
    <div class="hidden md:block absolute right-0 top-0 h-full w-full md:w-5/12 lg:w-1/2 bg-indigo-200 z-0">
      <img src="../../src/assets/photo.jpg"
        class="w-full h-full object-cover object-[40%] absolute left-0 top-0 mix-blend-luminosity" alt="Cover photo">
      <div class="absolute w-full h-full bg-indigo-600 left-0 top-0 mix-blend-overlay"></div>
      <div class="absolute hidden md:block right-full bg-gray-100 translate-x-20 md:translate-x-32 top-0 h-full w-40 md:w-64 -skew-x-12"></div>
    </div>
  </main>
</template>

<script>
import PhotoUploader from '../components/PhotoUploader.vue'
import InfoModal from '../components/InfoModal.vue';
import { useGlobalStore } from '../stores'
import { mapActions } from 'pinia'

const store = useGlobalStore();

export default {
  name: 'Home',
  components: { PhotoUploader, InfoModal },
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
    ...mapActions(useGlobalStore, ['setUploadedPhoto', 'setCurrentStepNumber']),
    uploadPhoto(e) {
      const files = e.target.files ? e.target.files : e.dataTransfer.files

      if (files?.length) {
        this.setUploadedPhoto(URL.createObjectURL(files[0]))
        e.target.value = null;
        this.$router.push({ name: 'App' })
      }
    },
  },
  mounted() {
    this.setCurrentStepNumber(0);
    store.$reset()
  }
}
</script>