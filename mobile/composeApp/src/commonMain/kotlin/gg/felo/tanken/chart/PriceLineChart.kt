package gg.felo.tanken.chart

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.text.drawText
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.util.twoDecimals
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

/** One chart point: x label, value, and its rank color. */
data class ChartPoint(val label: String, val value: Double, val color: Color)

/** Maps values to the PWA's per-window rank colors (`rankColor`). */
fun rankColors(values: List<Double>): List<Color> {
    if (values.isEmpty()) return emptyList()
    val lo = values.min()
    val hi = values.max()
    val range = max(hi - lo, 0.0001)
    return values.map { PriceColor.rank((it - lo) / range) }
}

/**
 * Canvas replica of the PWA's Chart.js line chart: smoothed line with a
 * horizontal gradient through per-point rank colors, warm vertical area fill
 * (red -> orange -> yellow), dot markers with surface-colored borders, an
 * emphasized last point, hint-colored y labels ("1,68€") and x labels.
 */
@Composable
fun PriceLineChart(
    points: List<ChartPoint>,
    modifier: Modifier = Modifier,
    emphasizeLast: Boolean = true,
    yFormatter: (Double) -> String = { twoDecimals(it) + "€" },
    onPointTap: ((Int) -> Unit)? = null,
) {
    val c = Theme.colors
    val textMeasurer = rememberTextMeasurer()
    val labelStyle = TextStyle(fontSize = 11.sp, color = c.hint, fontFamily = Theme.font)

    Canvas(
        modifier.fillMaxSize().pointerInput(points, onPointTap) {
            if (onPointTap != null) {
                detectTapGestures { tap ->
                    // Hit the nearest x position within the plot area.
                    val leftPad = 52.dp.toPx()
                    val rightPad = 12.dp.toPx()
                    val plotW = size.width - leftPad - rightPad
                    if (points.size > 1 && plotW > 0) {
                        val step = plotW / (points.size - 1)
                        val idx = ((tap.x - leftPad) / step).let { kotlin.math.round(it) }.toInt()
                        if (idx in points.indices && abs(tap.x - (leftPad + idx * step)) < step * 0.6f) {
                            onPointTap(idx)
                        }
                    }
                }
            }
        },
    ) {
        if (points.isEmpty()) return@Canvas
        val leftPad = 52.dp.toPx()
        val rightPad = 12.dp.toPx()
        val topPad = 14.dp.toPx()
        val bottomPad = 26.dp.toPx()
        val plotW = size.width - leftPad - rightPad
        val plotH = size.height - topPad - bottomPad
        if (plotW <= 0 || plotH <= 0) return@Canvas

        val values = points.map { it.value }
        val vLo = values.min()
        val vHi = values.max()
        val pad = max((vHi - vLo) * 0.18, 0.005)
        val yLo = vLo - pad
        val yHi = vHi + pad
        fun yOf(v: Double): Float = (topPad + plotH * (1.0 - (v - yLo) / (yHi - yLo))).toFloat()
        fun xOf(i: Int): Float =
            if (points.size == 1) leftPad + plotW / 2f
            else leftPad + plotW * i / (points.size - 1f)

        // Grid + y labels
        niceTicks(yLo, yHi).forEach { tick ->
            val y = yOf(tick)
            drawLine(c.separator, Offset(leftPad, y), Offset(size.width - rightPad, y), strokeWidth = 1f)
            val text = textMeasurer.measure(yFormatter(tick), labelStyle)
            drawText(text, topLeft = Offset(leftPad - text.size.width - 8.dp.toPx(), y - text.size.height / 2f))
        }

        // X labels (thinned when dense)
        val labelEvery = max(1, points.size / 7)
        points.forEachIndexed { i, point ->
            if (i % labelEvery == 0 || i == points.lastIndex) {
                val text = textMeasurer.measure(point.label, labelStyle)
                drawText(
                    text,
                    topLeft = Offset(
                        (xOf(i) - text.size.width / 2f).coerceIn(0f, size.width - text.size.width),
                        size.height - bottomPad + 8.dp.toPx(),
                    ),
                )
            }
        }

        // Smoothed line path (cardinal spline, Chart.js tension 0.4)
        val positions = points.indices.map { Offset(xOf(it), yOf(points[it].value)) }
        val linePath = Path().apply {
            moveTo(positions.first().x, positions.first().y)
            if (positions.size == 2) {
                lineTo(positions[1].x, positions[1].y)
            } else {
                val t = 0.4f / 2f
                for (i in 0 until positions.lastIndex) {
                    val p0 = positions.getOrElse(i - 1) { positions[i] }
                    val p1 = positions[i]
                    val p2 = positions[i + 1]
                    val p3 = positions.getOrElse(i + 2) { p2 }
                    val c1 = Offset(p1.x + (p2.x - p0.x) * t, p1.y + (p2.y - p0.y) * t)
                    val c2 = Offset(p2.x - (p3.x - p1.x) * t, p2.y - (p3.y - p1.y) * t)
                    cubicTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y)
                }
            }
        }

        // Warm area fill under the line
        val fillPath = Path().apply {
            addPath(linePath)
            lineTo(positions.last().x, size.height - bottomPad)
            lineTo(positions.first().x, size.height - bottomPad)
            close()
        }
        drawPath(
            fillPath,
            Brush.verticalGradient(
                colors = listOf(
                    Color(0xFFFF3B30).copy(alpha = 0.34f),
                    Color(0xFFFF9500).copy(alpha = 0.18f),
                    Color(0xFFFFCC00).copy(alpha = 0.04f),
                ),
                startY = topPad,
                endY = size.height - bottomPad,
            ),
        )

        // Gradient stroke through the point colors
        val stroke = if (points.size == 1) {
            Brush.horizontalGradient(listOf(points[0].color, points[0].color))
        } else {
            Brush.horizontalGradient(
                colorStops = points.mapIndexed { i, point ->
                    (i / (points.size - 1f)) to point.color
                }.toTypedArray(),
                startX = leftPad,
                endX = size.width - rightPad,
            )
        }
        drawPath(
            linePath,
            stroke,
            style = Stroke(width = 3.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round),
        )

        // Point markers
        val baseRadius = if (points.size < 25) 4.dp.toPx() else 2.5.dp.toPx()
        positions.forEachIndexed { i, position ->
            val last = i == positions.lastIndex && emphasizeLast
            val radius = if (last) 7.dp.toPx() else baseRadius
            if (last) {
                drawCircle(points[i].color.copy(alpha = 0.28f), radius * 2.1f, position)
            }
            drawCircle(c.bgSecondary, radius + 2.5.dp.toPx() / 2, position)
            drawCircle(points[i].color, radius, position)
        }
    }
}
