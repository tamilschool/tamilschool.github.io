package competition

import components.wordQuestion
import data.CQuestionState
import data.Topic
import kotlinx.css.pct
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import react.ReactElement
import styled.css
import styled.styledDiv

external interface TopicPros : RProps {
  var questionState: CQuestionState
}

class TopicContent : RComponent<TopicPros, RState>() {
  override fun RBuilder.render() {
    when (props.questionState.selectedTopic) {
      Topic.Athikaram -> {
        wordQuestion {
          question = props.questionState.athikaramState.getCurrent()
          isAnswered = props.questionState.isAnswered()
          selectedThirukkurals =
            props.questionState.round2Kurals.filter { it.athikaram == question }
          selectedKuralMeaning = emptySet()
          showAnswer = true
        }
      }

      Topic.Porul -> {
        kuralPorul {
          selectedThirukkural = props.questionState.porulState.getCurrent()
          buttonSize = 33.pct
          isAnswered = props.questionState.isAnswered()
        }
      }

      Topic.Kural -> {
        kural {
          selectedThirukkural = props.questionState.kuralState.getCurrent()
          isAnswered = props.questionState.isAnswered()
        }
      }

      Topic.FirstWord -> {
        wordQuestion {
          question = props.questionState.firstWordState.getCurrent()
          isAnswered = props.questionState.isAnswered()
          selectedThirukkurals =
            props.questionState.round2Kurals.filter { it.words.first() == question }
          selectedKuralMeaning = emptySet()
          showAnswer = true
        }
      }

      Topic.LastWord -> {
        wordQuestion {
          question = props.questionState.lastWordState.getCurrent()
          isAnswered = props.questionState.isAnswered()
          selectedThirukkurals =
            props.questionState.round2Kurals.filter { it.words.last() == question }
          selectedKuralMeaning = emptySet()
          showAnswer = true
        }
      }

      Topic.AllKurals -> {
        styledDiv {
          css {
            classes = mutableListOf("alert alert-primary text-center mb-0")
          }
          +"Invalid Topic selection"
        }
      }
    }
  }
}

fun RBuilder.topicContent(handler: TopicPros.() -> Unit): ReactElement {
  return child(TopicContent::class) {
    this.attrs(handler)
  }
}
