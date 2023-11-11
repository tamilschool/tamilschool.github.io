package competition

import kotlinx.css.*
import kotlinx.html.js.onClickFunction
import kotlinx.html.role
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.*

object ComponentStyles: StyleSheet("ComponentStyles", isStatic = true) {
    val rightRounded by css {
        borderTopRightRadius = 50.rem
        borderBottomRightRadius = 50.rem
    }
    val leftRounded by css {
        borderTopLeftRadius = 50.rem
        borderBottomLeftRadius = 50.rem
    }
}

external interface NavigationProps: RProps {
    var questionState: QuestionState
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
            }
            val timerState = props.questionState.timerState
            when {
                timerState.isLive && timerState.isPaused -> +"${timerState.time / 60 % 60} : ${timerState.time % 60} "
                timerState.isLive && timerState.time <= 0 -> +"மீண்டும் "
                timerState.isLive -> +"${timerState.time / 60 % 60} : ${timerState.time % 60} "
                else -> +"தொடங்கு "
            }

            attrs {
                onClickFunction = { props.onTimerClick() }
            }
            if (timerState.isLive) {
                styledSpan {
                    css {
                        classes = mutableListOf("badge badge-light")
                    }
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
                        disabled = !props.questionState.timerState.isLive || props.questionState.timerState.isPaused
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
                        disabled = !props.questionState.timerState.isLive || props.questionState.timerState.isPaused
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
                    disabled = props.questionState.timerState.time <= 0 || !props.questionState.timerState.isLive
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
