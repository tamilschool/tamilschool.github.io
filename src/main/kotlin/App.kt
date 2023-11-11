import competition.competitionApp
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import kotlinx.css.BoxSizing
import kotlinx.css.Display
import kotlinx.css.FlexDirection
import kotlinx.css.boxSizing
import kotlinx.css.display
import kotlinx.css.flexDirection
import kotlinx.css.height
import kotlinx.css.pct
import kotlinx.css.vh
import practice.practiceApp
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.setState
import styled.css
import styled.styledDiv

external interface AppState : RState {
  var loaded: Boolean
  var practice: Boolean
}

class App : RComponent<RProps, AppState>() {
  override fun AppState.init() {
    val mainScope = MainScope()
    mainScope.launch {
      setState {
        practice = true
        loaded = true
      }
    }
  }

  override fun RBuilder.render() {
    if (state.loaded) {
      styledDiv {
        css {
          height = 100.vh
          display = Display.flex
          flexDirection = FlexDirection.column
          boxSizing = BoxSizing.borderBox
        }
        styledDiv {
          css {
            classes = mutableListOf("alert alert-primary text-center mb-0")
          }
          +"திருக்குறள் ${if (state.practice) "பயிற்சி" else "போட்டி"}"
        }
        styledDiv {
          css {
            classes = mutableListOf("container-lg pl-0 pr-0")
            height = 100.pct
          }
          if (state.practice) {
            practiceApp {
              onChange = {
                setState {
                  practice = !practice
                }
              }
            }
          } else {
            competitionApp {
              onChange = {
                setState {
                  practice = !practice
                }
              }
            }
          }
        }
      }
    }
  }
}
