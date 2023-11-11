package competition

import react.*
import styled.css
import styled.styledDiv
import styled.styledP
import styled.styledSmall

external interface KuralDisplayProps : RProps {
    var selectedThirukkural: Thirukkural
    var showMeaning: Boolean
    var style: String?
}

class KuralDisplay : RComponent<KuralDisplayProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            val targetStyle = props.style ?: "text-white bg-success"
            css {
                classes = mutableListOf("card $targetStyle m-2")
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
            if (props.showMeaning) {
                styledDiv {
                    css {
                        classes = mutableListOf("card-footer pb-0")
                    }
                    KuralMeaning.values().forEach {
                        styledP {
                            css {
                                classes = mutableListOf("card-text m-0")
                            }
                            +it.getMeaning(props.selectedThirukkural)
                        }
                        styledDiv {
                            css {
                                classes =
                                    mutableListOf("font-italic d-flex flex-column text-right mb-3")
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
