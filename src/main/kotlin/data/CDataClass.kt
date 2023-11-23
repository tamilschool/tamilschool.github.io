package data

data class CQuestionState(
  var selectedGroup: Group,
  var selectedRound: Round,
  var selectedTopic: Topic,
  var round2Kurals: List<Thirukkural>,
  var athikaramState: CAthikaramState,
  var kuralState: CThirukkuralState,
  var porulState: CThirukkuralState,
  var firstWordState: CFirstWordState,
  var lastWordState: CLastWordState,
  var timerState: CTimerState,
  var scoreState: ScoreState
) {
  fun getCurrentQuestion(): String {
    return when (selectedTopic) {
      Topic.Athikaram -> athikaramState.getCurrent()
      Topic.Porul -> porulState.getCurrent().porul
      Topic.Kural -> kuralState.getCurrent().kural.toString()
      Topic.FirstWord -> firstWordState.getCurrent()
      Topic.LastWord -> lastWordState.getCurrent()
      Topic.AllKurals -> "Error"
    }
  }

  private fun getIndexQuestion(index: Int): String {
    return when (selectedTopic) {
      Topic.Athikaram -> athikaramState.targets[index]
      Topic.Porul -> porulState.targets[index].porul
      Topic.Kural -> kuralState.targets[index].kural.toString()
      Topic.FirstWord -> firstWordState.targets[index]
      Topic.LastWord -> lastWordState.targets[index]
      Topic.AllKurals -> "Error"
    }
  }

  fun isAnswered(): Boolean =
    scoreState.group23Score.round2[selectedTopic]?.contains(getCurrentQuestion()) ?: false

  fun isAnswered(index: Int): Boolean =
    scoreState.group23Score.round2[selectedTopic]?.contains(getIndexQuestion(index)) ?: false

  fun maxQuestionsAnswered(): Boolean {
    val currentAnsweredCount: Int = scoreState.group23Score.round2[selectedTopic]?.size ?: 0
    return !isAnswered() && (currentAnsweredCount >= maxAnswers)
  }
}

data class CTimerState(
  var isLive: Boolean = false,
  var isPaused: Boolean = false,
  var time: Long = 1201
)

const val maxQuestions = 15
const val maxAnswers = 10

data class CAthikaramState(
  override var targets: List<String>,
  override var index: Int
) : CHistoryState<String> {
  constructor(targets: List<Thirukkural>) : this(cGetAthikarams(targets, maxQuestions), 0)
}

data class CThirukkuralState(
  override var targets: List<Thirukkural>,
  override var index: Int
) : CHistoryState<Thirukkural> {
  constructor(targets: List<Thirukkural>) : this(targets.shuffled().take(maxQuestions).toList(), 0)
}

data class CFirstWordState(
  override var targets: List<String>,
  override var index: Int
) : CHistoryState<String> {
  constructor(targets: List<Thirukkural>) : this(cGetFirstWords(targets, maxQuestions), 0)
}

data class CLastWordState(
  override var targets: List<String>,
  override var index: Int
) : CHistoryState<String> {
  constructor(targets: List<Thirukkural>) : this(cGetLastWords(targets, maxQuestions), 0)
}

fun cGetAthikarams(thirukkurals: List<Thirukkural>, max: Int) =
  thirukkurals.shuffled().map { it.athikaram }.distinct().take(max)

fun cGetFirstWords(thirukkurals: List<Thirukkural>, max: Int) =
  thirukkurals.shuffled().map { it.words.first() }.distinct().take(max)

fun cGetLastWords(thirukkurals: List<Thirukkural>, max: Int) =
  thirukkurals.shuffled().map { it.words.last() }.distinct().take(max)

interface CHistoryState<T> {
  var index: Int
  var targets: List<T>
  fun getCurrent(): T = targets[index]
  fun goNext() {
    index++
    if (index == targets.size) {
      index = 0
    }
    println("${this::class} Moved to : $index of Total: ${targets.size}")
  }

  fun goPrevious() {
    --index
    if (index < 0) {
      index = targets.size - 1
    }
    println("${this::class} Moved to : $index of Total: ${targets.size}")
  }

  fun go(targetIndex: Int) {
    if (index >= 0 && index < targets.size) {
      index = targetIndex
      println("${this::class} Moved to : $index of Total: ${targets.size}")
    }
  }
}

enum class Group23Round1Type {
  KURAL, PORUL;
}

enum class Group1RoundType(val tamil: String) {
  KURAL("குறள்"),
  PORUL("பொருள்"),
  CLARITY("உச்சரிப்பு")
}

data class ScoreState(
  val group1Score: Group1Score = Group1Score(),
  val group23Score: Group23Score = Group23Score()
)

data class Group1Score(
  var round1: MutableMap<Int, Group1Round1Score> = mutableMapOf(),
  var bonus: Number = 0
) {
  fun getKuralCount(): Int {
    return round1.values
      .mapNotNull { it.score[Group1RoundType.KURAL] }
      .count { it > 0 }
  }

  fun getPorulCount(): Int {
    return round1.values
      .mapNotNull { it.score[Group1RoundType.PORUL] }
      .count { it > 0 }
  }

  fun getDollars(scoreType: ScoreType): Float {
    return when (scoreType) {
      ScoreType.KuralOnly -> getKuralCount().toFloat()
      else -> (getKuralCount().toFloat() + getPorulCount().toFloat()) / 2
    }
  }

  fun getAnsweredKuralList(): String =
    round1.filter { it.value.score.values.sum() > 0 }.keys.joinToString(",")

  fun getScore(type: Group1RoundType): Float = round1.values.mapNotNull { it.score[type] }.sum()
  fun getTotal(): Float =
    getScore(Group1RoundType.KURAL) + getScore(Group1RoundType.PORUL) + getScore(Group1RoundType.CLARITY) + bonus.toFloat()
}

data class Group1Round1Score(
  var thirukkural: Thirukkural,
  var score: MutableMap<Group1RoundType, Float> = Group1RoundType.values().associateWith { 0F }
    .toMutableMap()
)

data class Group23Score(
  val round1: MutableMap<Int, Group23Round1Score> = mutableMapOf(),
  val round2: Map<Topic, MutableSet<String>> = Topic.values()
    .filter { it != Topic.AllKurals }
    .associateWith { mutableSetOf() }
) {
  fun getKuralCount(): Int = round1.values.count { it.score[Group23Round1Type.KURAL] == true }
  fun getPorulCount(): Int = round1.values.count { it.score[Group23Round1Type.PORUL] == true }
  fun getDollars(): Float = (getKuralCount().toFloat() + getPorulCount().toFloat()) / 2
  fun getAnsweredKuralList(): String =
    round1.filter { it.value.score.values.contains(true) }.keys.joinToString(",")

  fun getScore(topic: Topic): Int = round2[topic]?.count() ?: 0
  fun getTotal(): Int = round2.values.flatten().count()
}

data class Group23Round1Score(
  var thirukkural: Thirukkural,
  var score: MutableMap<Group23Round1Type, Boolean> = Group23Round1Type.values()
    .associateWith { false }.toMutableMap()
)
