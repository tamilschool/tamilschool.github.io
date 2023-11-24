package practice

import data.KuralMeaning
import data.Thirukkural
import kotlinx.css.Overflow
import kotlinx.css.Position
import kotlinx.css.bottom
import kotlinx.css.left
import kotlinx.css.overflowY
import kotlinx.css.position
import kotlinx.css.px
import kotlinx.css.right
import kotlinx.css.top
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv

external interface MultipleKuralDisplayProps : RProps {
  var selectedThirukkurals: List<Thirukkural>
  var selectedKuralMeaning: Set<KuralMeaning>
  var showAnswer: Boolean
  var style: String?
}

class MultipleKuralDisplay : RComponent<MultipleKuralDisplayProps, RState>() {
  override fun RBuilder.render() {
    if (props.showAnswer) {
      styledDiv {
        css {
          position = Position.absolute
          top = 0.px
          right = 0.px
          left = 0.px
          bottom = 0.px
          overflowY = Overflow.auto
        }
        props.selectedThirukkurals.forEach { thirukkural ->
          kuralDisplay {
            selectedThirukkural = thirukkural
            selectedKuralMeaning = props.selectedKuralMeaning
            style = props.style
          }
        }
      }
    }
  }
}

fun RBuilder.multipleKuralDisplay(handler: MultipleKuralDisplayProps.() -> Unit): ReactElement {
  return child(MultipleKuralDisplay::class) {
    this.attrs(handler)
  }
}
