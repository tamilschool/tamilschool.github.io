package practice

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
import kotlinx.css.width
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv

external interface AllKuralsProps : RProps {
  var allThirukkurals: List<Thirukkural>
  var selectedKuralMeaning: Set<KuralMeaning>
  var onMuVaradhaClick: () -> Unit
  var onSalamanPapaClick: () -> Unit
  var onMuKarunanidhiClick: () -> Unit
}

class AllKurals : RComponent<AllKuralsProps, RState>() {
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
        kuralPorulSelection {
          buttonSize = 33.pct
          selectedKuralMeaning = props.selectedKuralMeaning
          onMuVaradhaClick = props.onMuVaradhaClick
          onSalamanPapaClick = props.onSalamanPapaClick
          onMuKarunanidhiClick = props.onMuKarunanidhiClick
        }
      }
      styledDiv {
        css {
          height = 100.pct
          position = Position.relative
        }
        multipleKuralDisplay {
          selectedThirukkurals = props.allThirukkurals
          selectedKuralMeaning = props.selectedKuralMeaning
          showAnswer = true
          style = "bg-light"
        }
      }
    }
  }
}

fun RBuilder.allKurals(handler: AllKuralsProps.() -> Unit): ReactElement {
  return child(AllKurals::class) {
    this.attrs(handler)
  }
}
