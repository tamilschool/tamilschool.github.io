import java.time.LocalDateTime

plugins {
  id("org.jetbrains.kotlin.js") version "1.4.10"
  kotlin("plugin.serialization") version "1.4.10"
}

group = "org.dreamuth"
version = "2.0"

repositories {
  maven {
    url = uri("https://maven.pkg.jetbrains.space/kotlin/p/kotlin/kotlin-js-wrappers")
  }
  maven {
    url = uri("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
  }
  mavenCentral()
}

dependencies {
  implementation(kotlin("stdlib-js"))

  //React, React DOM + Wrappers (chapter 3)
  implementation("org.jetbrains:kotlin-react:16.13.1-pre.110-kotlin-1.4.0")
  implementation("org.jetbrains:kotlin-react-dom:16.13.1-pre.110-kotlin-1.4.0")
  implementation(npm("react", "16.13.1"))
  implementation(npm("react-dom", "16.13.1"))

  //Kotlin Styled (chapter 3)
  implementation("org.jetbrains:kotlin-styled:1.0.0-pre.110-kotlin-1.4.0")
  implementation(npm("styled-components", "~5.1.1"))
  implementation(npm("inline-style-prefixer", "~6.0.0"))

  //Coroutines (chapter 8)
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
  implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.4.1")
}


tasks.create("createBuildInfo") {
  doLast {
    val buildInfo = LocalDateTime.now().toString()
    val buildInfoFile = File("${project.buildDir}/distributions/build-info.txt")
    buildInfoFile.writeText(buildInfo)
  }
}

tasks.getByName("build").finalizedBy("createBuildInfo")

kotlin {
  js {
    browser {
      webpackTask {
        cssSupport.enabled = true
      }

      runTask {
        cssSupport.enabled = true
      }

      testTask {
        useKarma {
          useChromeHeadless()
          webpackConfig.cssSupport.enabled = true
        }
      }
    }
    binaries.executable()
  }
}
