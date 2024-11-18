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

import data.Topic
import kotlinx.css.pct
import kotlinx.css.width
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv

external interface DollarCardProps : RProps {
  var kuralsCount: Int
  var porulsCount: Int
  var round1Dollars: Float
  var round2Dollars: Float
  var totalDollars: Float
}

class DollarCard : RComponent<DollarCardProps, RState>() {
  override fun RBuilder.render() {
    styledDiv {
      css {
        classes = mutableListOf("")
        width = 100.pct
      }
      styledDiv {
        css {
          classes = mutableListOf("card text-white bg-dark")
        }
        styledDiv {
          css {
            classes = mutableListOf("card-header p-2")
          }
          scoreCardEntry {
            keyEntry = Topic.Kural.tamil
            valueEntry = props.kuralsCount.toString()
          }
          scoreCardEntry {
            keyEntry = Topic.Porul.tamil
            valueEntry = props.porulsCount.toString()
          }
        }
        styledDiv {
          css {
            classes = mutableListOf("card-body p-2")
          }
          scoreCardEntry {
            keyEntry = "சுற்று 1"
            valueEntry = " $ ${props.round1Dollars}"
          }
          scoreCardEntry {
            keyEntry = "சுற்று 2"
            valueEntry = " $ ${props.round2Dollars}"
          }
        }
        styledDiv {
          css {
            classes = mutableListOf("card-footer p-2")
          }
          scoreCardEntry {
            keyEntry = "மொத்தம்"
            valueEntry = " $ ${props.totalDollars}"
          }
        }
      }
    }
  }
}

fun RBuilder.dollarCard(handler: DollarCardProps.() -> Unit): ReactElement {
  return child(DollarCard::class) {
    this.attrs(handler)
  }
}
