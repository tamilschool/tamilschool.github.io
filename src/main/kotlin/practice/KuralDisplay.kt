package practice

import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv
import styled.styledP
import styled.styledSmall

external interface KuralDisplayProps: RProps {
    var selectedThirukkural: Thirukkural
    var selectedKuralMeaning: Set<KuralMeaning>
}

class KuralDisplay : RComponent<KuralDisplayProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("card text-white bg-success m-2")
            }
            styledDiv {
                css {
                    classes = mutableListOf("card-header d-flex justify-content-between")
                }
                styledDiv {
                    +props.selectedThirukkural.athikaram
                }
                styledDiv {
                    css {
                        classes = mutableListOf("font-italic d-flex flex-column text-right")
                    }
                    styledSmall {
                        +"அதிகாரம் : ${props.selectedThirukkural.athikaramNo}"
                    }
                    styledSmall {
                        +"குறள் : ${props.selectedThirukkural.kuralNo}"
                    }
                }
            }
            styledDiv {
                css {
                    classes = mutableListOf("card-body")
                }
                styledP {
                    css {
                        classes = mutableListOf("card-text")
                    }
                    +props.selectedThirukkural.kural.firstLine
                }
                styledP {
                    css {
                        classes = mutableListOf("card-text")
                    }
                    +props.selectedThirukkural.kural.secondLine
                }
            }
            styledDiv {
                css {
                    classes = mutableListOf("card-footer")
                }
                props.selectedKuralMeaning.forEach {
                    styledP {
                        css {
                            classes = mutableListOf("card-text")
                        }
                        +it.getMeaning(props.selectedThirukkural)
                        styledDiv {
                            css {
                                classes = mutableListOf("font-italic d-flex flex-column text-right")
                            }
                            styledSmall {
                                +"உரை : ${it.tamil}"
                            }
                        }
                    }
                }
            }
        }
    }
}

fun RBuilder.kuralDisplay(handler: KuralDisplayProps.() -> Unit): ReactElement {
    return child(KuralDisplay::class) {
        this.attrs(handler)
    }
}
