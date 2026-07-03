package gg.felo.tanken.map

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

/** Blue user-location dot with a soft pulse, like Leaflet's location marker. */
@Composable
fun LocationPuck(modifier: Modifier = Modifier) {
    val pulse = rememberInfiniteTransition()
    val phase by pulse.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(2200, easing = LinearEasing), RepeatMode.Restart),
    )
    Canvas(modifier.size(44.dp)) {
        val c = center
        val maxR = size.minDimension / 2f
        drawCircle(Color(0xFF0A84FF).copy(alpha = (1f - phase) * 0.25f), radius = maxR * (0.4f + phase * 0.6f), center = c)
        drawCircle(Color.White, radius = 9.dp.toPx() / 2 + 1.5.dp.toPx(), center = c)
        drawCircle(Color(0xFF0A84FF), radius = 9.dp.toPx() / 2, center = c)
    }
}
