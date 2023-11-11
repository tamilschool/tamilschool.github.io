package competition

import kotlinx.css.LinearDimension
import kotlinx.css.pct
import kotlinx.css.width
import kotlinx.html.js.onClickFunction
import kotlinx.html.role
import react.*
import styled.css
import styled.styledButton
import styled.styledDiv
import styled.styledUl

external interface TitleBarProps : RProps {
  var questionState: QuestionState
  var firstRowStyle: String
  var firstRowWidth: LinearDimension?
  var personButtonWidth: LinearDimension?
  var topicButtonWidth: LinearDimension?
  var secondOptionalRowStyle: String?
  var secondRowStyle: String
  var secondRowWidth: LinearDimension?
  var allKuralsWidth: LinearDimension?
  var smallBtnWidth: LinearDimension
  var mediumBtnWidth: LinearDimension
  var largeBtnWidth: LinearDimension
  var onRoundClick: (Round) -> Unit
  var onTopicClick: (Topic) -> Unit
  var onTimerClick: () -> Unit
  var onPreviousClick: () -> Unit
  var onWrongClick: () -> Unit
  var onRightClick: () -> Unit
  var onNextClick: () -> Unit
  var onIndexClick: (Int) -> Unit
}

class TitleBar : RComponent<TitleBarProps, RState>() {
  override fun RBuilder.render() {
    styledDiv {
      if (props.questionState.selectedGroup.type == ScoreType.PottiSuttru) {
        styledDiv {
          css {
            classes = mutableListOf("row m-2")
          }
          styledDiv {
            css {
              classes = mutableListOf(props.firstRowStyle)
              props.firstRowWidth?.let { width = it }
            }
            styledDiv {
              css {
                classes = mutableListOf("btn-group mr-2")
                props.personButtonWidth?.let { width = it }
              }
              styledUl {
                css {
                  classes = mutableListOf("nav bg-light nav-pills nav-fill")
                  width = 100.pct
                  attrs {
                    role = "tablist"
                  }
                }
                for (round in Round.values()) {
                  linkItem {
                    name = round.tamil
                    isActive = props.questionState.selectedRound == round
                    onClickFunction = { props.onRoundClick(round) }
                  }
                }
              }
            }
            if (props.questionState.selectedRound == Round.II) {
              styledDiv {
                css {
                  classes = mutableListOf("btn-group")
                  props.topicButtonWidth?.let { width = it }
                }
                dropdown {
                  id = "topicDropDown"
                  names = listOf(
                    listOf(
                      Topic.Athikaram.tamil,
                      Topic.Porul.tamil,
                      Topic.Kural.tamil,
                      Topic.FirstWord.tamil,
                      Topic.LastWord.tamil
                    ),
//                                listOf(Topic.AllKurals.tamil)
                  )
                  selectedName = props.questionState.selectedTopic.tamil
                  onDropdownClick = { _, name ->
                    props.onTopicClick(Topic.getTopic(name))
                  }
                }
              }
            }
          }
          if (props.questionState.selectedRound == Round.II) {
            styledDiv {
              css {
                props.secondOptionalRowStyle?.let { classes = mutableListOf(it) }
                props.secondRowWidth?.let { width = it }
              }
              styledDiv {
                css {
                  classes = mutableListOf(props.secondRowStyle)
                  props.secondRowWidth?.let { width = it }
                }
                navigation {
                  smallBtnWidth = props.smallBtnWidth
                  mediumBtnWidth = props.mediumBtnWidth
                  largeBtnWidth = props.largeBtnWidth
                  questionState = props.questionState
                  onPreviousClick = props.onPreviousClick
                  onWrongClick = props.onWrongClick
                  onRightClick = props.onRightClick
                  onNextClick = props.onNextClick
                  onTimerClick = props.onTimerClick
                }
              }
            }
          }
        }
        if (props.questionState.selectedRound == Round.II) {
          if (props.questionState.timerState.isLive) {
            styledDiv {
              css {
                classes = mutableListOf("row m-2")
              }
              styledDiv {
                css {
                  classes = mutableListOf("btn-group")
                  width = 100.pct
                }
                for (index in 0..9) {
                  styledButton {
                    css {
                      val isActive = when (props.questionState.selectedTopic) {
                        Topic.Athikaram -> props.questionState.athikaramState.index == index
                        Topic.Kural -> props.questionState.kuralState.index == index
                        Topic.Porul -> props.questionState.porulState.index == index
                        Topic.FirstWord -> props.questionState.firstWordState.index == index
                        Topic.LastWord -> props.questionState.lastWordState.index == index
                      }
                      val style = when {
                        isActive -> "primary"
                        props.questionState.isAnswered(index) -> "success"
                        else -> "outline-primary"
                      }
                      classes = mutableListOf("btn btn-$style")
                    }
                    attrs {
                      onClickFunction = { props.onIndexClick(index) }
                    }
                    +((index + 1).toString())
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

fun RBuilder.titleBar(handler: TitleBarProps.() -> Unit): ReactElement {
  return child(TitleBar::class) {
    this.attrs(handler)
  }
}
