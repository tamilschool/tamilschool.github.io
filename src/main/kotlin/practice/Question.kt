package practice

import kotlinx.css.LinearDimension
import kotlinx.css.fontSize
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv

external interface QuestionProps: RProps {
    var question: String
    var fontSize: LinearDimension
}

class Question : RComponent<QuestionProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("card bg-warning m-2 text-center")
            }
            styledDiv {
                css {
                    classes = mutableListOf("card-header")
                    fontSize = props.fontSize
                }
                +props.question
            }
        }
    }
}

fun RBuilder.question(handler: QuestionProps.() -> Unit): ReactElement {
    return child(Question::class) {
        this.attrs(handler)
    }
}
