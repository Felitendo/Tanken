package gg.felo.tanken

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.foundation.text.BasicText
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

enum class AppTab(val title: String) {
    Map("Karte"),
    History("Verlauf"),
    Stats("Stats"),
    Settings("Einstellungen"),
}

@Composable
fun App() {
    var tab by remember { mutableStateOf(AppTab.Map) }
    Column(Modifier.fillMaxSize().background(Color(0xFF000000))) {
        Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
            BasicText(
                text = tab.title,
                style = TextStyle(color = Color.White, fontSize = 24.sp),
            )
        }
        Row(
            Modifier
                .fillMaxWidth()
                .background(Color(0xFF1C1C1E))
                .windowInsetsPadding(WindowInsets.navigationBars)
                .height(56.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
        ) {
            AppTab.entries.forEach { t ->
                Box(
                    Modifier.weight(1f).fillMaxSize().clickable { tab = t },
                    contentAlignment = Alignment.Center,
                ) {
                    BasicText(
                        text = t.title,
                        style = TextStyle(
                            color = if (t == tab) Color(0xFF0A84FF) else Color(0xFF98989E),
                            fontSize = 11.sp,
                        ),
                    )
                }
            }
        }
    }
}
