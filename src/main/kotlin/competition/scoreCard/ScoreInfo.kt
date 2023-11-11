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
import competition.Group23Round1Type
import competition.QuestionState
import competition.ScoreType
import react.*
import styled.css
import styled.styledDiv

external interface ScoreInfoProps: RProps {
    var questionState: QuestionState
}

class ScoreInfo : RComponent<ScoreInfoProps, RState>() {
    override fun RBuilder.render() {
        styledDiv {
            css {
                classes = mutableListOf("row")
            }
            when (props.questionState.selectedGroup.type) {
                ScoreType.PottiSuttru -> {
                    dollarCard {
                        kuralsCount = props.questionState.scoreState.group23Score.round1.values.count { it.score[Group23Round1Type.KURAL] == true }
                        porulsCount = props.questionState.scoreState.group23Score.round1.values.count { it.score[Group23Round1Type.PORUL] == true }
                    }
                    pottiSuttruScoreCard {
                        questionState = props.questionState
                    }
                }
                ScoreType.KuralPorul -> {
                    dollarCard {
                        kuralsCount = props.questionState.scoreState.group1Score.round1.values.mapNotNull { it.score[Group1RoundType.KURAL] }.count { it.toFloat() > 0 }
                        porulsCount = props.questionState.scoreState.group1Score.round1.values.mapNotNull { it.score[Group1RoundType.PORUL] }.count { it.toFloat() > 0 }
                    }
                    group1PointsCard {
                        questionState = props.questionState
                    }
                }
                else -> {
                    dollarCardMazhalai {
                        kuralsCount =
                            props.questionState.scoreState.group1Score.round1.values.mapNotNull { it.score[Group1RoundType.KURAL] }.count { it.toFloat() > 0 }
                    }
                    group1PointsCard {
                        questionState = props.questionState
                    }
                }
            }
        }
    }
}

fun RBuilder.scoreInfo(handler: ScoreInfoProps.() -> Unit): ReactElement {
    return child(ScoreInfo::class) {
        this.attrs(handler)
    }
}
