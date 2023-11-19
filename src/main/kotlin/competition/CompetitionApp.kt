package competition

import data.MyHandler
import data.MyKey
import competition.group.groupSelection
import competition.signout.signOut
import competition.signout.signOutConfirm
import data.account
import data.domain
import data.path
import hotKeys
import kotlinx.browser.window
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.await
import kotlinx.coroutines.launch
import kotlinx.css.BoxSizing
import kotlinx.css.Display
import kotlinx.css.FlexDirection
import kotlinx.css.Position
import kotlinx.css.boxSizing
import kotlinx.css.display
import kotlinx.css.flexDirection
import kotlinx.css.height
import kotlinx.css.pct
import kotlinx.css.position
import kotlinx.css.px
import kotlinx.css.right
import kotlinx.css.top
import kotlinx.css.vh
import kotlinx.html.js.onClickFunction
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import react.setState
import styled.css
import styled.styledButton
import styled.styledDiv

suspend fun fetchSource(): List<Thirukkural> {
  val sourceUrl = "$domain/$account/$path/thirukkural.json"
  val sourceData = window.fetch(sourceUrl).await().text().await()
  val groupsUrl = "$domain/$account/$path/kids-group.json"
  val groupsData = window.fetch(groupsUrl).await().text().await()

  val thirukkurals = parseSource(sourceData, groupsData)
  println("Source: $sourceUrl loaded")
  return thirukkurals
}

external interface CompetitionAppProps : RProps {
  var onChange: () -> Unit
}

external interface CompetitionAppState : RState {
  var loaded: Boolean
  var showSignOutConfirm: Boolean
  var allKurals: List<Thirukkural>
  var questionState: QuestionState
  var activeGroup: Group?
  var searchResultKural: Thirukkural?
  var selectedKuralMeaning: MutableSet<KuralMeaning>
}

class CompetitionApp : RComponent<CompetitionAppProps, CompetitionAppState>() {
  override fun CompetitionAppState.init() {
    val mainScope = MainScope()
    mainScope.launch {
      val source = fetchSource()
      setState {
        allKurals = source
        questionState = createQuestionState(Group.IA, allKurals)
        selectedKuralMeaning = mutableSetOf(KuralMeaning.SalamanPapa)
        showSignOutConfirm = false
        loaded = true
        println("No of athikarams: ${questionState.athikaramState.targets.size}")
        println("No of kurals: ${questionState.round2Kurals.size}")
        window.setInterval(timerHandler(), 1000)
      }
    }
  }

  private fun createQuestionState(group: Group, thirukkurals: List<Thirukkural>): QuestionState {
    val targetKurals = thirukkurals.filter { it.group.contains(group) }
    return QuestionState(
      selectedGroup = group,
      selectedRound = Round.I,
      selectedTopic = Topic.Athikaram,
      round2Kurals = targetKurals,
      athikaramState = AthikaramState(targetKurals),
      kuralState = ThirukkuralState(targetKurals),
      porulState = ThirukkuralState(targetKurals),
      firstWordState = FirstWordState(targetKurals),
      lastWordState = LastWordState(targetKurals),
      timerState = TimerState(),
      scoreState = ScoreState()
    )
  }

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
            "n" -> onNextClickHandler(questionState)
            "p" -> onPreviousClickHandler(questionState)
          }
        }
      }
      styledDiv {
        css {
          height = 100.vh
          display = Display.flex
          flexDirection = FlexDirection.column
          boxSizing = BoxSizing.borderBox
        }
        styledDiv {
          css {
            height = 100.pct
            position = Position.relative
          }
          styledDiv {
            css {
              classes = mutableListOf("container-lg pl-0 pr-0")
              css {
                height = 100.pct
                position = Position.relative
              }
            }
            if (state.loaded) {
              if (state.showSignOutConfirm) {
                signOutConfirm {
                  onNoClickHandler = {
                    setState {
                      showSignOutConfirm = false
                    }
                  }
                  onYesClickHandler = {
                    setState {
                      showSignOutConfirm = false
                      activeGroup = null
                    }
                  }
                }
              }
              if (state.activeGroup == null) {
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
                  +"திருக்குறள் பயிற்சி"
                }
                groupSelection {
                  onGroupClick = { group ->
                    setState {
                      questionState = createQuestionState(group, allKurals)
                      activeGroup = group
                    }
                  }
                }
              } else if (!state.showSignOutConfirm) {
                signOut {
                  onSignOutHandler = {
                    setState {
                      showSignOutConfirm = true
                    }
                  }
                }
                person {
                  questionState = state.questionState
                  searchResultKural = state.searchResultKural
                  selectedKuralMeaning = state.selectedKuralMeaning
                  onRoundClick = { round ->
                    setState {
                      if (questionState.selectedRound != round) {
                        questionState.selectedRound = round
                        if (round == Round.I) {
                          questionState.timerState.isLive = false
                        }
                      }
                    }
                  }
                  onTopicClick = { topic ->
                    setState {
                      if (questionState.selectedTopic != topic) {
                        questionState.selectedTopic = topic
                        questionState.timerState.isLive = false
                      }
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
                  onWrongClick = {
                    setState {
                      questionState.scoreState.group23Score.round2[questionState.selectedTopic]?.remove(
                        questionState.getCurrentQuestion()
                      )
                    }
                  }
                  onRightClick = {
                    setState {
                      questionState.scoreState.group23Score.round2[questionState.selectedTopic]?.add(
                        questionState.getCurrentQuestion()
                      )
                    }
                  }
                  onNextClick = {
                    setState {
                      onNextClickHandler(questionState)
                    }
                  }
                  onIndexClick = { index ->
                    setState {
                      onIndexClickHandler(questionState, index)
                    }
                  }
                  onSearchByKuralNoClick = { kuralNo ->
                    setState {
                      searchResultKural =
                        allKurals.firstOrNull { it.kuralNo == kuralNo }
                    }
                  }
                  onAddKuralClick = {
                    setState {
                      searchResultKural?.let {
                        if (questionState.selectedGroup.type == ScoreType.PottiSuttru) {
                          if (!questionState.scoreState.group23Score.round1.containsKey(it.kuralNo)) {
                            questionState.scoreState.group23Score.round1[it.kuralNo] =
                              Group23Round1Score(it)
                          }
                        } else {
                          if (!questionState.scoreState.group1Score.round1.containsKey(it.kuralNo)) {
                            questionState.scoreState.group1Score.round1[it.kuralNo] =
                              Group1Round1Score(it)
                          }
                        }
                      }
                      searchResultKural = null
                    }
                  }
                  onDeleteKuralClick = { kuralNo ->
                    setState {
                      if (questionState.selectedGroup.type == ScoreType.PottiSuttru) {
                        questionState.scoreState.group23Score.round1.remove(kuralNo)
                      } else {
                        questionState.scoreState.group1Score.round1.remove(kuralNo)
                      }
                    }
                    setState {
                      if (questionState.selectedGroup.type != ScoreType.PottiSuttru) {
                        if (questionState.scoreState.group1Score.round1.isEmpty()) {
                          questionState.scoreState.group1Score.bonus = 0
                        }
                      }
                    }
                  }
                  onG1Click = { kuralNo, kuralScore ->
                    setState {
                      questionState.scoreState.group1Score.round1[kuralNo] =
                        kuralScore
                    }
                  }
                  onG23Click = { kuralNo, kuralScore ->
                    setState {
                      questionState.scoreState.group23Score.round1[kuralNo] =
                        kuralScore
                    }
                  }
                  onG1BonusClick = { value ->
                    setState {
                      if (questionState.scoreState.group1Score.bonus == value) {
                        questionState.scoreState.group1Score.bonus = 0
                      } else {
                        questionState.scoreState.group1Score.bonus = value
                      }
                    }
                  }
                  onMuVaradhaClick = {
                    setState {
                      selectedKuralMeaning =
                        if (selectedKuralMeaning.contains(KuralMeaning.MuVaradha)) {
                          val tempList =
                            selectedKuralMeaning.toMutableSet()
                          tempList.remove(KuralMeaning.MuVaradha)
                          tempList
                        } else {
                          val tempList =
                            selectedKuralMeaning.toMutableSet()
                          tempList.add(KuralMeaning.MuVaradha)
                          tempList
                        }
                    }
                  }
                  onSalamanPapaClick = {
                    setState {
                      selectedKuralMeaning =
                        if (selectedKuralMeaning.contains(KuralMeaning.SalamanPapa)) {
                          val tempList =
                            selectedKuralMeaning.toMutableSet()
                          tempList.remove(KuralMeaning.SalamanPapa)
                          tempList
                        } else {
                          val tempList =
                            selectedKuralMeaning.toMutableSet()
                          tempList.add(KuralMeaning.SalamanPapa)
                          tempList
                        }
                    }
                  }
                  onMuKarunanidhiClick = {
                    setState {
                      selectedKuralMeaning =
                        if (selectedKuralMeaning.contains(KuralMeaning.MuKarunanidhi)) {
                          val tempList =
                            selectedKuralMeaning.toMutableSet()
                          tempList.remove(KuralMeaning.MuKarunanidhi)
                          tempList
                        } else {
                          val tempList =
                            selectedKuralMeaning.toMutableSet()
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
      }
    }
  }

  private fun resetTimer(questionState: QuestionState, isLive: Boolean) {
    if (isLive) {
      onNextClickHandler(questionState)
    }
    questionState.timerState = TimerState(isLive = isLive)
    questionState.athikaramState = AthikaramState(questionState.round2Kurals)
    questionState.kuralState = ThirukkuralState(questionState.round2Kurals)
    questionState.porulState = ThirukkuralState(questionState.round2Kurals)
    questionState.firstWordState = FirstWordState(questionState.round2Kurals)
    questionState.lastWordState = LastWordState(questionState.round2Kurals)
    questionState.scoreState = ScoreState()
  }

  private fun onNextClickHandler(questionState: QuestionState) {
    when (questionState.selectedTopic) {
      Topic.Athikaram -> questionState.athikaramState.goNext()
      Topic.Kural -> questionState.kuralState.goNext()
      Topic.Porul -> questionState.porulState.goNext()
      Topic.FirstWord -> questionState.firstWordState.goNext()
      Topic.LastWord -> questionState.lastWordState.goNext()
    }
  }

  private fun onPreviousClickHandler(questionState: QuestionState) {
    when (questionState.selectedTopic) {
      Topic.Athikaram -> questionState.athikaramState.goPrevious()
      Topic.Kural -> questionState.kuralState.goPrevious()
      Topic.Porul -> questionState.porulState.goPrevious()
      Topic.FirstWord -> questionState.firstWordState.goPrevious()
      Topic.LastWord -> questionState.lastWordState.goPrevious()
    }
  }

  private fun onIndexClickHandler(questionState: QuestionState, index: Int) {
    when (questionState.selectedTopic) {
      Topic.Athikaram -> questionState.athikaramState.go(index)
      Topic.Kural -> questionState.kuralState.go(index)
      Topic.Porul -> questionState.porulState.go(index)
      Topic.FirstWord -> questionState.firstWordState.go(index)
      Topic.LastWord -> questionState.lastWordState.go(index)
    }
  }
}

fun RBuilder.competitionApp(handler: CompetitionAppProps.() -> Unit): ReactElement {
  return child(CompetitionApp::class) {
    this.attrs(handler)
  }
}
