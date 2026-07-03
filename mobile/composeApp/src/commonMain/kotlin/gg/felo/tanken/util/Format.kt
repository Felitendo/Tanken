package gg.felo.tanken.util

import kotlin.math.abs
import kotlin.math.roundToLong

/** `formatPrice`: `1.7199 -> "1,72€"` — two decimals, comma, no space. */
fun formatPrice(price: Double): String = twoDecimals(price) + "€"

/** Two-decimal comma formatting without the euro sign (chart axis labels etc.). */
fun twoDecimals(value: Double): String {
    val cents = (value * 100).roundToLong()
    val whole = cents / 100
    val frac = abs(cents % 100)
    return "$whole,${frac.toString().padStart(2, '0')}"
}

/** `formatDelta`: signed price difference, `±0,00€` for ~zero, U+2212 for minus. */
fun formatDelta(n: Double?): String {
    if (n == null || !n.isFinite()) return "–"
    if (abs(n) < 0.005) return "±0,00€"
    return (if (n > 0) "+" else "−") + formatPrice(abs(n))
}

/** Distance like the station list: one decimal km, `~` prefix when approximate. */
fun formatKm(km: Double, approx: Boolean = false): String {
    val rounded = (km * 10).roundToLong() / 10.0
    val text = if (rounded == rounded.toLong().toDouble() && rounded >= 10) {
        "${rounded.toLong()}.0"
    } else {
        val whole = rounded.toLong()
        val frac = abs((rounded * 10).roundToLong() % 10)
        "$whole.$frac"
    }
    return (if (approx) "~" else "") + text + " km"
}
