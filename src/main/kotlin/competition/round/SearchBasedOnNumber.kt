package competition.round

import competition.QuestionState
import competition.Thirukkural
import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.html.InputType
import kotlinx.html.id
import kotlinx.html.js.onChangeFunction
import kotlinx.html.js.onClickFunction
import org.w3c.dom.HTMLInputElement
import react.*
import react.dom.defaultValue
import styled.*

external interface SearchBasedOnNumberProps : RProps {
    var questionState: QuestionState
    var searchResultKural: Thirukkural?
    var onSearchByKuralNoClick: (Int) -> Unit
    var onAddKuralClick: () -> Unit
}

class SearchBasedOnNumber : RComponent<SearchBasedOnNumberProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("m-2")
            }
            styledDiv {
                css {
                    classes = mutableListOf("input-group")
                }
                styledDiv {
                    css {
                        classes = mutableListOf("input-group-prepend")
                    }
                    styledSpan {
                        css {
                            classes = mutableListOf("input-group-text bg-primary text-white")
                        }
                        +"திருக்குறள் எண்"
                    }
                }
                styledInput {
                    css {
                        classes = mutableListOf("form-control")
                    }
                    attrs {
                        type = InputType.number
                        id = "searchByNoInput"
                        placeholder = "Enter thirukkural number here..."
                        defaultValue = props.searchResultKural?.kuralNo.toString()
                        autoFocus = true
                        onChangeFunction = {
                            val target = it.target as HTMLInputElement
                            println("On 1 - Change " + target.value)
                            props.onSearchByKuralNoClick(if (target.value.isBlank()) 0 else target.value.toInt())
                        }
                    }
                }
                styledDiv {
                    css {
                        classes = mutableListOf("input-group-append")
                    }
                    styledButton {
                        css {
                            classes = mutableListOf("btn btn-primary")
                        }
                        attrs {
                            onClickFunction = {
                                props.searchResultKural?.let {
                                    props.onAddKuralClick()
                                    window.setInterval(setFocusOnInput(), 500)
                                }
                            }
                        }
                        +"Add"
                    }
                }
            }
        }
    }

    private fun setFocusOnInput() {
        val elementById = document.getElementById("searchByNoInput")
        elementById?.let {
            val htmlInputElement = it as HTMLInputElement
            htmlInputElement.focus()
            htmlInputElement.select()
        }
    }
}

fun RBuilder.searchBasedOnNumber(handler: SearchBasedOnNumberProps.() -> Unit): ReactElement {
    return child(SearchBasedOnNumber::class) {
        this.attrs(handler)
    }
}
