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

import competition.Group1RoundType
import competition.QuestionState
import kotlinx.css.rem
import kotlinx.css.width
import react.*
import styled.css
import styled.styledDiv

external interface Group1PointsCardProps: RProps {
    var questionState: QuestionState
}

class Group1PointsCard : RComponent<Group1PointsCardProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("")
            }
            val group1Score = props.questionState.scoreState.group1Score
            styledDiv {
                css {
                    classes = mutableListOf("card text-white bg-dark m-2")
                    width = 16.rem
                }
                styledDiv {
                    css {
                        classes = mutableListOf("card-body p-2")
                    }
                    for (entry in Group1RoundType.values()) {
                        scoreCardEntry {
                            keyEntry = entry.tamil
                            valueEntry = group1Score.round1.values.mapNotNull { it.score[entry]?.toFloat() }.sum().toString()
                        }
                    }
                }
                styledDiv {
                    css {
                        classes = mutableListOf("card-footer p-2")
                    }
                    scoreCardEntry {
                        keyEntry = "வெகுமதி"
                        valueEntry = group1Score.bonus.toString()
                    }
                }
                styledDiv {
                    css {
                        classes = mutableListOf("card-body p-2")
                    }
                    scoreCardEntry {
                        keyEntry = "மொத்தம்"
                        valueEntry = (group1Score.round1.values.map { it.score.values }.flatten().map { it.toFloat() }.sum() + group1Score.bonus.toFloat()).toString()
                    }
                }
            }
        }
    }
}

fun RBuilder.group1PointsCard(handler: Group1PointsCardProps.() -> Unit): ReactElement {
    return child(Group1PointsCard::class) {
        this.attrs(handler)
    }
}
