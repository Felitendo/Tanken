package gg.felo.tanken.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.ui.theme.Theme

data class TabSpec(val icon: ImageVector, val label: String)

/** `.tab-bar`: fixed bottom bar, secondary bg, hairline top border. */
@Composable
fun TabBar(
    tabs: List<TabSpec>,
    selected: Int,
    onSelect: (Int) -> Unit,
) {
    val c = Theme.colors
    Column(Modifier.fillMaxWidth().background(c.bgSecondary)) {
        Box(Modifier.fillMaxWidth().height(0.5.dp).background(c.separator))
        Row(
            Modifier
                .fillMaxWidth()
                .height(56.dp)
                .padding(horizontal = 6.dp, vertical = 4.dp),
        ) {
            tabs.forEachIndexed { i, tab ->
                val active = i == selected
                val fg by animateColorAsState(if (active) c.accent else c.hint, tween(200))
                val bg by animateColorAsState(
                    if (active) c.accent.copy(alpha = 0.12f) else c.accent.copy(alpha = 0f),
                    tween(200),
                )
                Column(
                    Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(bg)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                        ) { onSelect(i) }
                        .padding(vertical = 5.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    AppIcon(tab.icon, tint = fg, size = 24.dp)
                    Text(
                        tab.label,
                        style = TextStyle(
                            fontSize = 10.sp,
                            fontWeight = if (active) FontWeight.SemiBold else FontWeight.Medium,
                            color = fg,
                        ),
                        maxLines = 1,
                        modifier = Modifier.padding(top = 2.dp),
                    )
                }
            }
        }
        Box(Modifier.windowInsetsPadding(WindowInsets.navigationBars))
    }
}
