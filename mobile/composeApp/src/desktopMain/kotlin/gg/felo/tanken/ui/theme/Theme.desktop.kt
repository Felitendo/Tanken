package gg.felo.tanken.ui.theme

import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontVariation
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.platform.Font

/**
 * The desktop verification build approximates iOS's SF with bundled Inter
 * (variable font, one instance per weight the design system uses).
 */
private val inter: FontFamily by lazy {
    val weights = listOf(
        FontWeight.Normal,
        FontWeight.Medium,
        FontWeight.SemiBold,
        FontWeight.Bold,
        FontWeight.ExtraBold,
    )
    FontFamily(
        weights.map { w ->
            Font(
                resource = "fonts/InterVariable.ttf",
                weight = w,
                style = FontStyle.Normal,
                variationSettings = FontVariation.Settings(FontVariation.weight(w.weight)),
            )
        },
    )
}

actual fun platformFontFamily(): FontFamily = inter
