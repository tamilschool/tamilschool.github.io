package data

// Keyboard keys
class MyKey(val key: Array<String>)
class MyHandler(val key: (Any) -> Unit)

val domain = "https://raw.githubusercontent.com"
val account = "tamilschool/tamilschool.github.io"
val path = "main/src/main/resources/files"

enum class ScoreType {
  KuralOnly, KuralPorul, PottiSuttru
}

enum class Group(val tamilDisplay: String, val englishDisplay: String, val type: ScoreType) {
  IA("பிரிவு 1 (முன்மழலை/மழலை)", "6 & Below", ScoreType.KuralOnly),
  IB("பிரிவு 1", "6 & Below", ScoreType.KuralPorul),
  II("பிரிவு 2", "7 to 9", ScoreType.PottiSuttru),
  III("பிரிவு 3", "10 & Above", ScoreType.PottiSuttru);
}
