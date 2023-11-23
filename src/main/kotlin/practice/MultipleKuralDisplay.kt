package practice

import data.KuralMeaning
import data.Thirukkural
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface MultipleKuralDisplayProps : RProps {
  var selectedThirukkurals: List<Thirukkural>
  var selectedKuralMeaning: Set<KuralMeaning>
  var showAnswer: Boolean
  var style: String?
}

class MultipleKuralDisplay : RComponent<MultipleKuralDisplayProps, RState>() {
  override fun RBuilder.render() {
    if (props.showAnswer) {
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

fun RBuilder.multipleKuralDisplay(handler: MultipleKuralDisplayProps.() -> Unit): ReactElement {
  return child(MultipleKuralDisplay::class) {
    this.attrs(handler)
  }
}
