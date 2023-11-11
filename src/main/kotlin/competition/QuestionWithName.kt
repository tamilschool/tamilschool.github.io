package competition

import kotlinx.css.LinearDimension
import kotlinx.css.fontSize
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv
import styled.styledSmall

external interface QuestionWithNameProps: RProps {
    var question: String
    var isAnswered: Boolean
    var name: String
    var fontSize: LinearDimension
}

class QuestionWithName : RComponent<QuestionWithNameProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                val style = if (props.isAnswered) "success text-white" else "warning"
                classes = mutableListOf("card bg-$style m-2 text-center")
            }
            styledDiv {
                css {
                    classes = mutableListOf("card-header")
                    fontSize = props.fontSize
                }
                +props.question
                styledDiv {
                    css {
                        classes = mutableListOf("font-italic d-flex flex-column text-right")
                    }
                    styledSmall {
                        +"உரை : ${props.name}"
                    }
                }
            }
        }
    }
}

fun RBuilder.questionWithName(handler: QuestionWithNameProps.() -> Unit): ReactElement {
    return child(QuestionWithName::class) {
        this.attrs(handler)
    }
}
