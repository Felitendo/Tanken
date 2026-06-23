package gg.felo.tanken.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

/**
 * Palette ported 1:1 from the website (public/style.css). iOS system colours; the app uses
 * the same tokens so it visually matches tanken.felo.gg in both light and dark mode.
 */
@Immutable
data class TankenColors(
    val textPrimary: Color,
    val textSecondary: Color,
    val textHint: Color,
    val bgPrimary: Color,
    val bgSecondary: Color,
    val bgElevated: Color,
    val accent: Color,
    val good: Color,
    val okay: Color,
    val bad: Color,
    val favorite: Color,
    val separator: Color,
    val isDark: Boolean,
)

val LightColors = TankenColors(
    textPrimary = Color(0xFF000000),
    textSecondary = Color(0xFF3C3C43),
    textHint = Color(0xFF8E8E93),
    bgPrimary = Color(0xFFFFFFFF),
    bgSecondary = Color(0xFFF2F2F7),
    bgElevated = Color(0xFFFFFFFF),
    accent = Color(0xFF007AFF),
    good = Color(0xFF34C759),
    okay = Color(0xFFFF9500),
    bad = Color(0xFFFF3B30),
    favorite = Color(0xFFFFB800),
    separator = Color(0x1F3C3C43),
    isDark = false,
)

val DarkColors = TankenColors(
    textPrimary = Color(0xFFFFFFFF),
    textSecondary = Color(0xFFEBEBF5),
    textHint = Color(0xFF8E8E93),
    bgPrimary = Color(0xFF000000),
    bgSecondary = Color(0xFF1C1C1E),
    bgElevated = Color(0xFF2C2C2E),
    accent = Color(0xFF0A84FF),
    good = Color(0xFF34C759),
    okay = Color(0xFFFF9500),
    bad = Color(0xFFFF3B30),
    favorite = Color(0xFFFFD60A),
    separator = Color(0x1AFFFFFF),
    isDark = true,
)
