package competition.round

import competition.Group1Round1Score
import competition.Group1RoundType
import kotlinx.css.UserSelect
import kotlinx.css.minWidth
import kotlinx.css.px
import kotlinx.css.userSelect
import kotlinx.html.js.onClickFunction
import react.*
import styled.css
import styled.styledButton
import styled.styledDiv
import styled.styledLabel

external interface Group1Round1Props : RProps {
    var kuralScore: Group1Round1Score
    var onG1Click: (Group1RoundType, Number) -> Unit
}

class Group1Round1 : RComponent<Group1Round1Props, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("row justify-content-end d-flex align-items-center mr-2")
            }
            styledLabel {
                css {
                    classes = mutableListOf("ml-2 mb-0")
                    userSelect = UserSelect.none
                }
                +"திருக்குறள்"
            }
            for (i in listOf(0.5, 1, 1.5, 2)) {
                styledButton {
                    key = "kuralPoints-${props.kuralScore.thirukkural.kuralNo}-$i"
                    css {
                        val style = if (props.kuralScore.score[Group1RoundType.KURAL] == i) "btn-primary" else "btn-outline-primary"
                        classes = mutableListOf("btn $style text-white btn-sm ml-1 mr-1")
                        minWidth = 40.px
                    }
                    attrs {
                        onClickFunction = {
                            props.onG1Click(Group1RoundType.KURAL, i)
                        }
                    }
                    +"$i"
                }
            }
            styledLabel {
                css {
                    classes = mutableListOf("ml-2 mb-0")
                    userSelect = UserSelect.none
                }
                +"பொருள்"
            }
            for (i in listOf(0.5, 1, 1.5, 2)) {
                styledButton {
                    key = "porulPoints-${props.kuralScore.thirukkural.kuralNo}-$i"
                    css {
                        val style = if (props.kuralScore.score[Group1RoundType.PORUL] == i) "btn-primary" else "btn-outline-primary"
                        classes = mutableListOf("btn $style text-white btn-sm ml-1 mr-1")
                        minWidth = 40.px
                    }
                    attrs {
                        onClickFunction = {
                            props.onG1Click(Group1RoundType.PORUL, i)
                        }
                    }
                    +"$i"
                }
            }
            styledLabel {
                css {
                    classes = mutableListOf("ml-2 mb-0")
                    userSelect = UserSelect.none
                }
                +"உச்சரிப்பு"
            }
            for (i in listOf(0.5, 1)) {
                styledButton {
                    key = "clarityPoints-${props.kuralScore.thirukkural.kuralNo}-$i"
                    css {
                        val style = if (props.kuralScore.score[Group1RoundType.CLARITY] == i) "btn-primary" else "btn-outline-primary"
                        classes = mutableListOf("btn $style text-white btn-sm ml-1 mr-1")
                        minWidth = 40.px
                    }
                    attrs {
                        onClickFunction = {
                            props.onG1Click(Group1RoundType.CLARITY, i)
                        }
                    }
                    +"$i"
                }
            }
        }
    }
}

fun RBuilder.group1Round1(handler: Group1Round1Props.() -> Unit): ReactElement {
    return child(Group1Round1::class) {
        this.attrs(handler)
    }
}
