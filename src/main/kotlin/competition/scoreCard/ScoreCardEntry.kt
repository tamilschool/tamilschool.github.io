/*
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
package competition.scoreCard

import react.*
import styled.css
import styled.styledDiv
import styled.styledP

external interface ScoreCardEntryProps: RProps {
    var keyEntry: String
    var valueEntry: String
}

class ScoreCardEntry : RComponent<ScoreCardEntryProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("d-flex justify-content-between align-items-center")
            }
            styledP {
                css {
                    classes = mutableListOf("card-text mb-0")
                }
                +"${props.keyEntry}: "
            }
            styledP {
                css {
                    classes = mutableListOf("card-text")
                }
                +props.valueEntry
            }
        }
    }
}

fun RBuilder.scoreCardEntry(handler: ScoreCardEntryProps.() -> Unit): ReactElement {
    return child(ScoreCardEntry::class) {
        this.attrs(handler)
    }
}
