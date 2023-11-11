package competition

import kotlinx.css.LinearDimension
import kotlinx.css.height
import kotlinx.css.pct
import kotlinx.css.width
import kotlinx.html.js.onClickFunction
import react.*
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
                classes = mutableListOf("d-flex flex-row m-2")
            }

            styledButton {
                css {
                    val btnStyle =
                        if (props.selectedKuralMeaning.contains(KuralMeaning.MuVaradha)) "btn-success"
                        else "btn btn-outline-success"
                    classes = mutableListOf("btn $btnStyle mr-2")
                    width = props.buttonSize
                    height = 100.pct
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
                    classes = mutableListOf("btn $btnStyle mr-2")
                    width = props.buttonSize
                    height = 100.pct
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
                    classes = mutableListOf("btn $btnStyle")
                    width = props.buttonSize
                    height = 100.pct
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
