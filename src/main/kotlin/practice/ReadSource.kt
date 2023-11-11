package practice

import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

fun parseSource(sourceTxt: String, groupsData: String): List<Thirukkural> {
    val kuralJson = Json.decodeFromString<ThirukkuralCollection>(sourceTxt)
    val groupsJson = Json.decodeFromString<GroupsCollection>(groupsData)
    val groupsMap = mutableMapOf<Int, MutableSet<Group>>()

    groupsJson.II.split(",").forEach {
        val entry = groupsMap.getOrElse(it.toInt()) { mutableSetOf() }
        entry.add(Group.II)
        groupsMap[it.toInt()] = entry
    }
    groupsJson.III.split(",").forEach {
        val entry = groupsMap.getOrElse(it.toInt()) { mutableSetOf() }
        entry.add(Group.III)
        groupsMap[it.toInt()] = entry
    }

    return kuralJson.kural.map {
        Thirukkural(
            athikaramNo = it.adikaramNumber,
            athikaram = it.adikaramName,
            kuralNo = it.number,
            kural = KuralOnly(it.line1, it.line2),
            porul = it.salamanPapa,
            porulMuVaradha = it.muVaradha,
            porulSalamanPapa = it.salamanPapa,
            porulMuKarunanidhi = it.muKarunanidhi,
            words = getWords("${it.line1} ${it.line2}"),
            group = groupsMap.getOrElse(it.number) { setOf() }
        )
    }
        .toList()
}

fun getWords(line: String): List<String> {
    val list = mutableListOf<String>()
    var currentWord = ""
    val charArray = line.toCharArray()
    for (char in charArray) {
        when (char.toInt()) {
            // Space, Dot, Zero-width non-joiner
            32, 39, 44, 46, 58, 8204 -> {
                if (currentWord.isNotBlank()) {
                    list.add(currentWord)
                }
                currentWord = ""
            }

            else -> {
                currentWord += char
            }
        }
    }
    if (currentWord.isNotBlank()) list.add(currentWord)
    return list
}
