package practice

import kotlinx.css.LinearDimension
import kotlinx.css.pct
import kotlinx.css.width
import kotlinx.html.role
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv
import styled.styledUl

external interface TitleBarProps: RProps {
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
    var onGroupClick: (Group) -> Unit
    var onTopicClick: (Topic) -> Unit
    var onTimerClick: () -> Unit
    var onPreviousClick: () -> Unit
    var onShowAnswerClick: () -> Unit
    var onNextClick: () -> Unit
}

class TitleBar : RComponent<TitleBarProps, RState>() {
    override fun RBuilder.render() {
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
                        linkItem {
                            name = Group.II.tamilDisplay
                            isActive = props.questionState.selectedGroup == Group.II
                            onClickFunction = { props.onGroupClick(Group.II) }
                        }
                        linkItem {
                            name = Group.III.tamilDisplay
                            isActive = props.questionState.selectedGroup == Group.III
                            onClickFunction = { props.onGroupClick(Group.III) }
                        }
                    }
//                    dropdown {
//                        id = "groupDropDown"
//                        names = listOf(listOf(Group.II.tamilDisplay, Group.III.tamilDisplay))
//                        selectedName = props.questionState.selectedGroup.tamilDisplay
//                        onDropdownClick = { _, name -> props.onGroupClick(Group.getGroupForTamil(name)) }
//                    }
                }
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
                            listOf(Topic.AllKurals.tamil)
                        )
                        selectedName = props.questionState.selectedTopic.tamil
                        onDropdownClick = { _, name ->
                            props.onTopicClick(Topic.getTopic(name))
                        }
                    }
                }
            }
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
                    when (props.questionState.selectedTopic) {
                        Topic.AllKurals -> {
                        }
                        else -> {
                            navigation {
                                smallBtnWidth = props.smallBtnWidth
                                mediumBtnWidth = props.mediumBtnWidth
                                largeBtnWidth = props.largeBtnWidth
                                questionState = props.questionState
                                onShowAnswerClick = props.onShowAnswerClick
                                onPreviousClick = props.onPreviousClick
                                onNextClick = props.onNextClick
                                onTimerClick = props.onTimerClick
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
