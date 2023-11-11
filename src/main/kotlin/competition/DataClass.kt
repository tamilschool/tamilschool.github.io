package competition

import kotlinx.serialization.Serializable

enum class ScoreType {
    KuralOnly, KuralPorul, PottiSuttru
}

enum class Group(val tamilDisplay: String, val englishDisplay: String, val type: ScoreType) {
    IA("பிரிவு 1 (முன்மழலை/மழலை)", "6 & Below", ScoreType.KuralOnly),
    IB("பிரிவு 1", "6 & Below", ScoreType.KuralPorul),
    II("பிரிவு 2", "7 to 9", ScoreType.PottiSuttru),
    III("பிரிவு 3", "10 & Above", ScoreType.PottiSuttru);
}

enum class Round(val tamil: String) {
    I("சுற்று 1"),
    II("சுற்று 2")
}

enum class Topic(val tamil: String) {
    Athikaram("அதிகாரம்"),
    Porul("பொருள்"),
    Kural("குறள்"),
    FirstWord("முதல் வார்த்தை"),
    LastWord("கடைசி வார்த்தை");

    companion object {
        fun getTopic(tamil: String): Topic {
            return values().first { it.tamil == tamil }
        }
    }
}

interface IKuralMeaning {
    fun getMeaning(thirukkural: Thirukkural): String
}

enum class KuralMeaning(val tamil: String): IKuralMeaning {
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

@Serializable
data class ThirukkuralCollection(
    val kural: List<ThirukkuralData>
)

@Serializable
data class ThirukkuralData(
    val number: Int,
    val line1: String,
    val line2: String,
    val translation: String,
    val muVaradha: String,
    val salamanPapa: String,
    val muKarunanidhi: String,
    val explanation: String,
    val couplet: String,
    val transliteration1: String,
    val transliteration2: String,
    val paulName: String,
    val paulTransliteration: String,
    val paulTranslation: String,
    val iyalName: String,
    val iyalTransliteration: String,
    val iyalTranslation: String,
    val adikaramName: String,
    val adikaramNumber: Int,
    val adikaramTamilDesc: String,
    val adikaramTransliteration: String,
    val adikaramTranslation: String
)

@Serializable
data class GroupsCollection(val II: String, val III: String)

data class KuralOnly(val firstLine: String, val secondLine: String)

data class Thirukkural(
    val athikaramNo: Int,
    val athikaram: String,
    val kuralNo: Int,
    val kural: KuralOnly,
    val porul: String,
    val porulMuVaradha: String,
    val porulSalamanPapa: String,
    val porulMuKarunanidhi: String,
    val words: List<String>,
    val group: Set<Group>
)

data class QuestionState(
    var selectedGroup: Group,
    var selectedRound: Round,
    var selectedTopic: Topic,
    var round2Kurals: List<Thirukkural>,
    var athikaramState: AthikaramState,
    var kuralState: ThirukkuralState,
    var porulState: ThirukkuralState,
    var firstWordState: FirstWordState,
    var lastWordState: LastWordState,
    var timerState: TimerState,
    var scoreState: ScoreState
) {
    fun getCurrentQuestion(): String {
        return when(selectedTopic) {
            Topic.Athikaram -> athikaramState.getCurrent()
            Topic.Porul -> porulState.getCurrent().porul
            Topic.Kural -> kuralState.getCurrent().kural.toString()
            Topic.FirstWord -> firstWordState.getCurrent()
            Topic.LastWord -> lastWordState.getCurrent()
        }
    }
    private fun getIndexQuestion(index: Int): String {
        return when(selectedTopic) {
            Topic.Athikaram -> athikaramState.targets[index]
            Topic.Porul -> porulState.targets[index].porul
            Topic.Kural -> kuralState.targets[index].kural.toString()
            Topic.FirstWord -> firstWordState.targets[index]
            Topic.LastWord -> lastWordState.targets[index]
        }
    }
    fun isAnswered(): Boolean = scoreState.group23Score.round2[selectedTopic]?.contains(getCurrentQuestion()) ?: false
    fun isAnswered(index: Int): Boolean = scoreState.group23Score.round2[selectedTopic]?.contains(getIndexQuestion(index)) ?: false
}

data class TimerState(
    var isLive: Boolean = false,
    var isPaused: Boolean = false,
    var time: Long = 901)

const val maxQuestions = 10

data class AthikaramState(
    override var targets: List<String>,
    override var index: Int
) : HistoryState<String> {
    constructor(targets: List<Thirukkural>) : this(getAthikarams(targets, maxQuestions), 0)
}

data class ThirukkuralState(
    override var targets: List<Thirukkural>,
    override var index: Int
) : HistoryState<Thirukkural> {
    constructor(targets: List<Thirukkural>) : this(targets.shuffled().take(maxQuestions).toList(), 0)
}

data class FirstWordState(
    override var targets: List<String>,
    override var index: Int
) : HistoryState<String> {
    constructor(targets: List<Thirukkural>) : this(getFirstWords(targets, maxQuestions), 0)
}

data class LastWordState(
    override var targets: List<String>,
    override var index: Int
) : HistoryState<String> {
    constructor(targets: List<Thirukkural>) : this(getLastWords(targets, maxQuestions), 0)
}

fun getAthikarams(thirukkurals: List<Thirukkural>, max: Int) = thirukkurals.shuffled().map { it.athikaram }.distinct().take(max)
fun getFirstWords(thirukkurals: List<Thirukkural>, max: Int) = thirukkurals.shuffled().map { it.words.first() }.distinct().take(max)
fun getLastWords(thirukkurals: List<Thirukkural>, max: Int) = thirukkurals.shuffled().map { it.words.last() }.distinct().take(max)

interface HistoryState<T> {
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
    var bonus: Number = 0F)
data class Group1Round1Score(
    var thirukkural: Thirukkural,
    var score: MutableMap<Group1RoundType, Number> = Group1RoundType.values().associateWith { 0F }.toMutableMap())

data class Group23Score(
    val round1: MutableMap<Int, Group23Round1Score> = mutableMapOf(),
    val round2: Map<Topic, MutableSet<String>> = Topic.values().associateWith { mutableSetOf() })
data class Group23Round1Score(
    var thirukkural: Thirukkural,
    var score: MutableMap<Group23Round1Type, Boolean> = Group23Round1Type.values().associateWith { false }.toMutableMap())
