package practice

import data.KuralMeaning
import data.Thirukkural
import kotlinx.css.pct
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface AllKuralsProps : RProps {
  var allThirukkurals: List<Thirukkural>
  var selectedKuralMeaning: Set<KuralMeaning>
  var onMuVaradhaClick: () -> Unit
  var onSalamanPapaClick: () -> Unit
  var onMuKarunanidhiClick: () -> Unit
}

class AllKurals : RComponent<AllKuralsProps, RState>() {
  override fun RBuilder.render() {
    kuralPorulSelection {
      buttonSize = 33.pct
      selectedKuralMeaning = props.selectedKuralMeaning
      onMuVaradhaClick = props.onMuVaradhaClick
      onSalamanPapaClick = props.onSalamanPapaClick
      onMuKarunanidhiClick = props.onMuKarunanidhiClick
    }
    multipleKuralDisplay {
      selectedThirukkurals = props.allThirukkurals
      selectedKuralMeaning = props.selectedKuralMeaning
      showAnswer = true
      style = "bg-light"
    }
  }
}

fun RBuilder.allKurals(handler: AllKuralsProps.() -> Unit): ReactElement {
  return child(AllKurals::class) {
    this.attrs(handler)
  }
}
