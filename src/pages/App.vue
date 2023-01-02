<template>
  <main class="relative overflow-hidden bg-gray-100 w-full min-h-screen pt-8 pb-12 flex flex-col my-auto app">
    <div class="w-full px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div v-for="step in steps" :key="step.title" :class="['relative', currentStepNumber >= step.id ? 'block' : 'hidden md:block']">
          <div :class="['w-full h-2 rounded-sm transition', currentStepNumber >= step.id ? 'bg-indigo-600' : 'bg-gray-300']"></div>
          <div :class="['text-md pt-6 transition', currentStepNumber >= step.id ? 'text-indigo-600' : 'text-gray-500']">Krok {{ step.id }}</div>
          <div class="text-lg text-black font-medium">{{ step.title }}</div>
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="w-full" v-show="hasSubStep">
        <!-- canvas -->
        <div class="w-full px-8 mt-8 md:mt-24">
          <div class="w-full md:w-1/2 xl:w-1/3 mx-auto flex items-center justify-start mb-8">
            <div class="w-full text-3xl font-bold mr-8"><span class="leading-6" v-html="getCurrentSubStep?.title"></span></div>
            <div class="flex transition-all items-center z-10 cursor-pointer justify-center h-12 min-w-[3rem] w-12 border-indigo-800 border-2 bg-indigo-600 rounded-full hover:shadow-xl" @click="showInfoModal = true">
              <span class="text-xl font-semibold text-white">?</span>
            </div>
          </div>
          <div class="w-full md:w-1/2 xl:w-1/3 mx-auto mb-16 relative" style="font-size: 0; !important;">
            <div class="canvas w-full h-auto" ref="canvasWrapper">
              <canvas id="canvas" class="canvas__board" ref="canvasEl" @mousedown="mouseDownListener" @mousemove="mouseMoveListener"
                @mouseup="mouseUpListener" @touchstart="mouseDownListener" @touchmove="mouseMoveListener"
                @touchend="mouseUpListener"></canvas>
              <img :src="uploadedPhoto" class="w-full rounded-md drop-shadow-lg" alt="Face" />
            </div>
          </div>
        </div>
        <!-- end of canvas -->
        <NavigationBar @next="handleNextStep" @prev="handlePreviousStep" :isNextStepEnabled="isNextStepEnabled"></NavigationBar>
      </div>
    </transition>
    <transition name="fade" mode="in-out">
      <div class="w-full results" v-show="!hasSubStep">
        <div class="w-full px-8 mt-8 md:mt-24">
          <div class="w-full md:w-1/2 mx-auto justify-start mb-8 text-center leading-6">
            <p class="text-lg" v-if="faceType">Twoja twarz to:</p>
            <h2 class="w-full text-4xl font-bold text-indigo-600 block mb-8" v-if="faceType">{{ faceType?.title }}</h2>
            <h2 class="w-full text-4xl font-bold text-indigo-600 block mb-8" v-else>Jeszcze tylko chwila...</h2>
            <div class="w-full text-lg mb-16 leading-6 font-medium results__description" v-if="!faceType" v-html="result?.description"></div>
            <div class="w-full text-lg mb-16 leading-6 font-medium results__description" v-else><p>{{ faceType?.description }}</p></div>

            <div class="w-full" v-if="!faceType && result?.questions?.length">
              <div class="questions mt-24">
                <div class="question mb-8" v-for="question, index in result?.questions" :key="question.title">
                  <h3 class="question__title text-lg font-medium mb-8 block">Pytanie {{ `${(index + 1)}: ${question.title}` }}</h3>
                  <div class="question__answers">
                    <div :class="['question__answer block mb-4 p-4 border-2 transition bg-gray-200 text-left rounded cursor-pointer', answer.key === question.answer ? 'border-indigo-600 text-indigo-600' : '']" v-for="answer in question?.answers" @click="setAnswer(answer.key, question)" :key="answer.key">{{ `${answer.key}. ${answer.title}` }}</div>
                  </div>
                </div>
              </div>
              <div class="w-full flex justify-center">
                <button type="button"
                  :class="['border-2 flex items-center transition rounded-md text-white py-4 px-8', !hasAnswerLeft ? 'bg-indigo-600 border-indigo-800 cursor-pointer hover:shadow-xl' : 'bg-indigo-400 border-indigo-600 cursor-not-allowed']" @click="checkResults">
                  Zobacz rezultat
                </button>
              </div>
            </div>

            <div class="w-full lg:w-3/4 mx-auto" v-if="faceType">
              <div class="recommended w-full mb-16">
                <h3 class="text-lg font-medium mb-8 block">{{ faceType?.title === 'Twarz owalna' ? 'Przykłady opraw nadających wyrazistości' : 'Przykłady dobrze dobranych opraw' }}:</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full place-content-center">
                  <div class="block w-full" v-for="item in faceType?.recommended">
                    <img class="block w-full h-auto rounded-xl shadow-xl mb-4" :src="getImage(item)">
                    <p class="text-md font-medium text-center">{{ getText(item) }}</p>
                  </div>
                </div>
              </div>
              <div class="unrecommended w-full">
                <h3 class="text-lg font-medium mb-8 block">{{ faceType?.title === 'Twarz owalna' ? 'Przykłady opraw nadających łagodności' : 'Przykłady opraw, których lepiej unikać' }}:</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full place-content-center">
                  <div class="block w-full" v-for="item in faceType?.unrecommended">
                    <img class="block w-full h-auto rounded-xl shadow-xl mb-4" :src="getImage(item)">
                    <p class="text-md font-medium text-center">{{ getText(item) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <InfoModal v-show="showInfoModal && getCurrentSubStep" :title="getCurrentSubStep?.title" :description="getCurrentSubStep?.description" :image="getCurrentSubStep?.image" @close="showInfoModal = false"></InfoModal>
    </transition>
  </main>
</template>

<script>
import PhotoUploader from '../components/PhotoUploader.vue'
import NavigationBar from '../components/NavigationBar.vue'
import InfoModal from '../components/InfoModal.vue'
import { useGlobalStore } from '../stores'
import { mapState, mapActions } from 'pinia'
import KocieOczy from '../assets/kocie-oczy.jpg'
import KwadratowoProstokatne from '../assets/kwadratowe-prostokatne.jpg'
import NaCiegno from '../assets/na-ciegno.jpg'
import Okragle from '../assets/okragle.jpg'
import Owalne from '../assets/owalne.jpg'
import Panto from '../assets/panto.jpg'
import Pilotki from '../assets/pilotki.jpg'

export default {
  name: 'App',
  components: { PhotoUploader, NavigationBar, InfoModal },
  data() {
    return {
      showInfoModal: false,
      temporaryLines: [],
      image: "",
      startPosition: {
        x: 0,
        y: 0,
      },
      endPosition: {
        x: 0,
        y: 0,
      },
      isDrawStart: false,
      context: null,
    }
  },
  methods: {
    ...mapActions(useGlobalStore, ['incrementCurrentStepNumber', 'setCurrentStepNumber', 'setUserInput', 'removeUserInput', 'getResults', 'setAnswer', 'setFaceType']),
    getClientOffset(event) {
      const { offsetX, offsetY } = event.touches ? event.touches[0] : event;
      const x = offsetX - this.canvasEl.offsetLeft;
      const y = offsetY - this.canvasEl.offsetTop;

      return {
        x,
        y,
      };
    },
    mouseDownListener(event) {
      this.startPosition = this.getClientOffset(event);
      this.isDrawStart = true;
    },
    mouseMoveListener(event) {
      if (!this.isDrawStart) return;

      this.endPosition = this.getClientOffset(event);
      this.clearCanvas();
      this.drawLine();
    },
    mouseUpListener() {
      this.isDrawStart = false;
    },
    clearCanvas() {
      this.context.clearRect(
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height
      );
    },
    drawLine() {
      if (this.context) {
        this.temporaryLines = [];
        this.$nextTick(() => {
          this.context.beginPath();
          this.context.lineWidth = 5;
          this.context.strokeStyle = "#00ff00";
          this.context.moveTo(
            this.startPosition.x,
            this.startPosition.y
          );
          this.context.lineTo(
            this.endPosition.x,
            this.endPosition.y
          );
          this.temporaryLines.push({
            start: this.startPosition,
            end: this.endPosition,
          });
          this.context.stroke();
        });
      }
    },
    saveLine() {
      this.setUserInput(this.temporaryLines[0]);
      this.temporaryLines = [];
      this.clearCanvas();
    },
    removeLine() {
      this.clearCanvas();
      this.removeUserInput();
    },
    handlePreviousStep() {
      if(this.currentStepNumber === 1 && this.getCurrentStep.currentStepNumber === 0) {
        this.$router.push('/');
        return;
      }
      this.removeLine();
    },
    handleNextStep() {
      this.saveLine();
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    changeStepHandler() {
      this.scrollToTop();
      this.showInfoModal = true;
    },
    checkResults() {
      if(!this.hasAnswerLeft) {
        const result = this.result.getResult();
        this.setFaceType(result);
        this.scrollToTop();
      }
    },
    getImage(image) {
      if(image === 'kocie-oczy') {
        return KocieOczy
      } else if(image === 'kwadratowo-prostokatne') {
        return KwadratowoProstokatne
      } else if(image === 'na-ciegno') {
        return NaCiegno
      } else if(image === 'okragle') {
        return Okragle
      } else if(image === 'owalne') {
        return Owalne
      } else if(image === 'panto') {
        return Panto
      } else if(image === 'pilotki') {
        return Pilotki
      }
    },
    getText(text) {
      if (text === 'kocie-oczy') {
        return 'Kocie oczy'
      } else if (text === 'kwadratowo-prostokatne') {
        return 'Kwadratowe / prostokątne'
      } else if (text === 'na-ciegno') {
        return 'Na ciegno (inaczej: na żyłkę)'
      } else if (text === 'okragle') {
        return 'Okrągłe'
      } else if (text === 'owalne') {
        return 'Owalne'
      } else if (text === 'panto') {
        return 'Panto'
      } else if (text === 'pilotki') {
        return 'Pilotki'
      }
      return text
    }
  },
  computed: {
    ...mapState(useGlobalStore, {
      uploadedPhoto: 'uploadedPhoto',
      steps: 'steps',
      hasSubStep: 'hasSubStep',
      currentStepNumber: 'currentStepNumber',
      getCurrentSubStep: 'getCurrentSubStep',
      getCurrentStep: 'getCurrentStep',
      result: 'getResultData',
      faceType: 'getFaceTypeData'
    }),
    hasSubStep() {
      return this.getCurrentSubStep ? true : false;
    },
    canvasEl() {
      return this.$refs.canvasEl;
    },
    isNextStepEnabled() {
      return this.temporaryLines.length > 0 ? true : false;
    },
    hasAnswerLeft() {
      return this.result?.questions?.find(el => el.answer === null);
    }
  },
  mounted() {
    if(this.uploadedPhoto === null) this.$router.push('/')
    this.setCurrentStepNumber(1);

    document.body.addEventListener("touchstart", function (e) { if (e.target.nodeName == 'CANVAS') { e.preventDefault(); } }, false);
    document.body.addEventListener("touchend", function (e) { if (e.target.nodeName == 'CANVAS') { e.preventDefault(); } }, false);
    document.body.addEventListener("touchmove", function (e) { if (e.target.nodeName == 'CANVAS') { e.preventDefault(); } }, false);

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    this.context = ctx

    setTimeout(() => {
      this.$nextTick(() => {
        if(this.canvasEl) {
          this.canvasEl.width = this.$refs.canvasWrapper?.offsetWidth;
          this.canvasEl.height = this.$refs.canvasWrapper?.offsetHeight;
        }
      });
    }, 500)
  },
  watch: {
    currentStepNumber() {
      this.changeStepHandler();
      if(this.getCurrentStep.id === 3) {
        this.getResults();
        this.scrollToTop();
      }
    },
    getCurrentSubStep() {
      this.changeStepHandler();
    }
  }
}
</script>

<style lang="postcss" scoped>
.app {
  :deep() {
    .canvas {
      position: relative;
      font-size: 0;

      &__board {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 1;
        left: 0;
        top: 0;
      }
    }

    .results {
      &__description {
        p {
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>