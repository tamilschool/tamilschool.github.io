package practice

import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface KuralProps: RProps {
    var selectedThirukkural: Thirukkural
    var selectedKuralMeaning: Set<KuralMeaning>
    var showAnswer: Boolean
}

class Kural : RComponent<KuralProps, RState>() {
    override fun RBuilder.render() {
        questionMultiline {
            question = props.selectedThirukkural.kural
        }
        if (props.showAnswer) {
            kuralDisplay {
                selectedThirukkural = props.selectedThirukkural
                selectedKuralMeaning = props.selectedKuralMeaning
            }
        }
    }
}

fun RBuilder.kural(handler: KuralProps.() -> Unit): ReactElement {
    return child(Kural::class) {
        this.attrs(handler)
    }
}
