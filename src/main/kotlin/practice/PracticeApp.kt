package practice

import data.MyHandler
import data.MyKey
import data.account
import data.domain
import data.path
import hotKeys
import kotlinx.browser.window
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.await
import kotlinx.coroutines.launch
import kotlinx.css.Position
import kotlinx.css.position
import kotlinx.css.px
import kotlinx.css.right
import kotlinx.css.top
import kotlinx.html.js.onClickFunction
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import react.setState
import styled.css
import styled.styledButton


suspend fun fetchSource(): List<Thirukkural> {
  val sourceUrl = "$domain/$account/$path/thirukkural.json"
  val sourceData = window.fetch(sourceUrl).await().text().await()
  val groupsUrl = "$domain/$account/$path/kids-group.json"
  val groupsData = window.fetch(groupsUrl).await().text().await()

  val thirukkurals = parseSource(sourceData, groupsData)
  println("version: 2023-11-10.1")
  println("Source: $sourceUrl loaded")
  return thirukkurals
}

external interface PracticeAppProps: RProps {
  var onChange: () -> Unit
}

external interface PracticeAppState : RState {
  var loaded: Boolean
  var thirukkurals: MutableMap<Group, List<Thirukkural>>
  var selectedKuralMeaning: MutableSet<KuralMeaning>
  var questionState: QuestionState
}

private const val baseUrl = "tamilschool.github.io"

class PracticeApp : RComponent<PracticeAppProps, PracticeAppState>() {
  override fun PracticeAppState.init() {
    console.log("PracticeApp.init")
    val mainScope = MainScope()
    mainScope.launch {
      val source = fetchSource()
      val group2Kurals = source.filter { it.group.contains(Group.II) }
      val group3Kurals = source.filter { it.group.contains(Group.III) }
      setState {
        thirukkurals = mutableMapOf()
        thirukkurals[Group.II] = group2Kurals
        thirukkurals[Group.III] = group3Kurals
        selectedKuralMeaning = mutableSetOf(KuralMeaning.SalamanPapa)
        questionState = createQuestionState(Group.II, group2Kurals)
        println("No of athikarams: ${questionState.athikaramState.athikarams.size}")
        println("No of kurals: ${questionState.thirukkurals.size}")
        window.setInterval(timerHandler(), 1000)
        loaded = true
      }
    }
  }

  private fun createQuestionState(group: Group, thirukkurals: List<Thirukkural>) = QuestionState(
    selectedGroup = group,
    selectedTopic = Topic.Athikaram,
    thirukkurals = thirukkurals,
    athikaramState = AthikaramState(thirukkurals),
    thirukkuralState = ThirukkuralState(thirukkurals),
    firstWordState = FirstWordState(thirukkurals),
    lastWordState = LastWordState(thirukkurals),
    timerState = TimerState(),
    showAnswer = false
  )

  private fun timerHandler(): () -> Unit = {
    if (state.questionState.timerState.isLive
      && !state.questionState.timerState.isPaused
      && state.questionState.timerState.time > 0
    ) {
      setState {
        questionState.timerState.time--
      }
    }
  }

  override fun RBuilder.render() {
    hotKeys {
      attrs.keyMap = MyKey(arrayOf("s", "n", "p"))
      attrs.handlers = MyHandler {
        setState {
          when (it.asDynamic()["key"]) {
            "s" -> onShowAnswerHandler(questionState, true)
            "n" -> onNextClickHandler(questionState)
            "p" -> onPreviousClickHandler(questionState)
          }
        }
      }
      if (state.loaded) {
        styledButton {
          css {
            classes = mutableListOf("btn btn-outline-primary btn-sm d-none d-sm-block")
            position = Position.fixed
            top = 9.px
            right = 9.px
          }
          attrs {
            onClickFunction = {
              props.onChange()
            }
          }
          +"திருக்குறள் போட்டி"
        }
        person {
          questionState = state.questionState
          selectedKuralMeaning = state.selectedKuralMeaning
          onGroupClick = { group ->
            setState {
              if (questionState.selectedGroup != group) {
                questionState = createQuestionState(group, thirukkurals[group].orEmpty())
              }
            }
          }
          onTopicClick = { topic ->
            setState {
              if (questionState.selectedTopic != topic) {
                questionState.showAnswer = false
                questionState.selectedTopic = topic
                resetTimer(questionState, false)
              }
            }
          }
          onShowAnswerClick = {
            setState {
              onShowAnswerHandler(questionState, !questionState.showAnswer)
            }
          }
          onTimerClick = {
            setState {
              val timerState = questionState.timerState
              when {
                timerState.isLive && timerState.time <= 0 -> resetTimer(questionState, true)
                timerState.isLive && timerState.isPaused -> timerState.isPaused = false
                timerState.isLive && !timerState.isPaused -> timerState.isPaused = true
                else -> timerState.isLive = true
              }
            }
          }
          onPreviousClick = {
            setState {
              onPreviousClickHandler(questionState)
            }
          }
          onNextClick = {
            setState {
              onNextClickHandler(questionState)
            }
          }
          onMuVaradhaClick = {
            setState {
              selectedKuralMeaning = if (selectedKuralMeaning.contains(KuralMeaning.MuVaradha)) {
                val tempList = selectedKuralMeaning.toMutableSet()
                tempList.remove(KuralMeaning.MuVaradha)
                tempList
              } else {
                val tempList = selectedKuralMeaning.toMutableSet()
                tempList.add(KuralMeaning.MuVaradha)
                tempList
              }
            }
          }
          onSalamanPapaClick = {
            setState {
              selectedKuralMeaning =
                if (selectedKuralMeaning.contains(KuralMeaning.SalamanPapa)) {
                  val tempList = selectedKuralMeaning.toMutableSet()
                  tempList.remove(KuralMeaning.SalamanPapa)
                  tempList
                } else {
                  val tempList = selectedKuralMeaning.toMutableSet()
                  tempList.add(KuralMeaning.SalamanPapa)
                  tempList
                }
            }
          }
          onMuKarunanidhiClick = {
            setState {
              selectedKuralMeaning =
                if (selectedKuralMeaning.contains(KuralMeaning.MuKarunanidhi)) {
                  val tempList = selectedKuralMeaning.toMutableSet()
                  tempList.remove(KuralMeaning.MuKarunanidhi)
                  tempList
                } else {
                  val tempList = selectedKuralMeaning.toMutableSet()
                  tempList.add(KuralMeaning.MuKarunanidhi)
                  tempList
                }
            }
          }
        }
      }
    }
  }
}

private fun resetTimer(questionState: QuestionState, isLive: Boolean) {
  if (isLive) {
    onNextClickHandler(questionState)
  }
  questionState.timerState = TimerState(isLive = isLive)
  questionState.showAnswer = false
  questionState.athikaramState.clearAnswers()
  questionState.thirukkuralState.clearAnswers()
  questionState.firstWordState.clearAnswers()
  questionState.lastWordState.clearAnswers()
}

private fun onShowAnswerHandler(questionState: QuestionState, show: Boolean) {
  questionState.showAnswer = show
}

private fun onNextClickHandler(questionState: QuestionState) {
  onShowAnswerHandler(questionState, false)
  when (questionState.selectedTopic) {
    Topic.Athikaram -> questionState.timerState.count = questionState.athikaramState.goNext()
    Topic.Porul, Topic.Kural -> questionState.timerState.count =
      questionState.thirukkuralState.goNext()

    Topic.FirstWord -> questionState.timerState.count = questionState.firstWordState.goNext()
    Topic.LastWord -> questionState.timerState.count = questionState.lastWordState.goNext()
    Topic.AllKurals -> { /* Next button not available*/
    }
  }
}

private fun onPreviousClickHandler(questionState: QuestionState) {
  onShowAnswerHandler(questionState, false)
  when (questionState.selectedTopic) {
    Topic.Athikaram -> questionState.athikaramState.goPrevious()
    Topic.Porul, Topic.Kural -> questionState.thirukkuralState.goPrevious()
    Topic.FirstWord -> questionState.firstWordState.goPrevious()
    Topic.LastWord -> questionState.lastWordState.goPrevious()
    Topic.AllKurals -> { /* Previous button not available*/
    }
  }
}

fun RBuilder.practiceApp(handler: PracticeAppProps.() -> Unit): ReactElement {
  return child(PracticeApp::class) {
    this.attrs(handler)
  }
}
