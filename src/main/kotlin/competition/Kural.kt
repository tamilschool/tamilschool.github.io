package competition

import components.kuralDisplay
import components.questionMultiline
import data.KuralMeaning
import data.Thirukkural
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface KuralProps : RProps {
  var selectedThirukkural: Thirukkural
  var isAnswered: Boolean
}

class Kural : RComponent<KuralProps, RState>() {
  override fun RBuilder.render() {
    questionMultiline {
      question = props.selectedThirukkural.kural
      isAnswered = props.isAnswered
    }
    kuralDisplay {
      selectedThirukkural = props.selectedThirukkural
      selectedKuralMeaning = KuralMeaning.values().toSet()
    }
  }
}

fun RBuilder.kural(handler: KuralProps.() -> Unit): ReactElement {
  return child(Kural::class) {
    this.attrs(handler)
  }
}
