<template>
  <main class="page-audio">
    <h1 class="mb-4">Music Generation</h1>
    <div class="flex-row align-items-stretch mb-2">
      <header class="control-header">
        <div class="form-item">
          <span class="label">Autochord</span>
          <van-switch v-model="isAutochoard" size="22px"
          :active-color="activeColor" inactive-color="#d2d2d2"></van-switch>
        </div>
        <div class="form-item">
          <span class="label">Period</span>
          <van-radio-group v-model="alphaDuration">
            <van-radio v-for="(item, index) in periods" :key="index" :name="item">{{item}}</van-radio>
          </van-radio-group>
        </div>
        <section id="testAudio" class="flex-row">
          <button class="button mx-auto" @click="generate()">Generate</button>
        </section>
      </header>
      <div class="divider-line"></div>
      <section class="content-wrapper">
          <ProgressBar :value="0.8"></ProgressBar>
          <button class="button transparent ml-2" @click="isPlaying ? stop() : playText()">
            <van-icon :color="activeColor" size="40" v-if="isPlaying" name="pause" />
            <van-icon :color="activeColor" size="40" v-else name="play" />
          </button>
          <div class="word-wrap">
            <span class="word" style="margin-right: 4px" v-for="(item, index) in paraArr" :key="index">
              <span  v-for="(alpha, alphaIndex) in item" :key="index + '_' +alphaIndex" 
              :class="{'highlight': index == activeLetter.wordIndex && alphaIndex == activeLetter.letterIndex,'played': index < activeLetter.wordIndex || index <= activeLetter.wordIndex && alphaIndex < activeLetter.letterIndex}">{{alpha.letter}}<span v-if="index == activeLetter.wordIndex && alphaIndex == activeLetter.letterIndex" class="icon-music"></span></span>
            </span>
          </div>
        </section>
    </div>

    <section>
      period: {{alphaDuration}}, min meters: {{maxMeter}}
    </section>
    <section style="width: 100%; float: left">
      <p class="mb-2">Split Mode</p>
      <div>
        <span v-for="(item, index) in paraArr" :key="index" class="whole-word" style="margin-bottom: 0.5rem; clear: both;">
          <span v-for="(alpha, alphaIndex) in item" :key="index + '_' +alphaIndex" class="word word-span"
          :class="{'highlight': index == activeLetter.wordIndex && alphaIndex == activeLetter.letterIndex, 'played': index <= activeLetter.wordIndex && alphaIndex < activeLetter.letterIndex}"
          :style="{'padding-right': alpha.meters * 200 + 'px'}"><span class="word-letter">{{alpha.letter}}</span><span class="word-meter">{{alpha.metersStr}}</span></span>
        </span>
      </div>
    </section>

  </main>
</template>

<script>
import Vue from 'vue'
import Tone from 'tone'
import Observe from 'observe'
import { Lyrics, NotesMajor, NotesWholeTone, NotesChromatic, NotesPentatonic, OBEvent } from 'config/'
import SmapleLibrary from '@/lib/Tonejs-Instruments.js'
import ProgressBar from '@/components/ProgressBar'
export default {
  name: 'AudioPlayer',
  components: {
    ProgressBar
  },
  props: {
    paraText: String,
    type: String,
  },
  watch: {
    paraText (to, from) {
      this.paraArr = this.computedText().map(item => this.computedItem(item))
    },
    type (to, from) {
      if (to) {
        this.stop()
        this.Notes = this.notesReady[to]
        // this.playText()
      }
    }
  },
  data() {
    return {
      activeColor: '#212733',
      isAutochoard: true,
      periods: [
        1000,
        2000,
        4000
      ],
      paraArr: [],
      activeLetter: {
        wordIndex: 0,
        letterIndex: 1
      },
      inputText: '',
      notesReady: {
        'notes_major': NotesMajor,
        'notes_whole_tone': NotesWholeTone,
        'notes_chromatic': NotesChromatic,
        'notes_pentatonic': NotesPentatonic
      },
      Notes: NotesMajor,
      alphaDuration: 2000,
      maxMeter: 16,
      playState: {
        isPlaying: false,
        isPause: false,
        isStop: true
      },
      playingCaches: [],
      isPlaying: false,
      playTiming: undefined
    }
  },
  computed: {
    para() {
      this.paraArr = this.computedText().map(item => this.computedItem(item))
      return this.paraText
    }
  },
  mounted() {
    this.paraArr = this.computedText().map(item => this.computedItem(item))

    var vm = this
    vm.initPiano()
  },
  methods: {
    async initPiano() {
      this.synth = SmapleLibrary.load({
        instruments: "piano"
      }).toMaster()

      // this.synth = new Tone.PolySynth( 10 ).toMaster()

      // 监听乐谱自动播放
      // Observe.$on(OBEvent.AUTO_PLAY_SCORE, (scorename) => {
      //   this.playScoreByName(scorename)
      // })
    },
    formatSyllable (n) {
      if (n > 0) {
        let meterLength = 2 ** n
        if (meterLength > this.maxMeter) {
          meterLength = this.maxMeter
        } 
        return {
          value: 1 / meterLength,
          string: `1 / ${meterLength}`
        }
      } else {
        return {
          value: 1 / 1,
          string: `1 / 1`
        }
      }
    },
    computedText() {
      let input = this.input && this.input != void 0 && this.input != '' ? this.input : this.paraText
      let arr = input.replace(/\n/g, ' ').replace(/\?|!|'|:|,/g, '').split(' ')
      let paraArr = arr.map(element => {
        return element.toString().toLowerCase()
      })
      // console.log(paraArr)
      // console.log(this.paraArr)
      return paraArr
      // 格式化数组
    },
    computedItem(text) {
      let vm = this
      return text.split('').map((item) => {
        let meter = vm.formatSyllable(text.length - 1)
        return {
          letter: item,
          meters: meter.value,
          metersStr: meter.string 
        }
      })
    },
    computedEachNote () {
      let noteArr = []
      let vm = this
      let wIdx = 0
      this.paraArr.forEach((eachWord) => {
        let lIdex = 0
        eachWord.forEach((eachLetter) => {
          let note = vm.getNoteByLetter(eachLetter.letter)
          noteArr.push({
            letter: eachLetter,
            note: note,
            wordIndex: wIdx,
            letterIndex: lIdex
          })
          lIdex++
        })
        wIdx++
      })
      return noteArr
    },
    generate() {
      this.stop()
      this.playText()
    },
    playText() {
      let vm = this
      this.playingCaches = this.computedEachNote()

      let _cacheWordInedx = 0
      // 初始化播放位置 用 settimeout 总感觉有点不靠谱 可以先这么苟着 需要加一个控制的东西
      let timeoutValue = 500
      this.playingCaches.forEach((each) => {
        if (_cacheWordInedx != each.wordIndex) {
          timeoutValue = timeoutValue + vm.alphaDuration / 2
          _cacheWordInedx = each.wordIndex
        }
        timeoutValue = timeoutValue + vm.alphaDuration * each.letter.meters        
        let set = () => {
          vm.playNote(each.note.name)
          vm.activeLetter.wordIndex = each.wordIndex
          vm.activeLetter.letterIndex = each.letterIndex
        }
        each.playTiming =  setTimeout(set, timeoutValue);
      })
      this.$emit('start')
      timeoutValue = timeoutValue + vm.alphaDuration
      setTimeout(() => {
        vm.activeLetter.wordIndex = -1
        vm.activeLetter.letterIndex = -1
      }, timeoutValue);
    },
    getNoteByLetter(key = 'C4') {
      let filternotes = this.Notes.filter((note) => {
        return note.key == key
      })
      if (filternotes.length > 0) {
        return filternotes[0]
      } else {
        return undefined
      }
    },
    playNote(notename = 'C4', duration = '1n') {
      if (!this.synth) return
      // console.log(notename)
      this.isPlaying = true
      this.synth.triggerAttackRelease(notename, duration);
    },
    stop() {
      this.playingCaches.forEach((each) => {
        clearTimeout(each.playTiming)
      })
      this.isPlaying = false
      this.activeLetter = {
        wordIndex: -1,
        letterIndex: -1
      }
      this.$emit('stop')
    }
  },
}
</script>

<style lang="less">
@pblue: #1296db;
@bgColor: #212733;
@textdark: #2c3e50;
.mb {
  &-2 {
    margin-bottom: 1rem;
  }
  &-4 {
    margin-bottom: 2rem;
  }
}
.page-audio {
  width: calc(87% + 32px);
  margin: auto; min-height: 100%; padding: 1px; padding-bottom: 150px; font-family: 'Avenir', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: @textdark; font-weight: bold;

  .flex-row {
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    &.align-items-stretch {
      align-items: stretch;
    }
  }
  .content-wrapper {
    padding: 0 20px;
    flex: 1;
    width: 100%;
  }
  .word-wrap {
    display: flex;

    flex-flow: row wrap;
    align-items: baseline;
    font-weight: light;
  }
  .word {
    color: #8c8c8c;
    line-height: 1.7;
    span {
      line-height: 1.5;
      font-weight: 500;
    }
    .highlight {
      color: rgb(252, 180, 86);
      position: relative;
      .icon-music {
        position: absolute;
        top: 50%;
        left: -50%;
        transform: scale(0.20) translateY(-45%);
        transform-origin: 0 0;
        mix-blend-mode: darken;
        cursor: pointer;
      }
    }
    .played {
      color: #4c4c4c;
    }

    &.word-span {
      background: white;
      color: @bgColor;
      border-radius: 10px;
      padding: 0px 10px;
      margin:4px;
      box-shadow: 0 0 10px 0 #33333360;
      float: left;
      &.highlight {
        background: @bgColor;
        color: white;
      }
      .word-meter {
        font-size: 0.4em;
        margin-left: 5px;
      }
    }
  }
  .button {
    font-weight: normal;
    padding: 3px 16px;
    border-radius: 3px;
    margin: 10px 0;
    background: white;
    color: @bgColor;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
    border: none;
    transition: all ease 120ms;
    cursor: pointer;
    &:focus {
      outline: 12px;
      box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.85);
    }
    &:hover {
      transform: scale(1.018);
      box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.45);
    }

    &.transparent {
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      &:focus {
        outline: 12px;
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.45);
      }
      &:hover {
        transform: scale(1.018);
        box-shadow: none;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.page-audio {
  padding-top: 35px;
  color: #212733;
  h1 {
    padding-left: 28px;
    font-size: 18px;
  }
  header.control-header {
    padding: 0 28px;
    width: 350px;
  }
  .divider-line {
    width: 1px;
    background: rgba(33, 39, 51, 0.2);
    height: 100%;
    box-sizing: border-box;
    min-height: 145px;
    margin: 0 20px;
  }
  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    padding-right: 5px;
    .label {
      font-weight: 500;
      min-width: 90px;
      text-align: right;
      font-size: 18px;
      line-height: 25px;
      color: #212733;
      margin-right: 30px;
    }
    /deep/ .van-switch {
      border-radius: 3px;
      margin-left: 7px;
      width: 3em;
      .van-switch__node {
        width: 1.5em;
        border-radius: 3px;
      }
      &.van-switch--on .van-switch__node {
        transform: translateX(1.5em);
      }
    }
    /deep/ .van-radio-group {
      display: flex;

    }
    /deep/ .van-radio {
      .van-radio__icon {
        display: none;
      }

      .van-radio__label {
        background: #FFFFFF;
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
        border-radius: 3px;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        color: #212733;
        width: 52px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px 7px;
      }
      .van-radio__icon--checked + .van-radio__label {
        color: #ffffff;
        background: #212733;
      }
    }

  }
}

</style>