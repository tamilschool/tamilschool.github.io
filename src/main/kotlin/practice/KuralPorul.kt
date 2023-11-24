package practice

import data.KuralMeaning
import data.Thirukkural
import kotlinx.css.Display
import kotlinx.css.FlexDirection
import kotlinx.css.LinearDimension
import kotlinx.css.Overflow
import kotlinx.css.Position
import kotlinx.css.bottom
import kotlinx.css.display
import kotlinx.css.flexDirection
import kotlinx.css.height
import kotlinx.css.left
import kotlinx.css.overflowY
import kotlinx.css.pct
import kotlinx.css.position
import kotlinx.css.px
import kotlinx.css.rem
import kotlinx.css.right
import kotlinx.css.top
import kotlinx.css.width
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv

external interface KuralPorulProps : RProps {
  var selectedThirukkural: Thirukkural
  var showAnswer: Boolean
  var buttonSize: LinearDimension
  var selectedKuralMeaning: Set<KuralMeaning>
  var onMuVaradhaClick: () -> Unit
  var onSalamanPapaClick: () -> Unit
  var onMuKarunanidhiClick: () -> Unit
}

class KuralPorul : RComponent<KuralPorulProps, RState>() {
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
          buttonSize = props.buttonSize
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
        styledDiv {
          css {
            width = 100.pct
            position = Position.absolute
            top = 0.px
            right = 0.px
            left = 0.px
            bottom = 0.px
            overflowY = Overflow.auto
          }
          props.selectedKuralMeaning.forEach {
            questionWithName {
              question = it.getMeaning(props.selectedThirukkural)
              name = it.tamil
              fontSize = 1.1.rem
            }
          }
          if (props.showAnswer) {
            kuralDisplay {
              selectedThirukkural = props.selectedThirukkural
              selectedKuralMeaning = props.selectedKuralMeaning
            }
          }
        }
      }
    }
  }
}

fun RBuilder.kuralPorul(handler: KuralPorulProps.() -> Unit): ReactElement {
  return child(KuralPorul::class) {
    this.attrs(handler)
  }
}
