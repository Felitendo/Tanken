package gg.felo.tanken.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Design tokens transcribed from the PWA's `public/style.css` `:root` blocks.
 * Every color, spacing and radius in the app must come from here so the app
 * and the website stay visually interchangeable.
 */
@Immutable
data class TankenColors(
    val isDark: Boolean,
    val text: Color,
    val text2: Color,
    val bg: Color,
    val bgSecondary: Color,
    val bgElevated: Color,
    val hint: Color,
    val separator: Color,
    val accent: Color,
    val accentText: Color,
    val favorite: Color,
    val good: Color,
    val okay: Color,
    val bad: Color,
)

val LightColors = TankenColors(
    isDark = false,
    text = Color(0xFF000000),
    text2 = Color(0xFF3C3C43),
    bg = Color(0xFFFFFFFF),
    bgSecondary = Color(0xFFF2F2F7),
    bgElevated = Color(0xFFFFFFFF),
    hint = Color(0xFF8E8E93),
    separator = Color(0x1F3C3C43), // rgba(60,60,67,0.12)
    accent = Color(0xFF007AFF),
    accentText = Color(0xFFFFFFFF),
    favorite = Color(0xFFFFB800),
    good = Color(0xFF34C759),
    okay = Color(0xFFFF9500),
    bad = Color(0xFFFF3B30),
)

val DarkColors = TankenColors(
    isDark = true,
    text = Color(0xFFFFFFFF),
    text2 = Color(0xFFEBEBF5),
    bg = Color(0xFF000000),
    bgSecondary = Color(0xFF1C1C1E),
    bgElevated = Color(0xFF2C2C2E),
    hint = Color(0xFF98989E),
    separator = Color(0x1AFFFFFF), // rgba(255,255,255,0.1)
    accent = Color(0xFF0A84FF),
    accentText = Color(0xFFFFFFFF),
    favorite = Color(0xFFFFB800),
    good = Color(0xFF34C759),
    okay = Color(0xFFFF9500),
    bad = Color(0xFFFF3B30),
)

enum class ThemeMode { Auto, Light, Dark }

/** Spacing scale (`--sp-1`..`--sp-8`). */
object Sp {
    val s1 = 4.dp
    val s2 = 8.dp
    val s3 = 12.dp
    val s4 = 16.dp
    val s5 = 20.dp
    val s6 = 24.dp
    val s7 = 32.dp
    val s8 = 40.dp
}

/** Border-radius scale (`--r-xs`..`--r-pill`). */
object Rad {
    val xs = 6.dp
    val sm = 8.dp
    val md = 12.dp
    val lg = 16.dp
    val xl = 20.dp
    val pill = 999.dp
}

val LocalColors = staticCompositionLocalOf { DarkColors }
val LocalAppFont = staticCompositionLocalOf<FontFamily> { FontFamily.Default }

/** Base text style: 15px system font like the PWA's `html, body` rule. */
val LocalTextStyle = staticCompositionLocalOf { TextStyle.Default }

object Theme {
    val colors: TankenColors
        @Composable get() = LocalColors.current
    val font: FontFamily
        @Composable get() = LocalAppFont.current
}

/** Platform UI font: SF on iOS (system default), bundled Inter on desktop. */
expect fun platformFontFamily(): FontFamily

@Composable
fun TankenTheme(mode: ThemeMode = ThemeMode.Auto, content: @Composable () -> Unit) {
    val dark = when (mode) {
        ThemeMode.Auto -> isSystemInDarkTheme()
        ThemeMode.Light -> false
        ThemeMode.Dark -> true
    }
    val colors = if (dark) DarkColors else LightColors
    val font = platformFontFamily()
    CompositionLocalProvider(
        LocalColors provides colors,
        LocalAppFont provides font,
        LocalTextStyle provides TextStyle(
            color = colors.text,
            fontSize = 15.sp,
            fontFamily = font,
        ),
        content = content,
    )
}
