package competition.round

import data.Group1Round1Score
import data.Group1RoundType
import data.Group23Round1Score
import data.Group23Round1Type
import data.KuralMeaning
import data.ScoreType
import data.Thirukkural
import kotlinx.html.js.onClickFunction
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledButton
import styled.styledDiv
import styled.styledP
import styled.styledSmall

external interface FirstRoundKuralDisplayProps : RProps {
  var thirukkural: Thirukkural
  var group23Round1Score: Group23Round1Score?
  var group1Round1Score: Group1Round1Score?
  var scoreType: ScoreType
  var selectedKuralMeaning: Set<KuralMeaning>
  var onDeleteKuralClick: (Int) -> Unit
  var onG1Click: (Group1RoundType, Number) -> Unit
  var onG23Click: (Group23Round1Type, Boolean) -> Unit
}

class FirstRoundKuralDisplay : RComponent<FirstRoundKuralDisplayProps, RState>() {
  override fun RBuilder.render() {
    styledDiv {
      css {
        classes = mutableListOf("card text-white bg-success mb-2")
      }
      styledDiv {
        css {
          classes = mutableListOf("card-header d-flex justify-content-between")
        }
        styledDiv {
          +props.thirukkural.athikaram
        }
        styledDiv {
          css {
            classes = mutableListOf("row m-0")
          }
          styledDiv {
            css {
              classes = mutableListOf("font-italic d-flex flex-column text-right")
            }
            styledSmall {
              +"அதிகாரம் : ${props.thirukkural.athikaramNo}"
            }
            styledSmall {
              +"குறள் : ${props.thirukkural.kuralNo}"
            }
          }
        }
      }
      styledDiv {
        css {
          classes = mutableListOf("card-body")
        }
        styledP {
          css {
            classes = mutableListOf("card-text")
          }
          +props.thirukkural.kural.firstLine
        }
        styledP {
          css {
            classes = mutableListOf("card-text")
          }
          +props.thirukkural.kural.secondLine
        }
      }
      styledDiv {
        css {
          classes = mutableListOf("card-footer pb-0")
        }
        props.selectedKuralMeaning.forEach {
          styledP {
            css {
              classes = mutableListOf("card-text m-0")
            }
            +it.getMeaning(props.thirukkural)
          }
          styledDiv {
            css {
              classes =
                mutableListOf("font-italic d-flex flex-column text-right mb-3")
            }
            styledSmall {
              +"உரை : ${it.tamil}"
            }
          }
        }
      }
      styledDiv {
        css {
          classes = mutableListOf("card-body bg-dark p-2")
        }
        styledDiv {
          css {
            classes = mutableListOf("row justify-content-between m-0")
          }
          styledButton {
            css {
              classes = mutableListOf("btn btn-danger ml-3 btn-sm")
            }
            attrs {
              onClickFunction = {
                props.onDeleteKuralClick(props.thirukkural.kuralNo)
              }
            }
            +"X"
          }
          props.group23Round1Score?.let {
            group23Round1 {
              kuralScore = it
              onG23Click = props.onG23Click
            }
          }
          props.group1Round1Score?.let {
            group1Round1 {
              kuralScore = it
              onG1Click = props.onG1Click
            }
          }
        }
      }
    }
  }
}

fun RBuilder.firstRoundKuralDisplay(handler: FirstRoundKuralDisplayProps.() -> Unit): ReactElement {
  return child(FirstRoundKuralDisplay::class) {
    this.attrs(handler)
  }
}
