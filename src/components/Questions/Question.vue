<template>
  <q-layout view="hHr lpr fFr">
    <q-header class="bg-white text-primary">
      <q-toolbar>
        <!-- Progress -->
        <div :class="'survey-progress-wrapper ' + (oSurvey.questions.length > 15 ? 'thin' : null)">
          <template v-for="q in oSurvey.questions">
            <span
              :key="q.id"
              :class="getProgressClasses(oSurvey, q)"
              @click="changeQuestion(q)"
            >
              <span class="inner">&nbsp;</span>
            </span>
            <!-- :to="getQuestionHash(q)" -->
            <!-- q.users_answer -->
          </template>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pb-xl">
        <transition :name="questionTransition" mode="out-in">
          <!-- The Question -->
          <!-- Single Question here -->
          <div v-if="questionIsViewed(question)" :key="question.id">
            <div class="q-mb-md q-px-md q-pb-md q-pt-sm">
              <div class="text-overline">
                {{ $t('Question') }} {{ getQuestionPosition() }} / {{ oSurvey.question_count }}
              </div>
              <h1 class="text-black">
                {{ question.title }}
              </h1>
              <div class="text-subtitle1 text-black">
                {{ question.subtitle }}
              </div>
              <div class="text-body2">
                <div
                  v-if="oSurvey.use_html"
                  v-html="question.description"
                />
                <p v-else>
                  {{ question.description }}
                </p>
              </div>
            </div>

            <!-- if checkboxes -->
            <template v-if="question.format == 'checkboxes'">
              <q-item
                v-for="option in question.options"
                :key="option.id"
                v-ripple
                tag="label"
                :value="option.id"
              >
                <q-item-section avatar top>
                  <!-- Multiple -->
                  <q-checkbox
                    v-if="question.max_options > 1"
                    :value="findSelectedOption(question, option) ? true : false"
                    :style="'--option-color: '+ option.color + ';'"
                    @click.native="toggleAnswerOption(question, option)"
                  />
                  <!-- Single -->
                  <q-radio
                    v-else
                    :value="findSelectedOptionId(question, option)"
                    :val="option.id"
                    selected
                    :style="'--option-color: '+ option.color + ';'"
                    @click.native="toggleAnswerOptionSingle(question, option)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ option.title }}</q-item-label>
                  <q-item-label caption>
                    {{ option.subtitle }}
                    {{ option.description }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <!-- if dropdown -->
            <template v-if="question.format == 'dropdown'">
                        
              <div style="text-align: center;">
                <q-btn-dropdown
                  color="primary"
                  :label="dropdownLabel"
                  unelevated
                >
                  <q-list>
                    <q-item
                      v-for="option in question.options"
                      :key="option.id"
                      clickable
                      v-close-popup
                      @click.native="toggleAnswerOption(question, option)"
                    >
                      <q-item-section>
                        <q-item-label>{{ option.title }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>

              <!-- {{ question.options }}
              {{ question }}
              <q-select
                :value="getAwnserOptions"
                :options="question.options"
                label="Standard"
                option-value="id"
                option-label="title"
                @input="dropdownSelect"
              /> -->

            </template>

            <!-- If Else Slider -->
            <template v-else-if="question.format.indexOf('slider') !== -1">
              <div class="slider-wrapper">
                <q-slider
                  :value="getSelectedSliderOptionOrder(question)"
                  :min="getFirstQuestionOption(question)"
                  :max="getLastQuestionOption(question)"
                  :step="1"
                  label
                  :label-value="getSliderLabel(question)"
                  :style="'color:'+sliderColor"
                  :label-text-color="getSliderTextColor(question)"
                  :color="sliderColor"
                  class="coha--rating-slider"
                  label-always
                  markers
                  :vertical="question.format === 'slider_vert'"
                  :reverse="question.format === 'slider_vert'"
                  :first-option="question.options && question.options.length > 0 ? question.options[0].title : null"
                  :last-option="question.options && question.options.length > 0 ? question.options[question.options.length - 1].title : null"
                  @change="sliderChange"
                  @input="sliderChange"
                />
              </div>
              <template v-if="questionHasAnswers(question)">
                <transition name="fade" mode="out-in">
                  <div
                    :key="firstAnswer(question).subtitle"
                    class="selected-option coha"
                    :style="'color:'+sliderColor"
                    :color="sliderColor"
                  >
                    <div class="subtitle">
                      {{ firstAnswer(question).subtitle }}
                    </div>
                    <div class="description">
                      {{ firstAnswer(question).description }}
                    </div>
                  <!-- {{ firstAnswer(question) }} -->
                  </div>
                </transition>
              </template>
            </template>

            <div style="text-align: center">
              <QuestionComment
                :question="question"
                :is-no-infoblock="isNoInfoblock"
                :is-infoblock="isInfoblock"
                :find-or-create-answer="findOrCreateAnswer"
                :get-user-answeres="getUserAnsweres"
                :text-focus="textFocus"
                :text-blur="textBlur"
              />

              <div v-if="question.is_skippable && isNoInfoblock()" class="skippable-wrapper q-pa-md">
                <q-btn
                  label="Frage überspringen"
                  icon="skip_next"
                  size="md"
                  flat
                  rounded
                  color="grey"
                  @click="skipQuestion(question)"
                />
              </div>
            </div>
            <!-- <pre class="debug">{{ question }}</pre> -->
          </div>
        </transition>
      </q-page>
    </q-page-container>
    <q-footer bordered class="bg-white text-primary">
      <q-toolbar>
        <q-btn flat icon="keyboard_arrow_down" :to="hashes.overview" />
        <template v-if="question">
          <template v-if="questionIsSkippable(question) && !hasAnswer(question)">
            <q-btn
              :label="isInfoblock() ? 'Weiter' : 'Frage überspringen'"
              color="primary"
              class="full-width"
              tabindex="2"
              @click="skipQuestion(question)"
            />
          </template>

          <template v-else>
            <q-btn
              ref="saveButton"
              label="Antwort speichern"
              :disable="questionUnsubmittable(question)"
              color="primary"
              class="full-width"
              tabindex="2"
              @click="updateOrCreateAnswer(question, true)"
            />
          </template>
        </template>
        <q-btn flat disable icon="help_outline" _click="$router.back()" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import QuestionComment from '@/components/Questions/QuestionComment'

export default {

  components: {
    QuestionComment
  },

  props: {
    hashes: {
      type: Object,
      required: true
    },
    oSurvey: {
      type: Object,
      required: true
    },
    question: {
      type: Object,
      default: null
    },
    getViewedQuestion: {
      type: Function,
      required: true
    },
    getQuestionHash: {
      type: Function,
      required: true
    },
    getOverviewHash: {
      type: Function,
      required: true
    },
    questionIsViewed: {
      type: Function,
      required: true
    },
    getPositionById: {
      type: Function,
      required: true
    },
    findByKey: {
      type: Function,
      required: true
    },
    copyObject: {
      type: Function,
      required: true
    },
    isLight: {
      type: Function,
      required: true
    },
    isDark: {
      type: Function,
      required: true
    },
    lightOrDark: {
      type: Function,
      required: true
    },
    questionTransition: {
      type: String,
      required: true
    },
    bPreview: {
      type: Boolean,
      default: false
    },
    isInfoblock: {
      type: Function,
      required: true
    },
    isNoInfoblock: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      textFocused: false
    }
  },

  computed: {
    sliderColor: function () {
      return this.firstAnswer(this.question)?.color ?? ''
    },

    dropdownLabel () {
      return this.getAwnserOptions?.join(', ') ?? 'Bitte auswählen'
    },

    getAwnserOptions () {
      return this.question?.users_answer?.answer_options?.map(e => e.title)
    },
  },

  mounted () {
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && (!this.textFocused || (e.ctrlKey || e.metaKey))) {
        // code for enter (or (without focus) CMD+Enter or CTRL+Enter)
        this.$refs.saveButton.click()
      }
    })
  },

  created () {

  },

  methods: {

    textFocus () {
      this.textFocused = true
    },

    textBlur () {
      this.textFocused = false
    },

    questionIsSkippable (question = this.question) {
      return question.is_skippable || this.isInfoblock(question)
    },

    changeQuestion (clickedQuestion) {
      let currQ = this.question
      // If its another question
      if (currQ.id === clickedQuestion.id) {
        return true
      } else {
        // Update Current Question
        if (currQ.users_answer) {
          this.updateOrCreateAnswer(this.question, false)
        }

        // Route to new clicked Question
        let to = this.getQuestionHash(clickedQuestion)
        this.$router.push(to)
      }
    },

    isSkipped (question) {
      return question.users_answer && question.users_answer.skipped && this.isNoInfoblock(question)
    },

    hasAnswer (q) {
      return (
        q &&
        q.users_answer &&
        (
          q.users_answer.answer_options.length > 0 || q.users_answer.comment
        )
      )
    },

    dropdownSelect (option) {
      this.toggleAnswerOption(this.question, option)
    },

    toggleAnswerOption (oQuestion, oOption) {
      var oAnswer = this.findOrCreateAnswer(oQuestion)
      var aAwOpts = oAnswer.answer_options
      var oSelOpt = this.findSelectedOption(oQuestion, oOption)

      // Already Selected
      if (oSelOpt) {
        // So remove!
        var iPos = this.getPositionById(oSelOpt, aAwOpts)
        if (aAwOpts[iPos]) {
          // Remove
          aAwOpts.splice(iPos, 1)
        }
      } else {
        // Not Selected
        // So Add!
        var obj = this.copyObject(oOption)

        aAwOpts.push(obj)
      }
    },
    getQuestionPosition () {
      return this.getPositionById(this.question, this.oSurvey.questions) + 1
    },
    questionUnsubmittable (q) {
      return !this.questionSubmittable(q)
    },
    getUserAnsweres (question = this.question) {
      if (
        question &&
        question.users_answer &&
        question.users_answer.answer_options
      ) {
        return question.users_answer.answer_options
      }
      return []
    },
    usersAnswerRequiresComment (question = this.question) {
      return !!(
        question &&
        question.users_answer &&
        question.users_answer.answer_options &&
        this.getUserAnsweres(question).some(e => { return !!(e.settings && e.settings.comment_required) })
      )
    },
    questionSubmittable (q) {
      // Skippable
      if (q.is_skippable) return true

      // If Comment Required
      if (this.usersAnswerRequiresComment(q) && !q.users_answer.comment) return false

      // If Comment-only
      if (q.format === 'comment_only' && q.users_answer && q.users_answer.comment) return true

      // Options Available
      if (q && q.users_answer && q.users_answer.answer_options) {
        // Not Skippable
        const len = q.users_answer.answer_options.length
        const min = q.min_options <= len
        const max = q.max_options >= len

        return min && max
      }

      return false
    },
    getQuestion (q, dir) {
      var qs = this.oSurvey.questions
      var iCurPos = this.getPositionById(q, qs)
      var iNewPos = iCurPos + dir
      var eNew = qs[iNewPos]
      if (eNew) return eNew
    },
    firstAnswer (question) {
      if (
        question &&
        question.users_answer &&
        question.users_answer.answer_options
      ) {
        return question.users_answer.answer_options[0]
      }
      return {}
    },
    questionRoute (q, dir) {
      var nq = this.getQuestion(q, dir)
      if (nq) return this.getQuestionHash(nq)
      else return this.getOverviewHash()
    },
    beforeQuestionRoute (q) {
      return this.questionRoute(q, -1)
    },
    nextQuestionRoute (q) {
      return this.questionRoute(q, +1)
    },
    goTo (a) {
      this.$router.push(a)
    },
    goToQuestion (q) {
      this.goTo(this.questionRoute(q, 0))
    },
    goToOverview () {
      this.goTo(this.getOverviewHash())
    },
    nextUnansweredQuestion (q) {
      // Get next Unanswered Questions
      const nextUaQuestions = this.oSurvey.questions.filter(e =>
        // Where already Answered And
        (
          !e.users_answer ||
          this.isSkipped(e) ||
          !this.questionSubmittable(e)
        ) &&
        e.order > q.order // Where order is bigger
      )

      if (nextUaQuestions.length) {
        this.goToQuestion(nextUaQuestions[0])
      } else {
        this.goToOverview()
      }
    },
    getProgressClasses (survey, question) {
      var r = ['progress']
      var viewedQ = this.getViewedQuestion(survey)

      // Get Viewed Question
      switch (true) {
        case (question.order < viewedQ.order):
          r.push('passed')
          break

        case (question.order > viewedQ.order):
          r.push('away')
          break

        default:
          r.push('curr')
          break
      }

      switch (true) {
        case this.isInfoblock(question):
          r.push('infoblock')
          break

        case this.isSkipped(question):
          r.push('skipped')
          break

        case question.users_answer && this.questionSubmittable(question):
          r.push('answered')
          break

        default:
          r.push('unanswered')
          break
      }

      return r.join(' ')
    },
    getSelectedSliderOptionOrder (question) {
      let o = this.firstAnswer(question)
      return (o && o.order) ? o.order : null
    },
    getFirstQuestionOption (question) {
      return Math.min.apply(Math, question.options.map(option => option.order))
    },
    getLastQuestionOption (question) {
      return Math.max.apply(Math, question.options.map(option => option.order))
    },
    questionHasAnswers (question) {
      return !!this.firstAnswer(question)
    },
    getSliderLabel (question) {
      let o = this.firstAnswer(question)
      return (o && o.title) ? o.title : null
    },
    getSliderTextColor (question) {
      let o = this.firstAnswer(question)
      return (o && o.color && this.isLight(o.color)) ? 'black' : 'white'
    },
    sliderInput () {
      // console.log(e)
    },
    sliderMouseMove () {
      // console.log('slidermousemove', e)
    },
    sliderChange (order) {
      var question = this.getViewedQuestion(this.oSurvey)
      var option = this.findByKey(question.options, order, 'order')

      this.toggleAnswerOptionSingle(question, option)
    },
    toggleAnswerOptionSingle (question, option) {
      // Delete all Answer Options
      if (question?.users_answer?.answer_options) {
        question.users_answer.answer_options = []
      }

      // Select
      this.toggleAnswerOption(question, option)
    },

    findOrCreateAnswer (oQuestion) {
      if (!oQuestion.users_answer) {
        oQuestion.users_answer = {
          question_id: oQuestion.id,
          answer_options: [],
          comment: null
        }
      }
      return oQuestion.users_answer
    },
    findSelectedOption (question, option) {
      if (question && question.users_answer && question.users_answer.answer_options) {
        return this.findByKey(
          question.users_answer.answer_options,
          option.id,
          'id'
        )
      }
    },

    findSelectedOptionId (question, option) {
      let opt = this.findSelectedOption(question, option)
      if (opt && opt.id) return opt.id
    },

    skipQuestion (q) {
      if (!q.users_answer) {
        q.users_answer = {}
      }
      q.users_answer.answer_options = [{}]
      q.users_answer.comment = null
      q.users_answer.skipped = 1
      this.sendAnswer(q, true)
    },

    updateOrCreateAnswer (q, bNextQ) {
      q.users_answer.skipped = 0
      this.sendAnswer(q, bNextQ)
    },

    sendAnswer (question, bNextQ) {
      if (this.bPreview) {
        // Next Question
        if (bNextQ) {
          this.nextUnansweredQuestion(question)
        }
      } else {
        this.$store
          .dispatch('surveys/updateOrCreateAnswer', {
            survey_id: question.survey_id,
            question_id: question.id,
            answer: question.users_answer
          })
          .then((e) => {
            // Success
            if (!e || !e.response || !e.response.data || !e.response.data.error) {
              // _t.showSnackbarSuccess(_t.$t('data_saved'))

              // Update in Model
              question.users_answer = this.copyObject(e.data)

              // Next Question
              if (bNextQ) {
                this.nextUnansweredQuestion(question)
              }
            }
          })
          .catch((e) => {
            // Error
            this.showSnackbarError(this.$t('data_unsaved') + '<br />' + e)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

h1 {
  font-size: 24px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: .02em;
  color: #000;
}

</style>
