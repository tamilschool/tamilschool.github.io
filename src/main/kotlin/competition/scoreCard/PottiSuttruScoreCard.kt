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

import competition.QuestionState
import kotlinx.css.rem
import kotlinx.css.width
import react.*
import styled.css
import styled.styledDiv

external interface PottiSuttruScoreCardProps: RProps {
    var questionState: QuestionState
}

class PottiSuttruScoreCard : RComponent<PottiSuttruScoreCardProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("")
            }
            val group23Score = props.questionState.scoreState.group23Score
            styledDiv {
                css {
                    classes = mutableListOf("card text-white bg-dark m-2")
                    width = 16.rem
                }
                styledDiv {
                    css {
                        classes = mutableListOf("card-body p-2")
                    }
                    for (entry in group23Score.round2) {
                        scoreCardEntry {
                            keyEntry = entry.key.tamil
                            valueEntry = entry.value.size.toString()
                        }
                    }
                }
                styledDiv {
                    css {
                        classes = mutableListOf("card-footer p-2")
                    }
                    scoreCardEntry {
                        keyEntry = "மொத்தம்"
                        valueEntry = group23Score.round2.values.flatten().size.toString()
                    }
                }
            }
        }
    }
}

fun RBuilder.pottiSuttruScoreCard(handler: PottiSuttruScoreCardProps.() -> Unit): ReactElement {
    return child(PottiSuttruScoreCard::class) {
        this.attrs(handler)
    }
}
