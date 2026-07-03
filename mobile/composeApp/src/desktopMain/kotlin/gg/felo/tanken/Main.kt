package gg.felo.tanken

import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.application
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import java.awt.Robot
import java.io.File
import javax.imageio.ImageIO
import kotlin.system.exitProcess

/**
 * Desktop entry point. Two modes:
 *  - default: interactive 390x844 window for manual poking
 *  - `--shot <out.png> [--delay <ms>]`: launches the same window under Xvfb, waits for the UI to
 *    settle, captures the window with AWT Robot and exits. This is the visual-verification
 *    harness used to compare the app against the live PWA at every phase gate.
 */
fun main(args: Array<String>) {
    val shotOut = args.optionValue("--shot")
    val delayMs = args.optionValue("--delay")?.toLongOrNull() ?: 8000L
    val state = args.optionValue("--state")
    val themeMode = when (args.optionValue("--theme")) {
        "light" -> gg.felo.tanken.ui.theme.ThemeMode.Light
        else -> gg.felo.tanken.ui.theme.ThemeMode.Dark
    }
    val graph = AppGraph()

    application(exitProcessOnExit = true) {
        Window(
            onCloseRequest = ::exitApplication,
            title = "Tanken",
            state = WindowState(size = DpSize(390.dp, 844.dp), position = WindowPosition(0.dp, 0.dp)),
            resizable = false,
            undecorated = shotOut != null,
        ) {
            App(graph, initialState = state, themeOverride = themeMode)
            if (shotOut != null) {
                LaunchedEffect(Unit) {
                    delay(delayMs)
                    val bounds = window.bounds
                    withContext(Dispatchers.IO) {
                        val image = Robot().createScreenCapture(bounds)
                        val file = File(shotOut)
                        file.parentFile?.mkdirs()
                        ImageIO.write(image, "png", file)
                        println("SHOT_WRITTEN ${file.absolutePath}")
                    }
                    exitProcess(0)
                }
            }
        }
    }
}

private fun Array<String>.optionValue(name: String): String? {
    val i = indexOf(name)
    return if (i >= 0 && i + 1 < size) this[i + 1] else null
}
