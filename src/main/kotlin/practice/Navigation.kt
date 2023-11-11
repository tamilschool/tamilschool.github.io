package practice

import kotlinx.css.LinearDimension
import kotlinx.css.width
import kotlinx.html.js.onClickFunction
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledButton
import styled.styledImg
import styled.styledSpan

external interface NavigationProps: RProps {
    var questionState: QuestionState
    var smallBtnWidth: LinearDimension
    var mediumBtnWidth: LinearDimension
    var largeBtnWidth: LinearDimension
    var onShowAnswerClick: () -> Unit
    var onTimerClick: () -> Unit
    var onPreviousClick: () -> Unit
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
            }
            val timerState = props.questionState.timerState
            when {
                timerState.isLive && timerState.isPaused -> +"${timerState.time / 60 % 60} : ${timerState.time % 60} "
                timerState.isLive && timerState.time <= 0 -> +"மீண்டும் "
                timerState.isLive -> +"${timerState.time / 60 % 60} : ${timerState.time % 60} "
                else -> +"தொடங்கு "
            }

            attrs {
                onClickFunction = {
                    props.onTimerClick()
                }
            }
            if (timerState.isLive) {
                styledSpan {
                    css {
                        classes = mutableListOf("badge badge-light")
                    }
                    +"${timerState.count}"
                }
            }
        }
        styledButton {
            css {
                classes = mutableListOf("btn btn-success mr-2 p-0")
                width = props.smallBtnWidth
                attrs {
                    disabled = props.questionState.timerState.time <= 0 || !props.questionState.timerState.isLive
                }
            }
            attrs {
                onClickFunction = {
                    props.onPreviousClick()
                }
            }
            styledImg {
                attrs.src = "svg/back.svg"
            }
        }
        styledButton {
            css {
                classes = mutableListOf("btn btn-danger mr-2")
                width = props.mediumBtnWidth
                attrs {
                    disabled = !props.questionState.timerState.isLive
                }
            }
            +"பதில்"
            attrs {
                onClickFunction = {
                    props.onShowAnswerClick()
                }
            }
        }
        styledButton {
            css {
                classes = mutableListOf("btn btn-success p-0")
                width = props.smallBtnWidth
                attrs {
                    disabled = props.questionState.timerState.time <= 0 || !props.questionState.timerState.isLive
                }
            }
            attrs {
                onClickFunction = {
                    props.onNextClick()
                }
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
