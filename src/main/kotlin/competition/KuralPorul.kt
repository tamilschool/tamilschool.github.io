package competition

import kotlinx.css.LinearDimension
import kotlinx.css.rem
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface KuralPorulProps: RProps {
    var selectedThirukkural: Thirukkural
    var buttonSize: LinearDimension
    var isAnswered: Boolean
}

class KuralPorul : RComponent<KuralPorulProps, RState>() {
    override fun RBuilder.render() {
        KuralMeaning.values().forEach {
            questionWithName {
                question = it.getMeaning(props.selectedThirukkural)
                name = it.tamil
                fontSize = 1.1.rem
                isAnswered = props.isAnswered
            }
        }
        kuralDisplay {
            selectedThirukkural = props.selectedThirukkural
            showMeaning = false
        }
    }
}

fun RBuilder.kuralPorul(handler: KuralPorulProps.() -> Unit): ReactElement {
    return child(KuralPorul::class) {
        this.attrs(handler)
    }
}
