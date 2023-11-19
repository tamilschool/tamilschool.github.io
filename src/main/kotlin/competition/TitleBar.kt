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
  var questionState: CQuestionState
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
  var onRoundClick: (CRound) -> Unit
  var onTopicClick: (CTopic) -> Unit
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
      if (props.questionState.selectedGroup.type == CScoreType.PottiSuttru) {
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
                for (round in CRound.values()) {
                  linkItem {
                    name = round.tamil
                    isActive = props.questionState.selectedRound == round
                    onClickFunction = { props.onRoundClick(round) }
                  }
                }
              }
            }
            if (props.questionState.selectedRound == CRound.II) {
              styledDiv {
                css {
                  classes = mutableListOf("btn-group")
                  props.topicButtonWidth?.let { width = it }
                }
                dropdown {
                  id = "topicDropDown"
                  names = listOf(
                    listOf(
                      CTopic.Athikaram.tamil,
                      CTopic.Porul.tamil,
                      CTopic.Kural.tamil,
                      CTopic.FirstWord.tamil,
                      CTopic.LastWord.tamil
                    ),
//                                listOf(Topic.AllKurals.tamil)
                  )
                  selectedName = props.questionState.selectedTopic.tamil
                  onDropdownClick = { _, name ->
                    props.onTopicClick(CTopic.getTopic(name))
                  }
                }
              }
            }
          }
          if (props.questionState.selectedRound == CRound.II) {
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
        if (props.questionState.selectedRound == CRound.II) {
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
                        CTopic.Athikaram -> props.questionState.athikaramState.index == index
                        CTopic.Kural -> props.questionState.kuralState.index == index
                        CTopic.Porul -> props.questionState.porulState.index == index
                        CTopic.FirstWord -> props.questionState.firstWordState.index == index
                        CTopic.LastWord -> props.questionState.lastWordState.index == index
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
