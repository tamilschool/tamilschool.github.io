package practice

import kotlinx.css.pct
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface TopicPros: RProps {
    var questionState: QuestionState
    var selectedKuralMeaning: Set<KuralMeaning>
    var onMuVaradhaClick: () -> Unit
    var onSalamanPapaClick: () -> Unit
    var onMuKarunanidhiClick: () -> Unit
}

class TopicContent: RComponent<TopicPros, RState>() {
    override fun RBuilder.render() {
        when (props.questionState.selectedTopic) {
            Topic.Athikaram -> {
                wordQuestion {
                    question = props.questionState.athikaramState.getCurrent()
                    selectedThirukkurals = props.questionState.athikaramState.getAnswers()
                    selectedKuralMeaning = props.selectedKuralMeaning
                    showAnswer = props.questionState.showAnswer
                }
            }
            Topic.Porul -> {
                kuralPorul {
                    selectedThirukkural = props.questionState.thirukkuralState.getCurrent()
                    showAnswer = props.questionState.showAnswer
                    buttonSize = 33.pct
                    selectedKuralMeaning = props.selectedKuralMeaning
                    onMuVaradhaClick = props.onMuVaradhaClick
                    onSalamanPapaClick = props.onSalamanPapaClick
                    onMuKarunanidhiClick = props.onMuKarunanidhiClick
                }
            }
            Topic.Kural -> {
                kural {
                    selectedThirukkural = props.questionState.thirukkuralState.getCurrent()
                    showAnswer = props.questionState.showAnswer
                    selectedKuralMeaning = props.selectedKuralMeaning
                }
            }
            Topic.FirstWord -> {
                wordQuestion {
                    question = props.questionState.firstWordState.getCurrent()
                    selectedThirukkurals = props.questionState.firstWordState.getAnswers()
                    selectedKuralMeaning = props.selectedKuralMeaning
                    showAnswer = props.questionState.showAnswer
                }
            }
            Topic.LastWord -> {
                wordQuestion {
                    question = props.questionState.lastWordState.getCurrent()
                    selectedThirukkurals = props.questionState.lastWordState.getAnswers()
                    selectedKuralMeaning = props.selectedKuralMeaning
                    showAnswer = props.questionState.showAnswer
                }
            }
            Topic.AllKurals -> {
                allKurals {
                    allThirukkurals = props.questionState.thirukkurals
                    selectedKuralMeaning = props.selectedKuralMeaning
                    onMuVaradhaClick = props.onMuVaradhaClick
                    onSalamanPapaClick = props.onSalamanPapaClick
                    onMuKarunanidhiClick = props.onMuKarunanidhiClick
                }
            }
        }
    }
}

fun RBuilder.topicContent(handler: TopicPros.() -> Unit): ReactElement {
    return child(TopicContent::class) {
        this.attrs(handler)
    }
}
