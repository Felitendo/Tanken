package gg.felo.tanken.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import gg.felo.tanken.ui.theme.TankenTheme

/**
 * Minimal price line chart: plots [values] as a smooth accent line with a soft gradient fill and a
 * faint min/max band. Purely visual — axis labels are rendered by the caller. Mirrors the website's
 * history chart aesthetic (single accent line on a translucent area).
 */
@Composable
fun LineChart(
    values: List<Double>,
    modifier: Modifier = Modifier,
    height: Dp = 160.dp,
    lineColor: Color = TankenTheme.colors.accent,
) {
    val accent = lineColor
    Box(modifier.fillMaxWidth().height(height)) {
        if (values.size < 2) return@Box
        val min = values.min()
        val max = values.max()
        val span = (max - min).takeIf { it > 1e-6 } ?: 1.0
        Canvas(Modifier.fillMaxWidth().height(height)) {
            val w = size.width
            val h = size.height
            val padV = h * 0.12f
            val usableH = h - padV * 2
            val n = values.size
            fun px(i: Int) = if (n == 1) 0f else w * i / (n - 1)
            fun py(v: Double) = padV + (1f - ((v - min) / span).toFloat()) * usableH

            val line = Path()
            val area = Path()
            values.forEachIndexed { i, v ->
                val x = px(i)
                val y = py(v)
                if (i == 0) {
                    line.moveTo(x, y)
                    area.moveTo(x, h)
                    area.lineTo(x, y)
                } else {
                    line.lineTo(x, y)
                    area.lineTo(x, y)
                }
            }
            area.lineTo(px(n - 1), h)
            area.close()

            drawPath(
                path = area,
                brush = Brush.verticalGradient(
                    listOf(accent.copy(alpha = 0.22f), accent.copy(alpha = 0.0f)),
                ),
            )
            drawPath(path = line, color = accent, style = Stroke(width = 3f))
            // End dot
            drawCircle(accent, radius = 4f, center = Offset(px(n - 1), py(values.last())))
        }
    }
}

/** Horizontal proportional bar (0..1) used for weekday tiles and station ranking. */
@Composable
fun BarFill(
    fraction: Float,
    modifier: Modifier = Modifier,
    color: Color = TankenTheme.colors.good,
    track: Color = TankenTheme.colors.bgSecondary,
    height: Dp = 6.dp,
) {
    val f = fraction.coerceIn(0f, 1f)
    Canvas(modifier.fillMaxWidth().height(height)) {
        val r = size.height / 2
        drawRoundRect(
            color = track,
            cornerRadius = androidx.compose.ui.geometry.CornerRadius(r, r),
        )
        if (f > 0f) {
            drawRoundRect(
                color = color,
                size = androidx.compose.ui.geometry.Size(size.width * f, size.height),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(r, r),
            )
        }
    }
}
