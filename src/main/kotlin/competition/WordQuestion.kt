package competition

import kotlinx.css.rem
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface WordQuestionProps: RProps {
    var question: String
    var isAnswered: Boolean
    var selectedThirukkurals: List<Thirukkural>
}

class WordQuestion : RComponent<WordQuestionProps, RState>() {
    override fun RBuilder.render() {
        question {
            question = props.question
            fontSize = 1.1.rem
            isAnswered = props.isAnswered
        }
        props.selectedThirukkurals.forEach { thirukkural ->
            kuralDisplay {
                selectedThirukkural = thirukkural
                showMeaning = false
            }
        }
    }
}

fun RBuilder.wordQuestion(handler: WordQuestionProps.() -> Unit): ReactElement {
    return child(WordQuestion::class) {
        this.attrs(handler)
    }
}
