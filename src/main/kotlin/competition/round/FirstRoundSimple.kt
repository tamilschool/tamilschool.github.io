package competition.round

import competition.kuralPorulSelection
import competition.titleBar
import components.kuralDisplay
import data.CQuestionState
import data.Group1Round1Score
import data.Group23Round1Score
import data.KuralMeaning
import data.Round
import data.ScoreType
import data.Thirukkural
import data.Topic
import kotlinx.css.Overflow
import kotlinx.css.Position
import kotlinx.css.bottom
import kotlinx.css.height
import kotlinx.css.left
import kotlinx.css.overflowY
import kotlinx.css.pct
import kotlinx.css.position
import kotlinx.css.px
import kotlinx.css.right
import kotlinx.css.top
import kotlinx.css.width
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import react.key
import styled.css
import styled.styledButton
import styled.styledDiv

external interface FirstRoundSimpleProps : RProps {
  var questionState: CQuestionState
  var searchResultKural: Thirukkural?
  var selectedKuralMeaning: Set<KuralMeaning>
  var onMuVaradhaClick: () -> Unit
  var onSalamanPapaClick: () -> Unit
  var onMuKarunanidhiClick: () -> Unit
  var onSearchByKuralNoClick: (Int) -> Unit
  var onAddKuralClick: () -> Unit
  var onDeleteKuralClick: (Int) -> Unit
  var onG1Click: (Int, Group1Round1Score) -> Unit
  var onG23Click: (Int, Group23Round1Score) -> Unit
  var onG1BonusClick: (Number) -> Unit
  var onRoundClick: (Round) -> Unit
  var onTopicClick: (Topic) -> Unit
  var onTimerClick: () -> Unit
  var onPreviousClick: () -> Unit
  var onWrongClick: () -> Unit
  var onRightClick: () -> Unit
  var onNextClick: () -> Unit
  var onIndexClick: (Int) -> Unit
}

class FirstRoundSimple : RComponent<FirstRoundSimpleProps, RState>() {
  override fun RBuilder.render() {
    styledDiv {
      css {
        classes = mutableListOf("row m-0")
        height = 100.pct
      }
      styledDiv {
        css {
          classes = mutableListOf("col-5 p-0")
        }
        styledDiv {
          // Desktop
          css {
            classes = mutableListOf("")
          }
          titleBar {
            questionState = props.questionState
            firstRowStyle = "col pl-0 pr-0"
            personButtonWidth = 200.px
            topicButtonWidth = 200.px
            secondRowStyle = "col-md-auto pr-0"
            smallBtnWidth = 50.px
            mediumBtnWidth = 100.px
            largeBtnWidth = 160.px
            onRoundClick = props.onRoundClick
            onTopicClick = props.onTopicClick
            onTimerClick = props.onTimerClick
            onPreviousClick = props.onPreviousClick
            onWrongClick = props.onWrongClick
            onRightClick = props.onRightClick
            onNextClick = props.onNextClick
            onIndexClick = props.onIndexClick
          }
        }
        kuralPorulSelection {
          buttonSize = 33.pct
          selectedKuralMeaning = props.selectedKuralMeaning
          onMuVaradhaClick = props.onMuVaradhaClick
          onSalamanPapaClick = props.onSalamanPapaClick
          onMuKarunanidhiClick = props.onMuKarunanidhiClick
        }
        searchBasedOnNumber {
          questionState = props.questionState
          searchResultKural = props.searchResultKural
          onSearchByKuralNoClick = props.onSearchByKuralNoClick
          onAddKuralClick = props.onAddKuralClick
        }
        props.searchResultKural?.let { validKural ->
          kuralDisplay {
            selectedThirukkural = validKural
            selectedKuralMeaning = emptySet()
            style = "text-dark bg-warning"
          }
        }
        styledDiv {
          css {
            classes = mutableListOf("d-flex flex-wrap ")
          }
          for (kural in props.questionState.scoreState.group1Score.round1) {
            styledButton {
              css {
                val style =
                  if (kural.value.score.values.map { it }.sum() > 0) "btn-success"
                  else "btn-outline-success"
                classes = mutableListOf("btn $style m-1")
              }
              attrs {
                disabled = true
              }
              +"${kural.key}"
            }
          }
          for (kural in props.questionState.scoreState.group23Score.round1) {
            styledButton {
              css {
                val style =
                  if (kural.value.score.values.count { it } > 0) "btn-success" else "btn-outline-success"
                classes = mutableListOf("btn $style m-1")
              }
              attrs {
                disabled = true
              }
              +"${kural.key}"
            }
          }
        }
      }
      styledDiv {
        css {
          classes = mutableListOf("col-7 p-0")
          height = 100.pct
          width = 100.pct
        }
        styledDiv {
          css {
            classes = mutableListOf("ml-1 mr-1")
            height = 100.pct
            width = 100.pct
            position = Position.relative
          }
          styledDiv {
            css {
              position = Position.absolute
              top = 0.px
              bottom = 0.px
              left = 0.px
              right = 0.px
              overflowY = Overflow.auto
            }
            if (props.questionState.selectedGroup.type == ScoreType.PottiSuttru) {
              props.questionState.scoreState.group23Score.round1.values.forEach { score ->
                firstRoundKuralDisplay {
                  key = score.thirukkural.kuralNo.toString()
                  thirukkural = score.thirukkural
                  group23Round1Score = score
                  scoreType = props.questionState.selectedGroup.type
                  selectedKuralMeaning = props.selectedKuralMeaning
                  onDeleteKuralClick = props.onDeleteKuralClick
                  onG23Click = { type, value ->
                    score.score[type] = value
                    props.onG23Click(
                      score.thirukkural.kuralNo,
                      score
                    )
                  }
                }
              }
            } else {
              props.questionState.scoreState.group1Score.round1.values.forEach { score ->
                firstRoundKuralDisplay {
                  key = score.thirukkural.kuralNo.toString()
                  thirukkural = score.thirukkural
                  group1Round1Score = score
                  scoreType = props.questionState.selectedGroup.type
                  selectedKuralMeaning = props.selectedKuralMeaning
                  onDeleteKuralClick = props.onDeleteKuralClick
                  onG1Click = { type, value ->
                    if (score.score[type] == value) {
                      score.score[type] = 0F
                    } else {
                      score.score[type] = value as Float
                    }
                    props.onG1Click(score.thirukkural.kuralNo, score)
                  }
                }
              }
              if (props.questionState.scoreState.group1Score.round1.values.isNotEmpty()) {
                firstRoundRealWorldExample {
                  bonus = props.questionState.scoreState.group1Score.bonus
                  onG1BonusClick = props.onG1BonusClick
                }
              }
            }
          }
        }
      }
    }
  }
}

fun RBuilder.firstRoundSimple(handler: FirstRoundSimpleProps.() -> Unit): ReactElement {
  return child(FirstRoundSimple::class) {
    this.attrs(handler)
  }
}
