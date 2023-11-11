package practice

import kotlinx.serialization.Serializable
import kotlin.random.Random

enum class Group(val tamilDisplay: String, val englishDisplay: String) {
    II("பிரிவு 2", "7 to 9"),
    III("பிரிவு 3", "10 & Above");

    companion object {
        fun getGroupForEnglish(englishDisplay: String): Group {
            return values().first { it.englishDisplay == englishDisplay }
        }
        fun getGroupForTamil(tamilDisplay: String): Group {
            return values().first { it.tamilDisplay == tamilDisplay }
        }
    }
}

enum class Topic(val tamil: String) {
    Athikaram("அதிகாரம்"),
    Porul("பொருள்"),
    Kural("குறள்"),
    FirstWord("முதல் வார்த்தை"),
    LastWord("கடைசி வார்த்தை"),
    AllKurals("அனைத்து குறள்கள்");

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
  var selectedTopic: Topic,
  var thirukkurals: List<Thirukkural>,
  var athikaramState: AthikaramState,
  var thirukkuralState: ThirukkuralState,
  var firstWordState: FirstWordState,
  var lastWordState: LastWordState,
  var timerState: TimerState,
  var showAnswer: Boolean
)

data class TimerState(
    var isLive: Boolean = false,
    var isPaused: Boolean = false,
    var time: Long = 180,
    var count: Int = 0)

data class AthikaramState(
  override var index: Int,
  override var thirukkurals: List<Thirukkural>,
  override var history: MutableList<Int>,
  override var answers: MutableSet<String>,
  val athikarams: List<String>
) : HistoryState {
    constructor(thirukkurals: List<Thirukkural>) : this(
        nextIndex(0, getAthikarams(thirukkurals).size),
        thirukkurals,
        mutableListOf(),
        mutableSetOf(),
        getAthikarams(thirukkurals)
    )
    fun getCurrent(): String = athikarams[index]
    fun goNext(): Int {
        answers.add(getCurrent())
        goNext(athikarams.size)
        return answers.size
    }
    fun goPrevious() = goPrevious(athikarams.size)
    fun getAnswers(): List<Thirukkural> = thirukkurals.filter { it.athikaram == getCurrent() }
}

private fun getAthikarams(thirukkurals: List<Thirukkural>) = thirukkurals.map { it.athikaram }.distinct()

data class ThirukkuralState(
  override var index: Int,
  override var thirukkurals: List<Thirukkural>,
  override var history: MutableList<Int>,
  override var answers: MutableSet<String>,
  val kurals: List<Thirukkural>
) : HistoryState {
    constructor(thirukkurals: List<Thirukkural>): this(
        nextIndex(0, thirukkurals.size), thirukkurals, mutableListOf(), mutableSetOf(), thirukkurals)
    fun getCurrent(): Thirukkural = kurals[index]
    fun goNext(): Int {
        answers.add(getCurrent().porul)
        goNext(kurals.size)
        return answers.size
    }
    fun goPrevious() = goPrevious(kurals.size)
}

data class FirstWordState(
  override var index: Int,
  override var thirukkurals: List<Thirukkural>,
  override var history: MutableList<Int>,
  override var answers: MutableSet<String>,
  val words: List<String>
) : HistoryState {
    constructor(thirukkurals: List<Thirukkural>): this(
        nextIndex(0, getFirstWords(thirukkurals).size),
        thirukkurals,
        mutableListOf(),
        mutableSetOf(),
        getFirstWords(thirukkurals)
    )
    fun getCurrent(): String = words[index]
    fun goNext(): Int {
        answers.add(getCurrent())
        goNext(words.size)
        return answers.size
    }
    fun goPrevious() = goPrevious(words.size)
    fun getAnswers(): List<Thirukkural> = thirukkurals.filter { it.words.first() == getCurrent() }
}

data class LastWordState(
  override var index: Int,
  override var thirukkurals: List<Thirukkural>,
  override var history: MutableList<Int>,
  override var answers: MutableSet<String>,
  val words: List<String>
) : HistoryState {
    constructor(thirukkurals: List<Thirukkural>): this(
        nextIndex(0, getLastWords(thirukkurals).size),
        thirukkurals,
        mutableListOf(),
        mutableSetOf(),
        getLastWords(thirukkurals)
    )
    fun getCurrent(): String = words[index]
    fun goNext(): Int {
        answers.add(getCurrent())
        goNext(words.size)
        return answers.size
    }
    fun goPrevious() = goPrevious(words.size)
    fun getAnswers(): List<Thirukkural> = thirukkurals.filter { it.words.last() == getCurrent() }
}

private fun getFirstWords(thirukkurals: List<Thirukkural>) = thirukkurals.map { it.words.first() }.distinct()
private fun getLastWords(thirukkurals: List<Thirukkural>) = thirukkurals.map { it.words.last() }.distinct()

interface HistoryState {
    var index: Int
    var thirukkurals: List<Thirukkural>
    var history: MutableList<Int>
    var answers: MutableSet<String>
    fun goNext(maxIndex: Int) {
        if (history.isEmpty()) {
            history = generateRandomList(maxIndex)
            history.remove(index)
            history.add(index)
        }
        val nextIndex = history.removeFirst()
        history.add(nextIndex)
        println("${this::class} Current: $index to New: $nextIndex of Total: $maxIndex")
        index = nextIndex
    }
    fun goPrevious(maxIndex: Int) {
        if (history.isEmpty()) {
            history = generateRandomList(maxIndex)
            history.remove(index)
            history.add(index)
        }
        var nextIndex = history.removeLast()
        history.add(0, nextIndex)
        nextIndex = history.last()
        println("${this::class} Current: $index to New: $nextIndex of Total: $maxIndex")
        index = nextIndex
    }
    fun clearAnswers() = answers.clear()
}

fun generateRandomList(maxIndex: Int): MutableList<Int> {
    var count = maxIndex - 1
    val randomList = generateSequence { (count--).takeIf { it >= 0 } }.toMutableList()
    randomList.shuffle()
    return randomList
}

fun nextIndex(currentIndex: Int, maxIndex: Int): Int {
    var newIndex: Int
    do {
        newIndex = Random.nextInt(maxIndex)
    } while (newIndex == currentIndex && maxIndex != 1)
    println("Current: $currentIndex to New: $newIndex of Total: $maxIndex")
    return newIndex
}
