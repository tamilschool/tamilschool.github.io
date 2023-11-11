package practice

import kotlinx.css.pct
import kotlinx.css.px
import kotlinx.css.width
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv
import styled.styledImg

external interface PersonProps: RProps {
    var questionState: QuestionState
    var onGroupClick: (Group) -> Unit
    var onShowAnswerClick: () -> Unit
    var onTimerClick: () -> Unit
    var onTopicClick: (Topic) -> Unit
    var onNextClick: () -> Unit
    var onPreviousClick: () -> Unit
    var selectedKuralMeaning: Set<KuralMeaning>
    var onMuVaradhaClick: () -> Unit
    var onSalamanPapaClick: () -> Unit
    var onMuKarunanidhiClick: () -> Unit
}

class Person : RComponent<PersonProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            // Desktop
            css {
                classes = mutableListOf("d-none d-lg-block")
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
                onGroupClick = props.onGroupClick
                onTopicClick = props.onTopicClick
                onTimerClick = props.onTimerClick
                onPreviousClick = props.onPreviousClick
                onShowAnswerClick = props.onShowAnswerClick
                onNextClick = props.onNextClick
            }
        }
        styledDiv {
            // Mobile
            css {
                classes = mutableListOf("d-block d-lg-none")
            }
            titleBar {
                questionState = props.questionState
                firstRowStyle = "d-flex flex-row"
                firstRowWidth = 100.pct
                personButtonWidth = 100.pct
                topicButtonWidth = 100.pct
                secondOptionalRowStyle = "d-flex flex-row mt-2"
                secondRowStyle = "d-flex flex-row"
                secondRowWidth = 100.pct
                allKuralsWidth = 100.pct
                smallBtnWidth = 50.px
                mediumBtnWidth = 100.pct
                largeBtnWidth = 100.pct
                onGroupClick = props.onGroupClick
                onTopicClick = props.onTopicClick
                onTimerClick = props.onTimerClick
                onPreviousClick = props.onPreviousClick
                onShowAnswerClick = props.onShowAnswerClick
                onNextClick = props.onNextClick
            }
        }
        if (props.questionState.timerState.isLive || props.questionState.selectedTopic == Topic.AllKurals) {
            topicContent {
                questionState = props.questionState
                selectedKuralMeaning = props.selectedKuralMeaning
                onMuVaradhaClick = props.onMuVaradhaClick
                onSalamanPapaClick = props.onSalamanPapaClick
                onMuKarunanidhiClick = props.onMuKarunanidhiClick
            }
        } else {
            styledDiv {
                css {
                    classes = mutableListOf("m-2")
                }
                styledImg {
                    attrs.src = "img/thiruvalluvar.jpg"
                    css {
                        width = 100.pct
                    }
                }
            }
        }
    }
}

fun RBuilder.person(handler: PersonProps.() -> Unit): ReactElement {
    return child(Person::class) {
        this.attrs(handler)
    }
}
