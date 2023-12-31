package competition

import data.CQuestionState
import kotlinx.css.LinearDimension
import kotlinx.css.borderBottomLeftRadius
import kotlinx.css.borderBottomRightRadius
import kotlinx.css.borderTopLeftRadius
import kotlinx.css.borderTopRightRadius
import kotlinx.css.px
import kotlinx.css.rem
import kotlinx.css.width
import kotlinx.html.js.onClickFunction
import kotlinx.html.role
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.StyleSheet
import styled.css
import styled.styledButton
import styled.styledDiv
import styled.styledImg

object ComponentStyles : StyleSheet("ComponentStyles", isStatic = true) {
  val rightRounded by css {
    borderTopRightRadius = 50.rem
    borderBottomRightRadius = 50.rem
  }
  val leftRounded by css {
    borderTopLeftRadius = 50.rem
    borderBottomLeftRadius = 50.rem
  }
}

external interface NavigationProps : RProps {
  var questionState: CQuestionState
  var smallBtnWidth: LinearDimension
  var mediumBtnWidth: LinearDimension
  var largeBtnWidth: LinearDimension
  var onTimerClick: () -> Unit
  var onPreviousClick: () -> Unit
  var onWrongClick: () -> Unit
  var onRightClick: () -> Unit
  var onNextClick: () -> Unit
}

class Navigation : RComponent<NavigationProps, RState>() {
  override fun RBuilder.render() {
    styledButton {
      css {
        val style = when {
          props.questionState.timerState.isLive && props.questionState.timerState.time == 0L -> "danger"
          props.questionState.timerState.isPaused -> "secondary"
          else -> "success"
        }
        classes = mutableListOf("btn btn-$style mr-2")
        width = props.largeBtnWidth
        attrs {
          disabled = props.questionState.timerState.time <= 0
        }
      }
      val timerState = props.questionState.timerState
      val seconds =
        if (timerState.time % 60 < 10) "0" + timerState.time % 60 else timerState.time % 60
      when {
        timerState.isLive && timerState.isPaused -> +"தொடர் [${timerState.time / 60 % 60} : $seconds]"
        timerState.isLive -> +"${timerState.time / 60 % 60} : $seconds "
        else -> +"தொடங்கு"
      }
      attrs {
        onClickFunction = { props.onTimerClick() }
      }
    }
    styledButton {
      css {
        classes = mutableListOf("btn btn-success mr-2 p-0")
        width = props.smallBtnWidth
        attrs {
          disabled =
            props.questionState.timerState.time <= 0 || !props.questionState.timerState.isLive
        }
      }
      attrs {
        onClickFunction = { props.onPreviousClick() }
      }
      styledImg {
        attrs.src = "svg/back.svg"
      }
    }
    styledDiv {
      css {
        classes = mutableListOf("btn-group")
        attrs {
          role = "group"
        }
      }
      styledButton {
        css {
          val selectedStyle = if (props.questionState.isAnswered()) "" else "active"
          classes = mutableListOf("btn btn-outline-danger $selectedStyle")
          width = 80.px
          +ComponentStyles.leftRounded
          attrs {
            disabled = !props.questionState.timerState.isLive
                || props.questionState.timerState.isPaused
                || props.questionState.maxQuestionsAnswered()
          }
        }
        attrs {
          onClickFunction = { props.onWrongClick() }
        }
        +"தவறு"
      }
      styledButton {
        css {
          val selectedStyle = if (props.questionState.isAnswered()) "active" else ""
          classes = mutableListOf("btn btn-outline-success mr-2  $selectedStyle")
          +ComponentStyles.rightRounded
          width = 80.px
          attrs {
            disabled = !props.questionState.timerState.isLive
                || props.questionState.timerState.isPaused
                || props.questionState.maxQuestionsAnswered()
          }
        }
        attrs {
          onClickFunction = { props.onRightClick() }
        }
        +"சரி"
      }
    }
    styledButton {
      css {
        classes = mutableListOf("btn btn-success p-0")
        width = props.smallBtnWidth
        attrs {
          disabled =
            props.questionState.timerState.time <= 0 || !props.questionState.timerState.isLive
        }
      }
      attrs {
        onClickFunction = { props.onNextClick() }
      }
      styledImg {
        attrs.src = "svg/next.svg"
      }
    }
  }
}

fun RBuilder.navigation(handler: NavigationProps.() -> Unit): ReactElement {
  return child(Navigation::class) {
    this.attrs(handler)
  }
}
