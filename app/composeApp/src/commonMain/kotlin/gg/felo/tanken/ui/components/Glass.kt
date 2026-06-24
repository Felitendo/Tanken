package gg.felo.tanken.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.dp
import gg.felo.tanken.ui.theme.TankenTheme

/**
 * "Liquid glass" surface approximation for Compose. Real backdrop blur is not available in Compose
 * Multiplatform, so the look is built from a translucent vertical gradient (brighter top → darker
 * bottom), a bright top gloss, a light hairline border and a soft drop shadow.
 *
 * @param tint when set (e.g. the accent colour) the surface is tinted glass for prominent actions;
 *   when null it is neutral frosted glass that stays visible on light card backgrounds.
 * @param strong renders the bolder, more obvious variant requested for the app.
 */
@Composable
fun Modifier.glassSurface(
    shape: Shape,
    tint: Color? = null,
    strong: Boolean = true,
): Modifier {
    val isDark = TankenTheme.colors.isDark

    val fillTop: Color
    val fillBottom: Color
    if (tint != null) {
        fillTop = tint.copy(alpha = if (strong) 0.95f else 0.55f)
        fillBottom = tint.copy(alpha = if (strong) 0.70f else 0.32f)
    } else if (isDark) {
        fillTop = Color.White.copy(alpha = if (strong) 0.24f else 0.14f)
        fillBottom = Color.White.copy(alpha = if (strong) 0.08f else 0.05f)
    } else {
        // Neutral frosted glass on a white card needs a faint dark base to read as a surface.
        fillTop = Color.Black.copy(alpha = if (strong) 0.10f else 0.06f)
        fillBottom = Color.Black.copy(alpha = if (strong) 0.04f else 0.02f)
    }

    val gloss = Color.White.copy(alpha = if (strong) 0.55f else 0.30f)
    val borderTop = Color.White.copy(alpha = if (isDark) 0.45f else 0.75f)
    val borderBottom = Color.White.copy(alpha = if (isDark) 0.10f else 0.20f)

    return this
        .shadow(elevation = if (strong) 10.dp else 4.dp, shape = shape, clip = false)
        .clip(shape)
        .background(Brush.verticalGradient(listOf(fillTop, fillBottom)))
        .background(Brush.verticalGradient(0.0f to gloss, 0.45f to Color.Transparent))
        .border(1.dp, Brush.verticalGradient(listOf(borderTop, borderBottom)), shape)
}
