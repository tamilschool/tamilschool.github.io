package practice

import data.KuralMeaning
import data.Thirukkural
import components.multipleKuralDisplay
import kotlinx.css.Display
import kotlinx.css.FlexDirection
import kotlinx.css.Position
import kotlinx.css.display
import kotlinx.css.flexDirection
import kotlinx.css.height
import kotlinx.css.pct
import kotlinx.css.position
import kotlinx.css.width
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv

external interface KuralProps : RProps {
  var selectedThirukkural: Thirukkural
  var selectedKuralMeaning: Set<KuralMeaning>
  var showAnswer: Boolean
}

class Kural : RComponent<KuralProps, RState>() {
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
        questionMultiline {
          question = props.selectedThirukkural.kural
        }
      }
      styledDiv {
        css {
          height = 100.pct
          position = Position.relative
        }
        multipleKuralDisplay {
          selectedThirukkurals = listOf(props.selectedThirukkural)
          selectedKuralMeaning = props.selectedKuralMeaning
          showAnswer = props.showAnswer
        }
      }
    }
  }
}

fun RBuilder.kural(handler: KuralProps.() -> Unit): ReactElement {
  return child(Kural::class) {
    this.attrs(handler)
  }
}
