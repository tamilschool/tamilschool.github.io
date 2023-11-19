package data

import kotlinx.serialization.Serializable

interface CIKuralMeaning {
    fun getMeaning(thirukkural: Thirukkural): String
}

enum class CKuralMeaning(val tamil: String): CIKuralMeaning {
    MuVaradha("மு. வரதராசனார்") {
        override fun getMeaning(thirukkural: Thirukkural): String {
            return thirukkural.porulMuVaradha
        }
    },
    SalamanPapa("சாலமன் பாப்பையா") {
        override fun getMeaning(thirukkural: Thirukkural): String {
            return thirukkural.porulSalamanPapa
        }
    },
    MuKarunanidhi("மு. கருணாநிதி") {
        override fun getMeaning(thirukkural: Thirukkural): String {
            return thirukkural.porulMuKarunanidhi
        }
    };
}

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
  var scoreState: CScoreState
) {
    fun getCurrentQuestion(): String {
        return when(selectedTopic) {
            Topic.Athikaram -> athikaramState.getCurrent()
            Topic.Porul -> porulState.getCurrent().porul
            Topic.Kural -> kuralState.getCurrent().kural.toString()
            Topic.FirstWord -> firstWordState.getCurrent()
            Topic.LastWord -> lastWordState.getCurrent()
            Topic.AllKurals -> "Error"
        }
    }
    private fun getIndexQuestion(index: Int): String {
        return when(selectedTopic) {
            Topic.Athikaram -> athikaramState.targets[index]
            Topic.Porul -> porulState.targets[index].porul
            Topic.Kural -> kuralState.targets[index].kural.toString()
            Topic.FirstWord -> firstWordState.targets[index]
            Topic.LastWord -> lastWordState.targets[index]
            Topic.AllKurals -> "Error"
        }
    }
    fun isAnswered(): Boolean = scoreState.group23Score.round2[selectedTopic]?.contains(getCurrentQuestion()) ?: false
    fun isAnswered(index: Int): Boolean = scoreState.group23Score.round2[selectedTopic]?.contains(getIndexQuestion(index)) ?: false
}

data class CTimerState(
    var isLive: Boolean = false,
    var isPaused: Boolean = false,
    var time: Long = 901)

const val maxQuestions = 10

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

fun cGetAthikarams(thirukkurals: List<Thirukkural>, max: Int) = thirukkurals.shuffled().map { it.athikaram }.distinct().take(max)
fun cGetFirstWords(thirukkurals: List<Thirukkural>, max: Int) = thirukkurals.shuffled().map { it.words.first() }.distinct().take(max)
fun cGetLastWords(thirukkurals: List<Thirukkural>, max: Int) = thirukkurals.shuffled().map { it.words.last() }.distinct().take(max)

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
        if (index >=0 && index < targets.size) {
            index = targetIndex
            println("${this::class} Moved to : $index of Total: ${targets.size}")
        }
    }
}

enum class CGroup23Round1Type {
    KURAL, PORUL;
}

enum class CGroup1RoundType(val tamil: String) {
    KURAL("குறள்"),
    PORUL("பொருள்"),
    CLARITY("உச்சரிப்பு")
}

data class CScoreState(
  val group1Score: CGroup1Score = CGroup1Score(),
  val group23Score: CGroup23Score = CGroup23Score()
)

data class CGroup1Score(
  var round1: MutableMap<Int, Group1Round1Score> = mutableMapOf(),
  var bonus: Number = 0F)
data class Group1Round1Score(
  var thirukkural: Thirukkural,
  var score: MutableMap<CGroup1RoundType, Number> = CGroup1RoundType.values().associateWith { 0F }.toMutableMap())

data class CGroup23Score(
  val round1: MutableMap<Int, Group23Round1Score> = mutableMapOf(),
  val round2: Map<Topic, MutableSet<String>> = Topic.values().filter { it != Topic.AllKurals }.associateWith { mutableSetOf() })
data class Group23Round1Score(
  var thirukkural: Thirukkural,
  var score: MutableMap<CGroup23Round1Type, Boolean> = CGroup23Round1Type.values().associateWith { false }.toMutableMap())
