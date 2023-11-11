package competition.round

import competition.Group23Round1Score
import competition.Group23Round1Type
import kotlinx.css.UserSelect
import kotlinx.css.userSelect
import kotlinx.html.InputType
import kotlinx.html.id
import kotlinx.html.js.onChangeFunction
import org.w3c.dom.HTMLInputElement
import react.*
import styled.css
import styled.styledDiv
import styled.styledInput
import styled.styledLabel

external interface Group23Round1Props : RProps {
    var kuralScore: Group23Round1Score
    var onG23Click: (Group23Round1Type, Boolean) -> Unit
}

class Group23Round1 : RComponent<Group23Round1Props, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("row justify-content-end mr-2")
            }
            styledDiv {
                css {
                    classes =
                        mutableListOf("custom-control custom-switch custom-switch-adaptive mr-2 d-flex align-items-center")
                }
                styledInput {
                    css {
                        classes = mutableListOf("custom-control-input")
                    }
                    attrs {
                        id = "kuralCheck" + props.kuralScore.thirukkural.kuralNo
                        type = InputType.checkBox
                        val targetValue = props.kuralScore.score[Group23Round1Type.KURAL] == true
                        checked = targetValue
                        println("திருக்குறள் $targetValue")
                        onChangeFunction = { event ->
                            val target = event.target as HTMLInputElement
                            println("on check திருக்குறள் : ${props.kuralScore.thirukkural.kuralNo} :  ${target.checked}")
                            props.onG23Click(Group23Round1Type.KURAL, target.checked)
                        }
                    }
                }
                styledLabel {
                    css {
                        classes = mutableListOf("custom-control-label")
                        userSelect = UserSelect.none
                    }
                    attrs {
                        htmlFor = "kuralCheck" + props.kuralScore.thirukkural.kuralNo
                    }
                    +"திருக்குறள்"
                }
            }
            styledDiv {
                css {
                    classes =
                        mutableListOf("custom-control custom-switch custom-switch-adaptive custom-switch-inline mr-2 d-flex align-items-center")
                }
                styledInput {
                    css {
                        classes = mutableListOf("custom-control-input")
                    }
                    attrs {
                        id = "meaningCheck" + props.kuralScore.thirukkural.kuralNo
                        type = InputType.checkBox
                        checked = props.kuralScore.score[Group23Round1Type.PORUL] == true
                        onChangeFunction = { event ->
                            val target = event.target as HTMLInputElement
                            props.onG23Click(Group23Round1Type.PORUL, target.checked)
                        }
                    }
                }
                styledLabel {
                    css {
                        classes = mutableListOf("custom-control-label")
                        userSelect = UserSelect.none
                    }
                    attrs {
                        htmlFor = "meaningCheck" + props.kuralScore.thirukkural.kuralNo
                    }
                    +"பொருள்"
                }
            }
        }
    }
}

fun RBuilder.group23Round1(handler: Group23Round1Props.() -> Unit): ReactElement {
    return child(Group23Round1::class) {
        this.attrs(handler)
    }
}
