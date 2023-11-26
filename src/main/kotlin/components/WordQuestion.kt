package components

import data.KuralMeaning
import data.Thirukkural
import kotlinx.css.Display
import kotlinx.css.FlexDirection
import kotlinx.css.Position
import kotlinx.css.display
import kotlinx.css.flexDirection
import kotlinx.css.height
import kotlinx.css.pct
import kotlinx.css.position
import kotlinx.css.rem
import kotlinx.css.width
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv

external interface WordQuestionProps : RProps {
  var question: String
  var selectedThirukkurals: List<Thirukkural>
  var selectedKuralMeaning: Set<KuralMeaning>
  var showAnswer: Boolean
}

class WordQuestion : RComponent<WordQuestionProps, RState>() {
  override fun RBuilder.render() {
    styledDiv {
      css {
        height = 100.pct
        width = 100.pct
        display = Display.flex
        flexDirection = FlexDirection.column
      }
      styledDiv {
        css {
          classes = mutableListOf("row m-0")
          width = 100.pct
        }
        question {
          question = props.question
          fontSize = 1.1.rem
          isAnswered = false
        }
      }
      styledDiv {
        css {
          height = 100.pct
          position = Position.relative
        }
        multipleKuralDisplay {
          selectedThirukkurals = props.selectedThirukkurals
          selectedKuralMeaning = props.selectedKuralMeaning
          showAnswer = props.showAnswer
        }
      }
    }
  }
}

fun RBuilder.wordQuestion(handler: WordQuestionProps.() -> Unit): ReactElement {
  return child(WordQuestion::class) {
    this.attrs(handler)
  }
}
