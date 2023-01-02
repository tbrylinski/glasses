// @ts-check
import { createPinia, defineStore } from "pinia";
import storeReset from './plugins/storeReset'

const store = createPinia()
store.use(storeReset)

export const useGlobalStore = defineStore({
  id: 'global',
  state: () => ({
    uploadedPhoto: null,
    currentStepNumber: 0,
    faceType: '',
    resultKey: {
      group: null,
      key: null,
    },
    steps: [
      {
        id: 1,
        title: 'Wskaż proporcje twarzy',
        currentStepNumber: 0,
        userInput: {
          faceWidth: null,
          faceHeight: null,
        },
        subSteps: [
          {
            id: 0,
            title: 'Wyznacz <span class="text-indigo-600">długość</span> swojej twarzy',
            description: '<p>Długość twarzy to odległość w linii prostej pomiędzy najwyższym punktem czoła, a najniższym punktem podbródka. Wyznacz ją poprzez kliknięcie i przeciągnięcie myszy. Linia długości nie powinna przebiegać ukośnie względem twarzy. Im bliżej pionu, tym lepiej.</p>',
            image: 'face-height.svg',
            userInput: null,
          },
          {
            id: 1,
            title: 'Wyznacz <span class="text-indigo-600">szerokość</span> swojej twarzy',
            description: '<p>Szerokość twarzy to odległość w linii prostej pomiędzy kośćmi policzkowymi. Wyznacz punkty swojej twarzy najbardziej wysunięte na lewo i prawo. Te miejsca powinny znajdować się na kościach policzkowych, mniej więcej na wysokości uszu. Linia szerokości twarzy powinna przebiegać poziomo na wysokości uszu, ale ich nie obejmować.</p>',
            image: 'face-width.svg',
            userInput: null,
          }
        ]
      },
      {
        id: 2,
        title: 'Wskaż cechy charakterystyczne',
        currentStepNumber: 0,
        userInput: {
          faceLine1: null,
          faceLine2: null,
          faceLine3: null,
        },
        subSteps: [
          {
            id: 0,
            title: 'Wyznacz <span class="text-indigo-600">linię skroni</span> swojej twarzy',
            description: '<p>Odcinek czołowy twarzy to przestrzeń od linii włosów do łuku brwi. Mniej więcej na środku tego obszaru swojej twarzy wyznacz poziomą linię, zaznaczając punkty skrajnie wysunięte na lewą i prawą stronę. Może się ona znajdować nieco ponad skrońmi.</p>',
            image: 'face-line1.svg',
            userInput: null,
          },
          {
            id: 1,
            title: 'Wyznacz <span class="text-indigo-600">linię policzków</span> swojej twarzy',
            description: '<p>Odcinek nosowy twarzy to przestrzeń od łuku brwi do najniżej wysuniętego punktu na nosie. Mniej więcej na środku tego obszaru swojej twarzy wyznacz poziomą linię. Jej początek i koniec powinny opierać się na kościach policzkowych.</p>',
            image: 'face-width.svg',
            userInput: null,
          },
          {
            id: 2,
            title: 'Wyznacz <span class="text-indigo-600">linię żuchwy</span> swojej twarzy',
            description: '<p>Odcinek szczękowy twarzy to przestrzeń od nosa do najniżej wysuniętego punktu na brodzie. W tym obszarze swojej twarzy wyznacz poziomą linię, której początek i koniec, będą się opierały na żuchwie (najniższe punkty na bokach twarzy znajdujące się tuż przed zwężeniem do podbródka). Linia żuchwy powinna znajdować się nieco poniżej ust, najczęściej na wysokości zagłębienia pod dolną wargą.</p>',
            image: 'face-line3.svg',
            userInput: null,
          },
        ],
      },
      {
        id: 3,
        title: 'Zobacz nasze pomysły',
        currentStepNumber: 0,
        subSteps: [],
      }
    ],
    results: {
      // rezultaty jeśli wysokość > szerokość
      A: {
        'HMS|HSM|EES|HEE': {
          title: 'trójkątna lub prostokątna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twoja linia włosów?',
              answers: [
                {
                  key: 'A',
                  title: 'prosta - włosy przy głowie tworzą linię prostą',
                },
                {
                  key: 'B',
                  title: 'sercowata - włosy rozdzielają się łukowato na środku',
                },
                {
                  key: 'C',
                  title: 'zaokrąglona - włosy układają się w łuk',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'kanciasty, mocno zaznaczony, dość szeroki',
                },
                {
                  key: 'B',
                  title: 'ostry, wąski, spiczasty, mały lub lekko zaostrzony',
                },
                {
                  key: 'C',
                  title: 'delikatnie zaokrąglony o miękkich rysach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoje czoło?',
              answers: [
                {
                  key: 'A',
                  title: 'wysokie i o podobnej szerokości jak pozostałe odcinki twarzy',
                },
                {
                  key: 'B',
                  title: 'szerokie - stanowi najszerszą część twarzy',
                },
              ]
            },
          ],
          results: {
            A: 'twarz prostokątna',
            B: 'twarz trójkątna',
            'ACB|CAB': 'twarz prostokątna z elementami twarzy trójkątnej',
            'BCA|CBA': 'twarz trójkątna z elementami twarzy prostokątnej',
          },
          getResult() {
            // - więcej odp. a) —---> twarz prostokątna
            // - więcej odp. b) —---> twarz trójkątna
            // - c, c, a = więcej odp. a) —---> twarz prostokątna
            // - c, c, b = więcej odp. b) —---> twarz trójkątna
            // - a, c, b —---> twarz prostokątna z elementami twarzy trójkątnej
            // - b, c, a —---> twarz trójkątna z elementami twarzy prostokątnej
            // - c, a, b —---> twarz prostokątna z elementami twarzy trójkątnej
            // - c, b, a —---> twarz trójkątna z elementami twarzy prostokątnej

            const answers = this.questions.map(el => el.answer);
            let simpleComparison = false;
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;

            if(a > b) {
              simpleComparison = true;
              resultKey = 'A';
            } else if(b > a) {
              simpleComparison = true;
              resultKey = 'B';
            } else {
              resultKey = `${answers[0]}${answers[1]}${answers[2]}`;
            }

            const key = (simpleComparison) ? resultKey : Object.keys(this.results).find(el => el.includes(resultKey));

            return this.results[key];
          }
        }, // trojkatna lub prostokatna
        MHS: {
          title: 'owalna lub trójkątna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'delikatnie zaokrąglony o miękkich rysach',
                },
                {
                  key: 'B',
                  title: 'ostry, wąski, spiczasty, mały lub lekko zaostrzony',
                },
                {
                  key: 'C',
                  title: 'kanciasty, mocno zaznaczony, dość szeroki',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoja linia włosów?',
              answers: [
                {
                  key: 'A',
                  title: 'zaokrąglona - włosy układają się w łuk',
                },
                {
                  key: 'B',
                  title: 'sercowata - włosy rozdzielają się łukowato na środku',
                },
                {
                  key: 'C',
                  title: 'prosta - włosy przy głowie tworzą linię prostą',
                },
              ]
            },
            {
              answer: null,
              title: 'Jakie rysy twarzy posiadasz?',
              answers: [
                {
                  key: 'A',
                  title: 'bardziej łagodne o miękkich liniach',
                },
                {
                  key: 'B',
                  title: 'raczej ostre, mocno zaznaczone lub o kanciastych liniach',
                },
              ]
            },
          ],
          results: {
            A: 'twarz owalna',
            B: 'twarz trójkątna',
            'ACB|CAB': 'twarz owalna z nieco zaostrzonymi rysami',
            'BCA|CBA': 'twarz trójkątna o łagodnych rysach',
          },
          getResult() {
            // - więcej odp. a) —---> twarz owalna
            // - więcej odp. b) —---> twarz trójkątna
            // - c, c, a = więcej odp. a) —---> twarz owalna
            // - c, c, b = więcej odp. b) —---> twarz trójkątna
            // - a, c, b —---> twarz owalna z nieco zaostrzonymi rysami
            // - b, c, a —---> twarz trójkątna o łagodnych rysach
            // - c, a, b —---> twarz owalna z nieco zaostrzonymi rysami
            // - c, b, a —---> twarz trójkątna o łagodnych rysach

            const answers = this.questions.map(el => el.answer);
            let simpleComparison = false;
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;

            if(a > b) {
              simpleComparison = true;
              resultKey = 'A';
            } else if(b > a) {
              simpleComparison = true;
              resultKey = 'B';
            } else {
              resultKey = `${answers[0]}${answers[1]}${answers[2]}`;
            }

            const key = (simpleComparison) ? resultKey : Object.keys(this.results).find(el => el.includes(resultKey));

            return this.results[key];
          }
        }, // owalna lub trojkatna
        'MSH|ESE': {
          title: 'trapezoidalna lub prostokątna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'kanciasty, mocno zaznaczony, dość szeroki',
                },
                {
                  key: 'B',
                  title: 'szeroki - stanowi najszerszy odcinek twarzy, a na czubku może być delikatnie zaokrąglony',
                },
                {
                  key: 'C',
                  title: 'delikatnie zaokrąglony o miękkich rysach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoje czoło?',
              answers: [
                {
                  key: 'A',
                  title: 'wysokie i o podobnej szerokości jak pozostałe odcinki twarzy',
                },
                {
                  key: 'B',
                  title: 'zwężające się ku górze',
                },
              ]
            },
          ],
          results: {
            A: 'twarz prostokątna',
            B: 'twarz trapezoidalna',
            'AB|BA': 'twarz trapezoidalna',
          },
          getResult() {
            // - więcej odp. a) —---> twarz prostokątna
            // - więcej odp. b) —---> twarz trapezoidalna
            // - c, a = więcej a
            // - c, b = więcej b
            // - a, b —---> twarz trapezoidalna
            // - b, a —---> twarz trapezoidalna

            const answers = this.questions.map(el => el.answer);
            let simpleComparison = false;
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;

            if(a > b) {
              simpleComparison = true;
              resultKey = 'A';
            } else if(b > a) {
              simpleComparison = true;
              resultKey = 'B';
            } else {
              resultKey = `${answers[0]}${answers[1]}`;
            }

            const key = (simpleComparison) ? resultKey : Object.keys(this.results).find(el => el.includes(resultKey));

            return this.results[key];
          }
        }, // trapezoidalna lub prostokatna
        EHE: {
          title: 'owalna, prostokątna lub trójkątna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'kanciasty, mocno zaznaczony, dość szeroki',
                },
                {
                  key: 'B',
                  title: 'ostry, wąski, spiczasty, mały lub lekko zaostrzony',
                },
                {
                  key: 'C',
                  title: 'delikatnie zaokrąglony o miękkich rysach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoje czoło?',
              answers: [
                {
                  key: 'A',
                  title: 'wysokie i o podobnej szerokości jak pozostałe odcinki twarzy',
                },
                {
                  key: 'B',
                  title: 'szerokie - stanowi najszerszą część twarzy',
                },
                {
                  key: 'C',
                  title: 'zwężające się ku górze',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoja linia włosów?',
              answers: [
                {
                  key: 'A',
                  title: 'prosta - włosy przy głowie tworzą linię prostą',
                },
                {
                  key: 'B',
                  title: 'sercowata - włosy rozdzielają się łukowato na środku',
                },
                {
                  key: 'C',
                  title: 'zaokrąglona - włosy układają się w łuk',
                },
              ]
            },
            {
              answer: null,
              title: 'Jakie rysy twarzy posiadasz?',
              answers: [
                {
                  key: 'A',
                  title: 'raczej ostre, mocno zaznaczone lub o kanciastych liniach',
                },
                {
                  key: 'B',
                  title: 'dość łagodne, ale wyostrzone przy podbródku',
                },
                {
                  key: 'C',
                  title: 'bardziej łagodne o miękkich i zaokrąglonych liniach',
                },
              ]
            },
          ],
          results: {
            A: 'twarz prostokątna',
            B: 'twarz trójkątna',
            C: 'twarz owalna',
            'AB': 'twarz prostokątna z elementami twarzy trójkątnej',
            'AC': 'twarz prostokątna z elementami twarzy owalnej',
            'BA': 'twarz trójkątna z elementami twarzy prostokątnej',
            'BC': 'twarz trójkątna z elementami twarzy owalnej',
            'CA': 'twarz owalna z elementami twarzy prostokątnej',
            'CB': 'twarz owalna z elementami twarzy trójkątnej',
          },
          getResult() {
            // - więcej odp. a) —---> twarz prostokątna (13 takich przypadków)
            // - więcej odp. b) —---> twarz trójkątna (13)
            // - więcej odp. c) —---> twarz owalna (13)

            // gdy 2x ta sama odp.:
            // - jeśli pierwsza odp. a) i jakieś dwie b)—---> twarz prostokątna z elementami twarzy trójkątnej
            // - jeśli pierwsza odp. a) i jakieś dwie c)—---> twarz prostokątna z elementami twarzy owalnej
            // - jeśli pierwsza odp. b) i jakieś dwie a)—---> twarz trójkątna z elementami twarzy prostokątnej
            // - jeśli pierwsza odp. b) i jakieś dwie c)—---> twarz trójkątna z elementami twarzy owalnej
            // - jeśli pierwsza odp. c) i jakieś dwie a) —---> twarz owalna z elementami twarzy prostokątnej
            // - jeśli pierwsza odp. c) i jakieś dwie b) —---> twarz owalna z elementami twarzy trójkątnej

            const answers = this.questions.map(el => el.answer);
            let simpleComparison = false;
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;
            const c = answers.filter(el => el == 'C').length;

            if(a >= 3) {
              simpleComparison = true;
              resultKey = 'A';
            } else if(a == 2) {
              if(b == c) {
                simpleComparison = true;
                resultKey = 'A';
              }
            }

            if(b >= 3) {
              simpleComparison = true;
              resultKey = 'B';
            } else if (b == 2) {
              if(a == c) {
                simpleComparison = true;
                resultKey = 'B';
              }
            }

            if(c >= 3) {
              simpleComparison = true;
              resultKey = 'C';
            } else if (c == 2) {
              if(a == b) {
                simpleComparison = true;
                resultKey = 'C';
              }
            }

            if(this.questions[0].answer === 'A' && !simpleComparison) {
              if(b > 0) {
                resultKey = 'AB';
              } else {
                resultKey = 'AC';
              }
            } else if(this.questions[0].answer === 'B' && !simpleComparison) {
              if(a > 0) {
                resultKey = 'BA';
              } else {
                resultKey = 'BC';
              }
            } else if(this.questions[0].answer === 'C' && !simpleComparison) {
              if(a > 0) {
                resultKey = 'CA';
              } else {
                resultKey = 'CB';
              }
            }

            return this.results[resultKey];
          }
        }, // owalna lub prostokatna lub trojkatna
        SHM: {
          title: 'owalna lub trapezoidalna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'szeroki - stanowi prawie najszerszą część twarzy, może mieć zaokrąglone lub kanciaste rysy',
                },
                {
                  key: 'B',
                  title: 'wąski o delikatnych i zaokrąglonych rysach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jakie rysy twarzy posiadasz?',
              answers: [
                {
                  key: 'A',
                  title: 'raczej ostre, mocno zaznaczone lub o kanciastych liniach',
                },
                {
                  key: 'B',
                  title: 'bardziej łagodne o miękkich liniach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wyglądają Twoje policzki?',
              answers: [
                {
                  key: 'A',
                  title: 'policzki nie są uwydatnione',
                },
                {
                  key: 'B',
                  title: 'policzki są raczej uwydatnione, a kości policzkowe dość szeroko rozstawione',
                },
              ]
            },
          ],
          results: {
            A: 'twarz trapezoidalna',
            B: 'twarz owalna',
          },
          getResult() {
            // więcej odp. a) —---> twarz trapezoidalna
            // - więcej odp. b) —---> twarz owalna

            const answers = this.questions.map(el => el.answer);
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;

            if(a > b) {
              resultKey = 'A';
            } else if(b > a) {
              resultKey = 'B';
            }

            return this.results[resultKey];
          }
        }, // owalna lub trapezoidalna
        'SMH|EEH|SEE': {
          title: 'twarz trapezoidalna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [],
        }, // trapezoidalna
        EEE: {
          title: 'twarz prostokątna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [],
        }, // prostokatna
      },
      // rezultaty jeśli wysokość ~= szerokość
      B: {
        'HMS|HSM|EES|HEE': {
          title: 'trójkątna lub kwadratowa',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twoja linia włosów?',
              answers: [
                {
                  key: 'A',
                  title: 'prosta - włosy przy głowie tworzą linię prostą',
                },
                {
                  key: 'B',
                  title: 'sercowata - włosy rozdzielają się łukowato na środku',
                },
                {
                  key: 'C',
                  title: 'zaokrąglona - włosy układają się w łuk',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'kanciasty, mocno zaznaczony, dość szeroki',
                },
                {
                  key: 'B',
                  title: 'ostry, wąski, spiczasty, mały lub lekko zaostrzony',
                },
                {
                  key: 'C',
                  title: 'delikatnie zaokrąglony o miękkich rysach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoje czoło?',
              answers: [
                {
                  key: 'A',
                  title: 'o podobnej szerokości jak pozostałe odcinki twarzy',
                },
                {
                  key: 'B',
                  title: 'szerokie - stanowi najszerszą część twarzy',
                },
              ]
            },
          ],
          results: {
            A: 'twarz kwadratowa',
            B: 'twarz trójkątna',
            'ACB|CAB': 'twarz kwadratowa z elementami twarzy trójkątnej',
            'BCA|CBA': 'twarz trójkątna z elementami twarzy kwadratowej',
          },
          getResult() {
            // - więcej odp. a) —---> twarz kwadratowa
            // - więcej odp. b) —---> twarz trójkątna
            // - c, c, a = więcej odp. a) —---> twarz kwadratowa
            // - c, c, b = więcej odp. b) —---> twarz trójkątna
            // - a, c, b —---> twarz kwadratowa z elementami twarzy trójkątnej
            // - b, c, a —---> twarz trójkątna z elementami twarzy kwadratowej
            // - c, a, b —---> twarz kwadratowa z elementami twarzy trójkątnej
            // - c, b, a —---> twarz trójkątna z elementami twarzy kwadratowej

            const answers = this.questions.map(el => el.answer);
            let simpleComparison = false;
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;

            if(a > b) {
              simpleComparison = true;
              resultKey = 'A';
            } else if(b > a) {
              simpleComparison = true;
              resultKey = 'B';
            } else {
              resultKey = `${answers[0]}${answers[1]}${answers[2]}`;
            }

            const key = (simpleComparison) ? resultKey : Object.keys(this.results).find(el => el.includes(resultKey));

            return this.results[key];
          }
        }, // trojkatna lub kwadratowa
        'SMH|SEE|EEH': {
          title: 'twarz trapezoidalna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [],
        }, // trapezoidalna
        MHS: {
          title: 'okrągła lub trójkątna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'delikatnie zaokrąglony o miękkich rysach',
                },
                {
                  key: 'B',
                  title: 'ostry, wąski, spiczasty lub o kanciastych rysach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoja linia włosów?',
              answers: [
                {
                  key: 'A',
                  title: 'zaokrąglona - włosy układają się w łuk',
                },
                {
                  key: 'B',
                  title: 'sercowata - włosy rozdzielają się łukowato na środku',
                },
                {
                  key: 'C',
                  title: 'prosta - włosy przy głowie tworzą linię prostą',
                },
              ]
            },
            {
              answer: null,
              title: 'Jakie rysy twarzy posiadasz?',
              answers: [
                {
                  key: 'A',
                  title: 'łagodne o miękkich i zaokrąglonych liniach',
                },
                {
                  key: 'B',
                  title: 'raczej ostre, mocno zaznaczone lub o kanciastych liniach',
                },
              ]
            },
          ],
          results: {
            A: 'twarz owalna',
            REST: 'twarz trójkątna',
          },
          getResult() {
            // - więcej odp. a) —---> twarz owalna
            // - wszystko inne —---> twarz trójkątna

            const answers = this.questions.map(el => el.answer);
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;

            if(a > b) {
              resultKey = 'A';
            } else {
              resultKey = 'REST';
            }

            return this.results[resultKey];
          }
        }, // okragla lub trojkatna
        'MSH|ESE': {
          title: 'trapezoidalna lub kwadratowa',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'kanciasty, mocno zaznaczony, dość szeroki',
                },
                {
                  key: 'B',
                  title: 'szeroki - stanowi najszerszy odcinek twarzy, a na czubku może być delikatnie zaokrąglony',
                },
                {
                  key: 'C',
                  title: 'delikatnie zaokrąglony o miękkich rysach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoje czoło?',
              answers: [
                {
                  key: 'A',
                  title: 'o podobnej szerokości jak pozostałe odcinki twarzy',
                },
                {
                  key: 'B',
                  title: 'zwężające się ku górze',
                },
              ]
            },
          ],
          results: {
            A: 'twarz kwadratowa',
            B: 'twarz trapezoidalna',
            'AB|BA': 'twarz trapezoidalna',
          },
          getResult() {
            // - więcej odp. a) —---> twarz kwadratowa
            // - więcej odp. b) —---> twarz trapezoidalna
            // - c, a = więcej a
            // - c, b = więcej b
            // - a, b —---> twarz trapezoidalna
            // - b, a —---> twarz trapezoidalna

            const answers = this.questions.map(el => el.answer);
            let simpleComparison = false;
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;

            if(a > b) {
              simpleComparison = true;
              resultKey = 'A';
            } else if(b > a) {
              simpleComparison = true;
              resultKey = 'B';
            } else {
              resultKey = `${answers[0]}${answers[1]}`;
            }

            const key = (simpleComparison) ? resultKey : Object.keys(this.results).find(el => el.includes(resultKey));

            return this.results[key];
          }
        }, // trapezoidalna lub kwadratowa
        EHE: {
          title: 'okrągła, trójkątna lub kwadratowa',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'kanciasty, mocno zaznaczony, dość szeroki',
                },
                {
                  key: 'B',
                  title: 'ostry, wąski, spiczasty, mały lub lekko zaostrzony',
                },
                {
                  key: 'C',
                  title: 'delikatnie zaokrąglony o miękkich rysach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoje czoło?',
              answers: [
                {
                  key: 'A',
                  title: 'o podobnej szerokości jak pozostałe odcinki twarzy',
                },
                {
                  key: 'B',
                  title: 'szerokie - stanowi najszerszą część twarzy',
                },
                {
                  key: 'C',
                  title: 'zwężające się ku górze',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wygląda Twoja linia włosów?',
              answers: [
                {
                  key: 'A',
                  title: 'prosta - włosy przy głowie tworzą linię prostą',
                },
                {
                  key: 'B',
                  title: 'sercowata - włosy rozdzielają się łukowato na środku',
                },
                {
                  key: 'C',
                  title: 'zaokrąglona - włosy układają się w łuk',
                },
              ]
            },
            {
              answer: null,
              title: 'Jakie rysy twarzy posiadasz?',
              answers: [
                {
                  key: 'A',
                  title: 'raczej ostre, mocno zaznaczone lub o kanciastych liniach',
                },
                {
                  key: 'B',
                  title: 'dość łagodne, ale wyostrzone przy podbródku',
                },
                {
                  key: 'C',
                  title: 'łagodne o miękkich i zaokrąglonych liniach',
                },
              ]
            },
          ],
          results: {
            A: 'twarz kwadratowa',
            B: 'twarz trójkątna',
            C: 'twarz okrągła',
            'AB': 'twarz kwadratowa z elementami twarzy trójkątnej',
            'AC': 'twarz kwadratowa z elementami twarzy okrągłej',
            'BA': 'twarz trójkątna z elementami twarzy kwadratowej',
            'BC': 'twarz trójkątna z elementami twarzy okrągłej',
            'CA': 'twarz okrągła z elementami twarzy kwadratowej',
            'CB': 'twarz okrągła z elementami twarzy trójkątnej',
          },
          getResult() {
            // - więcej odp. a) —---> twarz kwadratowa (13 takich przypadków)
            // - więcej odp. b) —---> twarz trójkątna (13)
            // - więcej odp. c) —---> twarz okrągła (13)

            // gdy 2x ta sama odp.:
            // - jeśli pierwsza odp. a) i jakieś dwie b)—---> twarz kwadratowa z elementami twarzy trójkątnej
            // - jeśli pierwsza odp. a) i jakieś dwie c)—---> twarz kwadratowa z elementami twarzy okrągłej
            // - jeśli pierwsza odp. b) i jakieś dwie a)—---> twarz trójkątna z elementami twarzy kwadratowej
            // - jeśli pierwsza odp. b) i jakieś dwie c)—---> twarz trójkątna z elementami twarzy okrągłej
            // - jeśli pierwsza odp. c) i jakieś dwie a) —---> twarz okrągła z elementami twarzy kwadratowej
            // - jeśli pierwsza odp. c) i jakieś dwie b) —---> twarz okrągła z elementami twarzy trójkątnej

            const answers = this.questions.map(el => el.answer);
            let simpleComparison = false;
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;
            const c = answers.filter(el => el == 'C').length;

            if(a >= 3) {
              simpleComparison = true;
              resultKey = 'A';
            } else if(a == 2) {
              if(b == c) {
                simpleComparison = true;
                resultKey = 'A';
              }
            }

            if(b >= 3) {
              simpleComparison = true;
              resultKey = 'B';
            } else if (b == 2) {
              if(a == c) {
                simpleComparison = true;
                resultKey = 'B';
              }
            }

            if(c >= 3) {
              simpleComparison = true;
              resultKey = 'C';
            } else if (c == 2) {
              if(a == b) {
                simpleComparison = true;
                resultKey = 'C';
              }
            }

            if(this.questions[0].answer === 'A' && !simpleComparison) {
              if(b > 0) {
                resultKey = 'AB';
              } else {
                resultKey = 'AC';
              }
            } else if(this.questions[0].answer === 'B' && !simpleComparison) {
              if(a > 0) {
                resultKey = 'BA';
              } else {
                resultKey = 'BC';
              }
            } else if(this.questions[0].answer === 'C' && !simpleComparison) {
              if(a > 0) {
                resultKey = 'CA';
              } else {
                resultKey = 'CB';
              }
            }

            return this.results[resultKey];
          }
        }, // okragla lub trojkatna lub kwadratowa
        SHM: {
          title: 'okrągła lub trapezoidalna',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [
            {
              answer: null,
              title: 'Jak wygląda Twój podbródek?',
              answers: [
                {
                  key: 'A',
                  title: 'stanowi prawie najszerszą część twarzy i jest dość kanciasty',
                },
                {
                  key: 'B',
                  title: 'dość szeroki, ale o delikatnych i zaokrąglonych rysach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jakie rysy twarzy posiadasz?',
              answers: [
                {
                  key: 'A',
                  title: 'raczej ostre, mocno zaznaczone lub o kanciastych liniach',
                },
                {
                  key: 'B',
                  title: 'łagodne o miękkich i zaokrąglonych liniach',
                },
              ]
            },
            {
              answer: null,
              title: 'Jak wyglądają Twoje policzki?',
              answers: [
                {
                  key: 'A',
                  title: 'policzki nie są uwydatnione',
                },
                {
                  key: 'B',
                  title: 'policzki są mocno uwydatnione, a kości policzkowe dość szeroko rozstawione',
                },
              ]
            },
          ],
          results: {
            A: 'twarz trapezoidalna',
            B: 'twarz okrągła',
          },
          getResult() {
            // więcej odp. a) —---> twarz trapezoidalna
            // - więcej odp. b) —---> twarz okrągła

            const answers = this.questions.map(el => el.answer);
            let resultKey = '';

            const a = answers.filter(el => el == 'A').length;
            const b = answers.filter(el => el == 'B').length;

            if(a > b) {
              resultKey = 'A';
            } else if(b > a) {
              resultKey = 'B';
            }

            return this.results[resultKey];
          }
        }, // okragla lub trapezoidalna
        EEE: {
          title: 'twarz kwadratowa',
          description: `
          <p>Mamy już wstępną analizę Twojej twarzy, potrzebne jest nam jeszcze tylko kilka informacji. Odpowiedz na poniższe pytania, aby ustalić dokładny kształt.</p>
          `,
          questions: [],
        }, // kwadratowa
      }
    },
    faceTypes: {
      'twarz prostokątna': {
        title: 'Twarz prostokątna',
        description: 'Posiadasz twarz prostokątną, do której najlepiej sprawdzą się oprawy o łagodnym kształcie, bez kanciastych zakończeń. Dobrze wyglądać będą oprawy nieznacznie wychodzące poza obrys twarzy, wyrównując proporcje między długością i szerokością.',
        recommended: ['owalne', 'pilotki', 'okragle'],
        unrecommended: ['kwadratowo-prostokatne', 'panto'],
      },
      'twarz trójkątna': {
        title: 'Twarz trójkątna',
        description: 'Posiadasz twarz trójkątną, do której najlepiej sprawdzą się oprawy o zaokrąglonym kształcie szczególnie na dolnych krawędziach. Dobrze wyglądać będą oprawy dość nisko leżące na nosie.',
        recommended: ['pilotki', 'okragle'],
        unrecommended: ['na-ciegno', 'kocie-oczy'],
      },
      'twarz owalna': {
        title: 'Twarz owalna',
        description: 'Jesteś szczęśliwym posiadaczem twarzy owalnej, uważanej za idealną! Naturalne proporcje Twojej twarzy są zbalansowane, więc nie musisz dobierać opraw tak, aby to osiągnąć. Każdy kształt opraw będzie dobrym wyborem. Jeśli chcesz nadać swojej twarzy więcej wyrazistości, sięgnij po oprawy kanciaste, natomiast jeśli preferujesz łagodny wygląd twarzy wybierz kształty zaokrąglone. Pamiętaj jednak o właściwym rozmiarze oprawy, jeśli będzie ona za szeroka lub za wąska, może zaburzyć naturalne proporcje twarzy.',
        recommended: ['kwadratowo-prostokatne', 'kocie-oczy'],
        unrecommended: ['okragle', 'owalne', 'panto'],
      },
      'twarz okrągła': {
        title: 'Twarz okrągła',
        description: 'Posiadasz twarz okrągłą, do której najlepiej sprawdzą się oprawy kanciaste i podłużne. Dobrze wyglądać będą oprawy wyraziste, z masywną ramką lub mocnym kolorze.',
        recommended: ['kocie-oczy', 'kwadratowo-prostokatne'],
        unrecommended: ['okragle', 'panto', 'na-ciegno'],
      },
      'twarz kwadratowa': {
        title: 'Twarz kwadratowa',
        description: 'Posiadasz twarz kwadratową, do której najlepiej sprawdzą się oprawy zaokrąglone zwłaszcza w dolnej części. Dobrze wyglądać będą oprawy z nieco uniesioną górną krawędzią, ponieważ optycznie wydłużą twarz.',
        recommended: ['okragle', 'owalne', 'pilotki', 'na-ciegno'],
        unrecommended: ['kwadratowo-prostokatne'],
      },
      'twarz prostokątna z elementami twarzy trójkątnej': {
        title: 'Twarz prostokątna z elementami twarzy trójkątnej',
        description: 'Posiadasz twarz prostokątną, ale występują u Ciebie też charakterystyczne cechy twarzy trójkątnej. Wybieraj oprawy nisko leżące na nosie lub wyciągnięte mocno w dół, aby optycznie wyrównać szerokość twarzy. Najlepiej pasować będą kształty łagodne i zaokrąglone.',
        recommended: ['pilotki', 'okragle', 'owalne'],
        unrecommended: ['kwadratowo-prostokatne', 'na-ciegno', 'kocie-oczy'],
      },
      'twarz trójkątna z elementami twarzy prostokątnej': {
        title: 'Twarz trójkątna z elementami twarzy prostokątnej',
        description: 'Posiadasz twarz trójkątną, ale występują u Ciebie też charakterystyczne cechy twarzy prostokątnej. Wybierz oprawy zaokrąglone, które nadadzą łagodności. Możesz pozwolić sobie na ramki nieznacznie wychodzące poza obrys twarzy. Zwróć uwagę na to, aby górne krawędzie opraw nie były bardziej wyraziste niż dolne.',
        recommended: ['pilotki', 'okragle', 'owalne'],
        unrecommended: ['kwadratowo-prostokatne', 'kocie-oczy', 'na-ciegno'],
      },
      'twarz owalna z nieco zaostrzonymi rysami': {
        title: 'Twarz owalna z nieco zaostrzonymi rysami',
        description: 'Posiadasz twarz owalną, uważaną za idealną! Odpowiedni dla Ciebie będzie każdy kształt opraw, jednak ze względu na nieco wyostrzone rysy twarzy lepiej będą wyglądać kształty zaokrąglone u dołu.',
        recommended: ['okragle', 'kocie-oczy', 'pilotki'],
        unrecommended: ['kwadratowo-prostokatne'],
      },
      'twarz trójkątna o łagodnych rysach': {
        title: 'Twarz trójkątna o łagodnych rysach',
        description: 'Posiadasz twarz trójkątną, do której najlepiej sprawdzą się oprawy o zaokrąglonych dolnych krawędziach. W celu wyrównania proporcji między wąską szczęką i nieco szerszym czołem najlepiej wybierać ramki, w których górna część nie wyróżnia się znacząco od dolnej.',
        recommended: ['okragle', 'pilotki', 'owalne'],
        unrecommended: ['kocie-oczy', 'na-ciegno'],
      },
      'twarz trapezoidalna': {
        title: 'Twarz trapezoidalna',
        description: 'Posiadasz twarz trapezoidalną, do której najlepiej sprawdzą się oprawy o łagodnych dolnych krawędziach oraz zaakcentowanych górnych obszarach. Dobrze wyglądać będą oprawy nieznacznie wychodzące poza obrys twarzy, wyrównując proporcje między długością i szerokością.',
        recommended: ['na-ciegno', 'kocie-oczy', 'panto'],
        unrecommended: ['kwadratowo-prostokatne'],
      },
      'twarz prostokątna z elementami twarzy owalnej': {
        title: 'Twarz prostokątna z elementami twarzy owalnej',
        description: 'Posiadasz twarz prostokątną, jednak wyróżniają się też u Ciebie cechy twarzy owalnej. Wybierz oprawy, w których dolna krawędź nie będzie kanciasta.',
        recommended: ['panto', 'na-ciegno', 'okragle'],
        unrecommended: ['kwadratowo-prostokatne'],
      },
      'twarz trójkątna z elementami twarzy owalnej': {
        title: 'Twarz trójkątna z elementami twarzy owalnej',
        description: 'Posiadasz twarz trójkątną, jednak wyróżniają się też u Ciebie cechy twarzy owalnej. Wybierz oprawy, w których dolna krawędź będzie miała obły kształt, ale nie powinna się ona znacząco zwężać. Unikaj opraw typu oversize, które wizualnie poszerzają twarz w górnej części.',
        recommended: ['okragle', 'owalne', 'pilotki'],
        unrecommended: ['kocie-oczy', 'kwadratowo-prostokatne', 'panto'],
      },
      'twarz owalna z elementami twarzy prostokątnej': {
        title: 'Twarz owalna z elementami twarzy prostokątnej',
        description: 'Posiadasz twarz owalną, uważaną za idealną! Odpowiedni dla Ciebie będzie każdy kształt opraw. Jednak występują też u Ciebie cechy charakterystyczne dla twarzy prostokątnej i ze względu na nie, możesz wybierać nieco delikatniejsze oprawy zamiast masywnych i kanciastych ramek.',
        recommended: ['panto', 'pilotki', 'okragle', 'owalne', 'kocie-oczy'],
        unrecommended: ['kwadratowo-prostokatne'],
      },
      'twarz owalna z elementami twarzy trójkątnej': {
        title: 'Twarz owalna z elementami twarzy trójkątnej',
        description: 'Posiadasz twarz owalną, uważaną za idealną! Odpowiedni dla Ciebie będzie każdy kształt opraw. Jednak występują też u Ciebie cechy charakterystyczne dla twarzy trójkątnej, więc uważaj na oprawy z mocnymi akcentami na górnych krawędziach. Mogą one zaburzyć proporcje pomiędzy górną i dolną częścią twarzy.',
        recommended: ['okragle', 'owalne', 'kwadratowo-prostokatne'],
        unrecommended: ['kocie-oczy', 'na-ciegno'],
      },
      'twarz kwadratowa z elementami twarzy trójkątnej': {
        title: 'Twarz kwadratowa z elementami twarzy trójkątnej',
        description: 'Posiadasz twarz kwadratową, do której najlepiej pasują oprawy o zaokrąglonych kształtach. Występują też u Ciebie cechy charakterystyczne dla twarzy trójkątnej, więc zwróć uwagę, aby ramka nie była szersza niż twarz, aby nie zwiększyć dysproporcji pomiędzy górną i dolną częścią twarzy.',
        recommended: ['okragle', 'panto', 'owalne'],
        unrecommended: ['kwadratowo-prostokatne', 'kocie-oczy'],
      },
      'twarz trójkątna z elementami twarzy kwadratowej': {
        title: 'Twarz trójkątna z elementami twarzy kwadratowej',
        description: 'Posiadasz twarz trójkątną połączoną z charakterystycznymi cechami twarzy kwadratowej. Zdecydowanie najlepszym wyborem będą oprawy o łagodnych, zaokrąglonych kształtach, zrezygnuj z ramek kanciastych. Unikaj także opraw, w których mocniej zaakcentowana jest górna część.',
        recommended: ['pilotki', 'okragle', 'owalne'],
        unrecommended: ['kwadratowo-prostokatne', 'kocie-oczy', 'na-ciegno'],
      },
      'twarz kwadratowa z elementami twarzy okrągłej': {
        title: 'Twarz kwadratowa z elementami twarzy okrągłej',
        description: 'Posiadasz twarz kwadratową, jednak występują u Ciebie także pojedyncze cechy typowe dla kształtu okrągłego. Dobrym wyborem mogą być oprawy typu kocie oko, które optycznie wydłużają twarz. Ważne jest, aby dolna krawędź oprawy nie była kanciasta, zaokrąglone linie pomogą zrównoważyć mocno zaznaczoną szczękę.',
        recommended: ['kocie-oczy', 'panto', 'na-ciegno'],
        unrecommended: ['kwadratowo-prostokatne'],
      },
      'twarz trójkątna z elementami twarzy okrągłej': {
        title: 'Twarz trójkątna z elementami twarzy okrągłej',
        description: 'Posiadasz twarz trójkątną, jednak występują u Ciebie także pojedyncze cechy typowe dla kształtu okrągłego. Dobrym wyborem mogą być oprawy dość mocno zaznaczone np. o masywnej ramie lub wyrazistym kolorze, ale o zaokrąglonych rogach.',
        recommended: ['okragle', 'owalne'],
        unrecommended: ['na-ciegno'],
      },
      'twarz okrągła z elementami twarzy kwadratowej': {
        title: 'Twarz okrągła z elementami twarzy kwadratowej',
        description: 'Posiadasz twarz okrągłą, jednak występują u Ciebie także pojedyncze cechy typowe dla kształtu kwadratowego. Dobrym wyborem mogą być oprawy masywne lub wyraziste (np. acetatowe) z mocno zaakcentowaną górną krawędzią.',
        recommended: ['kocie-oczy', 'kwadratowo-prostokatne', 'owalne'],
        unrecommended: ['okragle'],
      },
      'twarz okrągła z elementami twarzy trójkątnej': {
        title: 'Twarz okrągła z elementami twarzy trójkątnej',
        description: 'Posiadasz twarz okrągłą, jednak występują u Ciebie także pojedyncze cechy typowe dla kształtu trójkątnego. Dobrze sprawdzą się u Ciebie oprawy kanciaste w wyrazistym kolorze. Jednak należy uważać, aby górna część oprawy nie dominowała nad dolną oraz, aby rama nie wychodziła poza obrys twarzy, co optycznie poszerzyłoby ją.',
        recommended: ['kwadratowo-prostokatne', 'pilotki'],
        unrecommended: ['okragle', 'kocie-oczy'],
      },
    }
  }),
  getters: {
    getUploadedPhoto() {
      return this.uploadedPhoto
    },
    getCurrentStepNumber() {
      return this.currentStepNumber
    },
    getCurrentStep() {
      return this.steps.find(step => step.id === this.currentStepNumber) ? this.steps.find(step => step.id === this.currentStepNumber) : null;
    },
    getCurrentSubStep() {
      // @ts-ignore
      return this.getCurrentStep?.subSteps.find(el => el.id === this.getCurrentStep?.currentStepNumber);
    },
    getSteps() {
      return this.steps
    },
    getResultData() {
      if(this.resultKey.key && this.resultKey.group) {
        const resultKey = this.resultKey.group ? this.resultKey.group : '';
        const key = Object.keys(this.results[this.resultKey.key]).find(el => el.includes(resultKey));

        // @ts-ignore
        console.log('scenario:', this.results[this.resultKey.key][key ? key : '']?.title);

        // @ts-ignore
        if(!this.results[this.resultKey.key][key ? key : '']?.questions.length) {
          // @ts-ignore
          this.setFaceType(this.results[this.resultKey.key][key ? key : '']?.title);
        }

        return this.results[this.resultKey.key][key ? key : ''];
      }

      return null;
    },
    getFaceTypeData() {
      return this.faceTypes[this.faceType ? this.faceType : ''] ? this.faceTypes[this.faceType] : null;
    }
  },
  actions: {
    setFaceType(type) {
      this.faceType = type;
    },
    setUploadedPhoto(payload) {
      this.uploadedPhoto = payload
    },
    clearUploadedPhoto() {
      this.uploadedPhoto = null
    },
    incrementCurrentStepNumber() {
      if(this.currentStepNumber < this.steps.length) {
        this.currentStepNumber++;
      }
    },
    decrementCurrentStepNumber() {
      if(this.currentStepNumber > 1) {
        this.currentStepNumber--;
      }
    },
    setCurrentStepNumber(step) {
      this.currentStepNumber = step;
    },
    setUserInput(input) {
      if(this.getCurrentSubStep) {
        this.getCurrentSubStep.input = input;
        const error = this.handleUserInputs(input);
        if(!error) {
          this.handleStepChanges();
        }
      }
    },
    setResultsKey(key, group) {
      this.resultKey.key = key;
      this.resultKey.group = group;
    },
    resetFirstStep() {
      this.steps[0].subSteps[0].userInput = null;
      this.steps[0].subSteps[0].userInput = null;
      // @ts-ignore
      this.steps[0].userInput.faceHeight = null;
      // @ts-ignore
      this.steps[0].userInput.faceWidth = null;
      this.setCurrentStepNumber(1);
      this.getCurrentStep.currentStepNumber = 0;
      window.alert('Wprowadzone dane nie wydają się poprawne. Spróbuj ponownie wyznaczyć długość i szerokość w oparciu o podane instrukcje.');
    },
    setAnswer(key, question) {
      question.answer = key;
    },
    handleUserInputs(input) {
      if(this.currentStepNumber === 1) {
        if(this.getCurrentStep.currentStepNumber === 0) {
          this.getCurrentStep.userInput.faceHeight = this.getLineDistance(input.start, input.end);
        } else {
          if(this.getCurrentStep.userInput.faceHeight > this.getLineDistance(input.start, input.end)) {
            this.getCurrentStep.userInput.faceWidth = this.getLineDistance(input.start, input.end);
          } else {
            this.resetFirstStep();
            return true;
          }
        }
      } else if(this.currentStepNumber === 2) {
        if(this.getCurrentStep.currentStepNumber === 0) {
          this.getCurrentStep.userInput.faceLine1 = this.getLineDistance(input.start, input.end);
        } else if (this.getCurrentStep.currentStepNumber === 1) {
          this.getCurrentStep.userInput.faceLine2 = this.getLineDistance(input.start, input.end);
        } else if (this.getCurrentStep.currentStepNumber === 2) {
          this.getCurrentStep.userInput.faceLine3 = this.getLineDistance(input.start, input.end);
        }
      }
      return false;
    },
    handleStepChanges() {
      if(this.getCurrentStep.currentStepNumber + 1 === this.getCurrentStep.subSteps.length) {
        this.incrementCurrentStepNumber();
      } else {
        this.getCurrentStep.currentStepNumber++;
      }
    },
    removeUserInput() {
      if(this.getCurrentSubStep) {
        this.getCurrentSubStep.input = null;
        if(this.getCurrentStep.currentStepNumber == 0) {
          this.decrementCurrentStepNumber();
        } else {
          this.getCurrentStep.currentStepNumber--;
        }
      }
    },
    getLineDistance(point1, point2) {
      let xs = 0;
      let ys = 0;

      xs = point2.x - point1.x;
      xs = xs * xs;

      ys = point2.y - point1.y;
      ys = ys * ys;

      return Math.sqrt( xs + ys );
    },
    getResults() {
      // @ts-ignore
      const height = Math.round(this.steps[0]?.userInput?.faceHeight ? this.steps[0].userInput.faceHeight : 0);
      // @ts-ignore
      const width = Math.round(this.steps[0]?.userInput?.faceWidth ? this.steps[0].userInput.faceWidth : 0);
      const percentage = this.isWhatPercentOf(width, height);

      if(percentage > 100) {
        console.log('throw an error');
        return;
      }
      
      const key = percentage <= 70 ? 'A' : 'B';

      this.buildResultKey(key);
    },
    isWhatPercentOf(numA, numB) {
      return (numA / numB) * 100;
    },
    buildResultKey(key) {
      const lines = this.steps[1].userInput ? this.steps[1].userInput : {};

      const linesPercentage = {
        line12: (lines?.faceLine1 >= lines?.faceLine2) ? this.isWhatPercentOf(lines.faceLine2, lines.faceLine1) : this.isWhatPercentOf(lines.faceLine1, lines.faceLine2),
        line23: (lines?.faceLine2 >= lines?.faceLine3) ? this.isWhatPercentOf(lines.faceLine3, lines.faceLine2) : this.isWhatPercentOf(lines.faceLine2, lines.faceLine3),
        line13: (lines?.faceLine1 >= lines?.faceLine3) ? this.isWhatPercentOf(lines.faceLine3, lines.faceLine1) : this.isWhatPercentOf(lines.faceLine1, lines.faceLine3),
      }

      let valueToCompare = 0;

      const linesResult = {
        faceLine1: '',
        faceLine2: '',
        faceLine3: '',
      }

      if(linesPercentage.line12 >= 90 || linesPercentage.line13 >= 90) {
        linesResult.faceLine1 = 'E';
        valueToCompare = lines.faceLine1;
      }

      if(linesPercentage.line12 >= 90 || linesPercentage.line23 >= 90) {
        linesResult.faceLine2 = 'E';
        valueToCompare = lines.faceLine2;
      }

      if(linesPercentage.line23 >= 90 || linesPercentage.line13 >= 90) {
        linesResult.faceLine3 = 'E';
        valueToCompare = lines.faceLine3;
      }

      if(valueToCompare) {
        for (const key in lines) {
          if (Object.hasOwnProperty.call(lines, key)) {
            if(linesResult[key] != 'E') {
              if(lines[key] < valueToCompare) {
                linesResult[key] = 'S';
              } else {
                linesResult[key] = 'H';
              }
            }
          }
        }
      } else {
        // sort object by values
        let sortable = [];
        for (const line in lines) {
          sortable.push([line, lines[line]]);
        }

        sortable.sort(function(a, b) {
          return b[1] - a[1];
        });

        linesResult[sortable[0][0]] = 'H';
        linesResult[sortable[1][0]] = 'M';
        linesResult[sortable[2][0]] = 'S';
      }

      const resultString = `${linesResult.faceLine1}${linesResult.faceLine2}${linesResult.faceLine3}`;

      this.setResultsKey(key, resultString);

      // todo:
      // 1. check if there are similar lines (approximately to 5%)
      // 2. if they're assign E to them and check if the last line is smaller or greater than them
      // 3. if they're not create an abstract sorted ascending faceLines array and assign HMS 
    }
  }
});

export default store