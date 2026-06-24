package gg.felo.tanken.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ProvideTextStyle
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import gg.felo.tanken.ui.theme.Radii
import gg.felo.tanken.ui.theme.TankenTheme

/**
 * Liquid-glass styled button. Drop-in replacement for the Material3 `Button`/`OutlinedButton`:
 * its [content] is a [RowScope] lambda, so existing `Icon` + `Spacer` + `Text` usages keep working.
 *
 * @param prominent accent-tinted glass for primary actions; when false a neutral frosted-glass
 *   variant (replaces `OutlinedButton`).
 */
@Composable
fun GlassButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    prominent: Boolean = true,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = TankenTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val scale by animateFloatAsState(if (pressed) 0.96f else 1f)

    val contentColor = if (prominent) Color.White else colors.accent
    val tint = if (prominent) colors.accent else null

    Row(
        horizontalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
            .graphicsLayer { scaleX = scale; scaleY = scale }
            .alpha(if (enabled) 1f else 0.5f)
            .glassSurface(shape = Radii.pill, tint = tint, strong = true)
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                onClick = onClick,
            )
            .defaultMinSize(minWidth = 64.dp, minHeight = 46.dp)
            .padding(horizontal = 20.dp, vertical = 12.dp),
    ) {
        CompositionLocalProvider(LocalContentColor provides contentColor) {
            ProvideTextStyle(MaterialTheme.typography.labelLarge) { content() }
        }
    }
}
