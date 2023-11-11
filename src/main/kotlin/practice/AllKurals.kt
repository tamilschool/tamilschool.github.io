package practice

import kotlinx.css.pct
import react.*

external interface AllKuralsProps: RProps {
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
        props.allThirukkurals.forEach { thirukkural ->
            kuralDisplay {
                selectedThirukkural = thirukkural
                selectedKuralMeaning = props.selectedKuralMeaning
            }
        }
    }
}

fun RBuilder.allKurals(handler: AllKuralsProps.() -> Unit): ReactElement {
    return child(AllKurals::class) {
        this.attrs(handler)
    }
}
