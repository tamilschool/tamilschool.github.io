package competition.group

import data.Group
import kotlinx.css.pct
import kotlinx.css.width
import kotlinx.html.js.onClickFunction
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledButton
import styled.styledDiv
import styled.styledImg

external interface GroupSelectionProps : RProps {
  var onGroupClick: (Group) -> Unit
}

class GroupSelection : RComponent<GroupSelectionProps, RState>() {
  override fun RBuilder.render() {
    styledDiv {
      css {
        classes = mutableListOf("p-2")
      }
      styledDiv {
        css {
          classes = mutableListOf("row m-2")
        }
        Group.values().forEach { group ->
          styledButton {
            css {
              classes = mutableListOf("btn btn-primary mr-2")
            }
            attrs {
              onClickFunction = { props.onGroupClick(group) }
            }
            +"${group.tamilDisplay} (${group.englishDisplay})"
          }
        }
      }
      styledDiv {
        css {
          classes = mutableListOf("m-2")
        }
        styledImg {
          attrs.src = "img/thiruvalluvar.jpg"
          css {
            width = 100.pct
          }
        }
      }
    }
  }
}

fun RBuilder.groupSelection(handler: GroupSelectionProps.() -> Unit): ReactElement {
  return child(GroupSelection::class) {
    this.attrs(handler)
  }
}
