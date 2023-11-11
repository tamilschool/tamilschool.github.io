package competition.round

import competition.Group1Round1Score
import competition.Group23Round1Score
import competition.KuralMeaning
import competition.QuestionState
import competition.ScoreType
import competition.Thirukkural
import kotlinx.css.*
import competition.kuralDisplay
import competition.kuralPorulSelection
import react.*
import styled.css
import styled.styledButton
import styled.styledDiv

external interface FirstRoundSimpleProps : RProps {
    var questionState: QuestionState
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
}

class FirstRoundSimple : RComponent<FirstRoundSimpleProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                height = 100.pct
                display = Display.flex
                flexDirection = FlexDirection.column
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
                    style = "text-dark bg-warning"
                }
            }
            styledDiv {
                css {
                    classes = mutableListOf("d-flex flex-wrap")
                }
                for (kural in props.questionState.scoreState.group1Score.round1) {
                    styledButton {
                        css {
                            val style = if (kural.value.score.values.map { it.toFloat() }.sum() > 0) "btn-success" else "btn-outline-success"
                            classes = mutableListOf("btn $style m-2")
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
                            classes = mutableListOf("btn $style m-2")
                        }
                        attrs {
                            disabled = true
                        }
                        +"${kural.key}"
                    }
                }
            }
            styledDiv {
                css {
                    height = 100.pct
                    position = Position.relative
                }
                styledDiv {
                    css {
                        position = Position.absolute
                        top = 0.px
                        bottom = 0.px
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
                                        score.score[type] = 0
                                    } else {
                                        score.score[type] = value
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

fun RBuilder.firstRoundSimple(handler: FirstRoundSimpleProps.() -> Unit): ReactElement {
    return child(FirstRoundSimple::class) {
        this.attrs(handler)
    }
}
