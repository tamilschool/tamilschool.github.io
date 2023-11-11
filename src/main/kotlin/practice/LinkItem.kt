package practice/*
 * Copyright 2020 Uttran Ishtalingam
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import kotlinx.css.Color
import kotlinx.css.color
import kotlinx.css.opacity
import kotlinx.html.id
import kotlinx.html.js.onClickFunction
import kotlinx.html.role
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledA
import styled.styledLi

external interface LinkItemProps: RProps {
    var name: String
    var isActive: Boolean
    var isDisabled: Boolean
    var onClickFunction: () -> Unit
}

class LinkItem : RComponent<LinkItemProps, RState>() {
    override fun RBuilder.render() {
        styledLi {
            css {
                classes = mutableListOf("nav-item")
            }
            styledA {
                css {
                    val activeStyle = if (props.isActive) "active" else ""
                    classes = mutableListOf("nav-link $activeStyle")
                    color = Color("#555")
                    put("data-toggle", "pill")
                    if (props.isDisabled) {
                        opacity = 0.65
                    }
                    attrs {
                        id = props.name
                        role = "button"
                        onClickFunction = { props.onClickFunction() }
                    }
                }
                +props.name
            }
        }
    }
}

fun RBuilder.linkItem(handler: LinkItemProps.() -> Unit): ReactElement {
    return child(LinkItem::class) {
        this.attrs(handler)
    }
}
