package competition.round

import kotlinx.css.minWidth
import kotlinx.css.px
import kotlinx.html.js.onClickFunction
import react.*
import styled.css
import styled.styledButton
import styled.styledDiv

external interface FirstRoundRealWorldExampleProps : RProps {
    var bonus: Number
    var onG1BonusClick: (Number) -> Unit
}

class FirstRoundRealWorldExample : RComponent<FirstRoundRealWorldExampleProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("card text-white bg-success m-2")
            }
            styledDiv {
                css {
                    classes = mutableListOf("card-header")
                }
                +"வாழ்க்கை எடுத்துக்காட்டுகளுக்கான புள்ளிகள்"
            }
            styledDiv {
                css {
                    classes = mutableListOf("card-body bg-dark d-flex justify-content-end p-2")
                }
                for (index in 1..10) {
                    styledButton {
                        key = "realWorldEx-$index"
                        css {
                            val style = if (props.bonus == index) "btn-primary" else "btn-outline-primary"
                            classes = mutableListOf("btn $style text-white btn-sm ml-1 mr-1")
                            minWidth = 40.px
                        }
                        attrs {
                            onClickFunction = {
                                props.onG1BonusClick(index)
                            }
                        }
                        +"$index"
                    }
                }
            }
        }
    }
}

fun RBuilder.firstRoundRealWorldExample(handler: FirstRoundRealWorldExampleProps.() -> Unit): ReactElement {
    return child(FirstRoundRealWorldExample::class) {
        this.attrs(handler)
    }
}
