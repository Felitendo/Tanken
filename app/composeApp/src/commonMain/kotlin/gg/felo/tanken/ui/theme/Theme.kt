package gg.felo.tanken.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.staticCompositionLocalOf
import org.koin.compose.koinInject
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** Spacing scale from public/style.css (--sp-1 … --sp-8). */
object Spacing {
    val xs = 4.dp
    val s = 8.dp
    val m = 12.dp
    val l = 16.dp
    val xl = 20.dp
    val xxl = 24.dp
    val xxxl = 32.dp
    val huge = 40.dp
}

/** Corner radii (--r-xs … --r-pill). */
object Radii {
    val xs = RoundedCornerShape(6.dp)
    val sm = RoundedCornerShape(8.dp)
    val md = RoundedCornerShape(12.dp)
    val lg = RoundedCornerShape(16.dp)
    val xl = RoundedCornerShape(20.dp)
    val pill = RoundedCornerShape(999.dp)
}

val LocalTankenColors = staticCompositionLocalOf { LightColors }

/** Convenience accessor: `TankenTheme.colors`. */
object TankenTheme {
    val colors: TankenColors
        @Composable get() = LocalTankenColors.current
}

private val AppTypography = Typography(
    headlineLarge = TextStyle(fontSize = 28.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.5).sp),
    titleLarge = TextStyle(fontSize = 17.sp, fontWeight = FontWeight.SemiBold, letterSpacing = (-0.2).sp),
    titleMedium = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.SemiBold),
    bodyLarge = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.Normal, lineHeight = 21.sp),
    bodyMedium = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Normal),
    labelLarge = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 0.6.sp),
)

/**
 * Theme root that honours the user's appearance setting (Auto/Light/Dark) from [AppConfig].
 * Use this at the top of each platform's Compose entry point.
 */
@Composable
fun TankenThemeRoot(content: @Composable () -> Unit) {
    val config = koinInject<gg.felo.tanken.state.AppConfig>()
    val themeName by config.themeMode.collectAsState()
    val dark = when (themeName) {
        gg.felo.tanken.state.ThemeMode.LIGHT.name -> false
        gg.felo.tanken.state.ThemeMode.DARK.name -> true
        else -> isSystemInDarkTheme()
    }
    TankenTheme(darkTheme = dark, content = content)
}

@Composable
fun TankenTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colors = if (darkTheme) DarkColors else LightColors
    val scheme = if (darkTheme) {
        darkColorScheme(
            primary = colors.accent,
            background = colors.bgPrimary,
            surface = colors.bgElevated,
            onPrimary = Color_White,
            onBackground = colors.textPrimary,
            onSurface = colors.textPrimary,
            error = colors.bad,
        )
    } else {
        lightColorScheme(
            primary = colors.accent,
            background = colors.bgPrimary,
            surface = colors.bgElevated,
            onPrimary = Color_White,
            onBackground = colors.textPrimary,
            onSurface = colors.textPrimary,
            error = colors.bad,
        )
    }
    CompositionLocalProvider(LocalTankenColors provides colors) {
        MaterialTheme(
            colorScheme = scheme,
            typography = AppTypography,
            content = content,
        )
    }
}

private val Color_White = androidx.compose.ui.graphics.Color.White
