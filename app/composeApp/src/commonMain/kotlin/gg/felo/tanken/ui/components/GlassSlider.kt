package gg.felo.tanken.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import gg.felo.tanken.ui.theme.Radii
import gg.felo.tanken.ui.theme.TankenTheme

/**
 * Liquid-glass styled slider. Thin wrapper over the Material3 [Slider] with fully custom glass
 * track and thumb; value handling is passed straight through.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GlassSlider(
    value: Float,
    onValueChange: (Float) -> Unit,
    valueRange: ClosedFloatingPointRange<Float>,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    onValueChangeFinished: (() -> Unit)? = null,
) {
    val span = (valueRange.endInclusive - valueRange.start).takeIf { it > 0f } ?: 1f
    Slider(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        enabled = enabled,
        valueRange = valueRange,
        onValueChangeFinished = onValueChangeFinished,
        thumb = { GlassThumb() },
        track = { state: SliderState ->
            val fraction = ((state.value - valueRange.start) / span).coerceIn(0f, 1f)
            GlassTrack(fraction)
        },
    )
}

@Composable
private fun GlassTrack(activeFraction: Float) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(14.dp)
            .glassSurface(shape = Radii.pill, tint = null, strong = true),
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(activeFraction)
                .fillMaxHeight()
                .glassSurface(shape = Radii.pill, tint = TankenTheme.colors.accent, strong = true),
        )
    }
}

@Composable
private fun GlassThumb() {
    Box(
        modifier = Modifier
            .size(28.dp)
            .glassSurface(shape = CircleShape, tint = TankenTheme.colors.accent, strong = true),
    )
}
