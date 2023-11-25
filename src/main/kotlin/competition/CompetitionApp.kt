package competition

import competition.group.groupSelection
import competition.signout.signOut
import competition.signout.signOutConfirm
import data.CAthikaramState
import data.CFirstWordState
import data.CLastWordState
import data.CQuestionState
import data.CThirukkuralState
import data.CTimerState
import data.Group
import data.Group1Round1Score
import data.Group23Round1Score
import data.KuralMeaning
import data.Round
import data.ScoreState
import data.ScoreType
import data.Thirukkural
import data.Topic
import data.account
import data.domain
import data.maxQuestions
import data.path
import kotlinx.browser.window
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.await
import kotlinx.coroutines.launch
import kotlinx.css.Position
import kotlinx.css.height
import kotlinx.css.pct
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
  var questionState: CQuestionState
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

  private fun createQuestionState(group: Group, thirukkurals: List<Thirukkural>): CQuestionState {
    val allKurals = thirukkurals.filter { it.group.contains(group) }
    val total = allKurals.size
//    println("Total Kurals: ${allKurals.size}")
//    play(allKurals)
//    play2(allKurals)
//    play3(allKurals)

    var remainingKurals = allKurals
    val lastWordState = CLastWordState(remainingKurals)
    remainingKurals = remainingKurals.filter { !lastWordState.targets.contains(it.words.last()) }
    val afterLastWord = remainingKurals.size

    val firstWordState = CFirstWordState(remainingKurals)
    remainingKurals = remainingKurals.filter { !firstWordState.targets.contains(it.words.first()) }
    val afterFirstWord = remainingKurals.size

    val kuralState = CThirukkuralState(remainingKurals)
    remainingKurals = remainingKurals.filter { !kuralState.targets.contains(it) }
    val afterKural = remainingKurals.size

    val porulState = CThirukkuralState(remainingKurals)
    remainingKurals = remainingKurals.filter { !porulState.targets.contains(it) }
    val afterPorul = remainingKurals.size

    val expAthikarams =
      remainingKurals.map { it.athikaram }.distinct().shuffled().take(maxQuestions)
    val athikaramState = CAthikaramState(allKurals, expAthikarams)
    remainingKurals = remainingKurals.filter { !athikaramState.targets.contains(it.athikaram) }
    val afterAthikaram = remainingKurals.size

    println(
      "Total: $total, Last: " +
          "${total - afterLastWord}, First: " +
          "${afterLastWord - afterFirstWord}, Kural: " +
          "${afterFirstWord - afterKural}, Porul: " +
          "${afterKural - afterPorul}, Athikaram: " +
          "${afterPorul - afterAthikaram}"
    )
    println("Remaining kurals : $afterAthikaram")

    return CQuestionState(
      selectedGroup = group,
      selectedRound = Round.I,
      selectedTopic = Topic.Athikaram,
      round2Kurals = allKurals,
      athikaramState = athikaramState,
      kuralState = kuralState,
      porulState = porulState,
      firstWordState = firstWordState,
      lastWordState = lastWordState,
      timerState = CTimerState(),
      scoreState = ScoreState()
    )
  }

  private fun play3(allKurals: List<Thirukkural>) {
    println("Total,Last,First,Kural,Porul,Athikaram,AfterLast,AfterFirst,AfterKural,AfterPorul,AfterAthikaram")
    for (i in 1..10000) {
      play2(allKurals)
    }
  }

  private fun play2(allKurals: List<Thirukkural>) {
    var remainingKurals = allKurals
    val total = allKurals.size

    val lastWordState = CLastWordState(remainingKurals)
    remainingKurals = remainingKurals.filter { !lastWordState.targets.contains(it.words.last()) }
//    println("Remaining Kurals after last word: ${remainingKurals.size}")
    val afterLastWord = remainingKurals.size

    val firstWordState = CFirstWordState(remainingKurals)
    remainingKurals = remainingKurals.filter { !firstWordState.targets.contains(it.words.first()) }
//    println("Remaining Kurals after first word: ${remainingKurals.size}")
    val afterFirstWord = remainingKurals.size

    val kuralState = CThirukkuralState(remainingKurals)
    remainingKurals = remainingKurals.filter { !kuralState.targets.contains(it) }
//    println("Remaining Kurals after kural: ${remainingKurals.size}")
    val afterKural = remainingKurals.size

    val porulState = CThirukkuralState(remainingKurals)
    remainingKurals = remainingKurals.filter { !porulState.targets.contains(it) }
//    println("Remaining Kurals after porul: ${remainingKurals.size}")
    val afterPorul = remainingKurals.size

    val expAthikarams =
      remainingKurals.map { it.athikaram }.distinct().shuffled().take(maxQuestions)
//    println("Expected Athikarams: ${expAthikarams.size}")

    val athikaramState = CAthikaramState(allKurals, expAthikarams)
    remainingKurals = remainingKurals.filter { !athikaramState.targets.contains(it.athikaram) }
//    println("Remaining Kurals after athikaram: ${remainingKurals.size}")
    val afterAthikaram = remainingKurals.size
//    println("Total: $total, [${total - afterFirstWord}]-last: $afterLastWord, afterFirstWord: $afterFirstWord, afterKural: $afterKural, afterPorul: $afterPorul, afterAthikaram: $afterAthikaram")
    println(
      "$total," +
          "${total - afterLastWord}," +
          "${afterLastWord - afterFirstWord}," +
          "${afterFirstWord - afterKural}," +
          "${afterKural - afterPorul}," +
          "${afterPorul - afterAthikaram}," +
          "$afterLastWord,$afterFirstWord,$afterKural,$afterPorul,$afterAthikaram"
    )
  }

  private fun play(kurals: List<Thirukkural>) {
    println("Last Words")
    var remaining = kurals
    println("Total Kurals: ${remaining.size}")
    val lastWordMap: Map<String, List<Thirukkural>> = kurals.map { it.words.last() }
      .distinct()
      .map { it to kurals.filter { kural -> kural.words.last() == it } }
      .sortedByDescending { it.second.size }
      .take(maxQuestions)
      .toMap()

    lastWordMap.forEach { (word, kurals) ->
      println("$word: ${kurals.size}")
    }
    remaining = remaining.filter { !lastWordMap.keys.contains(it.words.last()) }
    println("Remaining Kurals after last word: ${remaining.size}")

    println("First Words")
    val firstWordMap: Map<String, List<Thirukkural>> = remaining.map { it.words.first() }
      .distinct()
      .map { it to remaining.filter { kural -> kural.words.first() == it } }
      .sortedByDescending { it.second.size }
      .take(maxQuestions)
      .toMap()

    firstWordMap.forEach { (word, kurals) ->
      println("$word: ${kurals.size}")
    }
    remaining = remaining.filter { !firstWordMap.keys.contains(it.words.first()) }
    println("Remaining Kurals after first word: ${remaining.size}")

    println("Athiraram")
    val athikaramMap: Map<String, List<Thirukkural>> = remaining.map { it.athikaram }
      .distinct()
      .map { it to remaining.filter { kural -> kural.athikaram == it } }
      .sortedByDescending { it.second.size }
      .take(maxQuestions)
      .toMap()

    athikaramMap.forEach { (word, kurals) ->
      println("$word: ${kurals.size}")
    }
    remaining = remaining.filter { !athikaramMap.keys.contains(it.athikaram) }
    println("Remaining Kurals after athikaram: ${remaining.size}")

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
    styledDiv {
      css {
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
          styledDiv {
            css {
              classes = mutableListOf("container-lg pl-0 pr-0")
              css {
                height = 100.pct
                position = Position.relative
              }
            }
            groupSelection {
              onGroupClick = { group ->
                setState {
                  questionState = createQuestionState(group, allKurals)
                  activeGroup = group
                }
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

  private fun onNextClickHandler(questionState: CQuestionState) {
    when (questionState.selectedTopic) {
      Topic.Athikaram -> questionState.athikaramState.goNext()
      Topic.Kural -> questionState.kuralState.goNext()
      Topic.Porul -> questionState.porulState.goNext()
      Topic.FirstWord -> questionState.firstWordState.goNext()
      Topic.LastWord -> questionState.lastWordState.goNext()
      Topic.AllKurals -> {}
    }
  }

  private fun onPreviousClickHandler(questionState: CQuestionState) {
    when (questionState.selectedTopic) {
      Topic.Athikaram -> questionState.athikaramState.goPrevious()
      Topic.Kural -> questionState.kuralState.goPrevious()
      Topic.Porul -> questionState.porulState.goPrevious()
      Topic.FirstWord -> questionState.firstWordState.goPrevious()
      Topic.LastWord -> questionState.lastWordState.goPrevious()
      Topic.AllKurals -> {}
    }
  }

  private fun onIndexClickHandler(questionState: CQuestionState, index: Int) {
    when (questionState.selectedTopic) {
      Topic.Athikaram -> questionState.athikaramState.go(index)
      Topic.Kural -> questionState.kuralState.go(index)
      Topic.Porul -> questionState.porulState.go(index)
      Topic.FirstWord -> questionState.firstWordState.go(index)
      Topic.LastWord -> questionState.lastWordState.go(index)
      Topic.AllKurals -> {}
    }
  }
}

fun RBuilder.competitionApp(handler: CompetitionAppProps.() -> Unit): ReactElement {
  return child(CompetitionApp::class) {
    this.attrs(handler)
  }
}
