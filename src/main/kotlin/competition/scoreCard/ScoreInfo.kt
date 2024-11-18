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

import data.CQuestionState
import data.Group1RoundType
import data.Group23Round1Type
import data.ScoreType
import kotlinx.css.pct
import kotlinx.css.width
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv

external interface ScoreInfoProps : RProps {
  var questionState: CQuestionState
}

class ScoreInfo : RComponent<ScoreInfoProps, RState>() {
  override fun RBuilder.render() {
    styledDiv {
      css {
        classes = mutableListOf("row m-0")
        width = 100.pct
      }
      when (props.questionState.selectedGroup.type) {
        ScoreType.PottiSuttru -> {
          dollarCard {
            kuralsCount = props.questionState.scoreState.group23Score.getKuralCount()
            porulsCount = props.questionState.scoreState.group23Score.getPorulCount()
            round1Dollars = props.questionState.scoreState.group23Score.getRound1Dollars()
            round2Dollars = props.questionState.scoreState.group23Score.getRound2Dollars()
            totalDollars = props.questionState.scoreState.group23Score.getDollars()
          }
          pottiSuttruScoreCard {
            questionState = props.questionState
          }
        }
        else -> {
          dollarCardMazhalai {
            kuralsCount = props.questionState.scoreState.group1Score.getKuralCount()
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
