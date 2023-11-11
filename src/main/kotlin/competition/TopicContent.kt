package competition

import kotlinx.css.pct
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface TopicPros: RProps {
    var questionState: QuestionState
}

class TopicContent: RComponent<TopicPros, RState>() {
    override fun RBuilder.render() {
        when (props.questionState.selectedTopic) {
            Topic.Athikaram -> {
                wordQuestion {
                    question = props.questionState.athikaramState.getCurrent()
                    isAnswered = props.questionState.isAnswered()
                    selectedThirukkurals = props.questionState.round2Kurals.filter { it.athikaram == question }
                }
            }
            Topic.Porul -> {
                kuralPorul {
                    selectedThirukkural = props.questionState.porulState.getCurrent()
                    buttonSize = 33.pct
                    isAnswered = props.questionState.isAnswered()
                }
            }
            Topic.Kural -> {
                kural {
                    selectedThirukkural = props.questionState.kuralState.getCurrent()
                    isAnswered = props.questionState.isAnswered()
                }
            }
            Topic.FirstWord -> {
                wordQuestion {
                    question = props.questionState.firstWordState.getCurrent()
                    isAnswered = props.questionState.isAnswered()
                    selectedThirukkurals = props.questionState.round2Kurals.filter { it.words.first() == question }
                }
            }
            Topic.LastWord -> {
                wordQuestion {
                    question = props.questionState.lastWordState.getCurrent()
                    isAnswered = props.questionState.isAnswered()
                    selectedThirukkurals = props.questionState.round2Kurals.filter { it.words.last() == question }
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
