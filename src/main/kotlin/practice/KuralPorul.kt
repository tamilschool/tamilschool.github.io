package practice

import kotlinx.css.LinearDimension
import kotlinx.css.rem
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement

external interface KuralPorulProps: RProps {
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
        kuralPorulSelection {
            buttonSize = props.buttonSize
            selectedKuralMeaning = props.selectedKuralMeaning
            onMuVaradhaClick = props.onMuVaradhaClick
            onSalamanPapaClick = props.onSalamanPapaClick
            onMuKarunanidhiClick = props.onMuKarunanidhiClick
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

fun RBuilder.kuralPorul(handler: KuralPorulProps.() -> Unit): ReactElement {
    return child(KuralPorul::class) {
        this.attrs(handler)
    }
}
