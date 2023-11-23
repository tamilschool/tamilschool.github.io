package practice

import data.KuralMeaning
import data.Thirukkural
import kotlinx.css.rem
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface WordQuestionProps : RProps {
  var question: String
  var selectedThirukkurals: List<Thirukkural>
  var selectedKuralMeaning: Set<KuralMeaning>
  var showAnswer: Boolean
}

class WordQuestion : RComponent<WordQuestionProps, RState>() {
  override fun RBuilder.render() {
    question {
      question = props.question
      fontSize = 1.1.rem
    }
    multipleKuralDisplay {
      selectedThirukkurals = props.selectedThirukkurals
      selectedKuralMeaning = props.selectedKuralMeaning
      showAnswer = props.showAnswer
    }
  }
}

fun RBuilder.wordQuestion(handler: WordQuestionProps.() -> Unit): ReactElement {
  return child(WordQuestion::class) {
    this.attrs(handler)
  }
}
