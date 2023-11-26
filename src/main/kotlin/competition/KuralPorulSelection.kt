package competition

import data.KuralMeaning
import kotlinx.css.LinearDimension
import kotlinx.css.height
import kotlinx.css.pct
import kotlinx.css.width
import kotlinx.html.js.onClickFunction
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledButton
import styled.styledDiv

external interface KuralPorulSelectionProps : RProps {
  var buttonSize: LinearDimension
  var selectedKuralMeaning: Set<KuralMeaning>
  var onMuVaradhaClick: () -> Unit
  var onSalamanPapaClick: () -> Unit
  var onMuKarunanidhiClick: () -> Unit
}

class KuralPorulSelection : RComponent<KuralPorulSelectionProps, RState>() {
  override fun RBuilder.render() {
    styledDiv {
      css {
        classes = mutableListOf("d-flex flex-row m-0")
      }
      val btnSize = if (props.buttonSize == 100.pct) "" else "btn-sm"

      styledButton {
        css {
          val btnStyle =
            if (props.selectedKuralMeaning.contains(KuralMeaning.MuVaradha)) "btn-success"
            else "btn btn-outline-success"
          classes = mutableListOf("btn $btnStyle $btnSize mr-2")
          width = props.buttonSize
          height = LinearDimension.inherit
        }
        +KuralMeaning.MuVaradha.tamil
        attrs {
          onClickFunction = {
            props.onMuVaradhaClick()
          }
        }
      }
      styledButton {
        css {
          val btnStyle =
            if (props.selectedKuralMeaning.contains(KuralMeaning.SalamanPapa)) "btn-success"
            else "btn btn-outline-success"
          classes = mutableListOf("btn $btnStyle $btnSize mr-2")
          width = props.buttonSize
          height = LinearDimension.inherit
        }
        +KuralMeaning.SalamanPapa.tamil
        attrs {
          onClickFunction = {
            props.onSalamanPapaClick()
          }
        }
      }
      styledButton {
        css {
          val btnStyle =
            if (props.selectedKuralMeaning.contains(KuralMeaning.MuKarunanidhi)) "btn-success"
            else "btn btn-outline-success"
          classes = mutableListOf("btn $btnSize $btnStyle")
          width = props.buttonSize
          height = LinearDimension.inherit
        }
        +KuralMeaning.MuKarunanidhi.tamil
        attrs {
          onClickFunction = {
            props.onMuKarunanidhiClick()
          }
        }
      }
    }
  }
}

fun RBuilder.kuralPorulSelection(handler: KuralPorulSelectionProps.() -> Unit): ReactElement {
  return child(KuralPorulSelection::class) {
    this.attrs(handler)
  }
}
