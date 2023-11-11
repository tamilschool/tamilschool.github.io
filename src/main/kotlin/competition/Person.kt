package competition

import kotlinx.css.*
import react.*
import competition.round.firstRoundSimple
import competition.scoreCard.scoreInfo
import styled.css
import styled.styledDiv
import styled.styledImg

external interface PersonProps: RProps {
    var questionState: QuestionState
    var searchResultKural: Thirukkural?
    var onRoundClick: (Round) -> Unit
    var onTimerClick: () -> Unit
    var onTopicClick: (Topic) -> Unit
    var onNextClick: () -> Unit
    var onWrongClick: () -> Unit
    var onRightClick: () -> Unit
    var onPreviousClick: () -> Unit
    var onIndexClick: (Int) -> Unit
    var onSearchByKuralNoClick: (Int) -> Unit
    var onAddKuralClick: () -> Unit
    var onDeleteKuralClick: (Int) -> Unit
    var selectedKuralMeaning: Set<KuralMeaning>
    var onMuVaradhaClick: () -> Unit
    var onSalamanPapaClick: () -> Unit
    var onMuKarunanidhiClick: () -> Unit
    var onG1Click: (Int, Group1Round1Score) -> Unit
    var onG23Click: (Int, Group23Round1Score) -> Unit
    var onG1BonusClick: (Number) -> Unit
}

class Person : RComponent<PersonProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                height = 100.pct
                display = Display.flex
                flexDirection = FlexDirection.column
            }
            styledDiv {
                // Desktop
                css {
                    classes = mutableListOf("row ml-2")
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
            styledDiv {
                css {
                    classes = mutableListOf("row")
                    height = 100.pct
                    position = Position.relative
                }
                styledDiv {
                    css {
                        classes = mutableListOf("col-9")
                        height = 100.pct
                    }
                    if (props.questionState.selectedRound == Round.I) {
                        firstRoundSimple {
                            questionState = props.questionState
                            searchResultKural = props.searchResultKural
                            onSearchByKuralNoClick = props.onSearchByKuralNoClick
                            onAddKuralClick = props.onAddKuralClick
                            onDeleteKuralClick = props.onDeleteKuralClick
                            selectedKuralMeaning = props.selectedKuralMeaning
                            onMuVaradhaClick = props.onMuVaradhaClick
                            onSalamanPapaClick = props.onSalamanPapaClick
                            onMuKarunanidhiClick = props.onMuKarunanidhiClick
                            onG1Click = props.onG1Click
                            onG23Click = props.onG23Click
                            onG1BonusClick = props.onG1BonusClick
                        }
                    } else {
                        if (props.questionState.timerState.isLive) {
                            topicContent {
                                questionState = props.questionState
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
                styledDiv {
                    css {
                        classes = mutableListOf("col-3")
                    }
                    scoreInfo {
                        questionState = props.questionState
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
