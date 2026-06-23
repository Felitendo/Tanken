package gg.felo.tanken.util

import kotlin.math.roundToInt

/** German-style price with 2 decimals (e.g. 1.789 € → "1,79"). */
fun formatPrice(price: Double?): String {
    if (price == null || price <= 0.0) return "—"
    val cents = (price * 100).roundToInt()
    val euros = cents / 100
    val frac = (cents % 100).toString().padStart(2, '0')
    return "$euros,$frac"
}

/** Distance like "2,4 km" / "850 m". */
fun formatDistance(km: Double, approx: Boolean): String {
    val prefix = if (approx) "~" else ""
    return if (km < 1.0) {
        "$prefix${(km * 1000).roundToInt()} m"
    } else {
        val rounded = (km * 10).roundToInt() / 10.0
        val euros = rounded.toInt()
        val frac = ((rounded - euros) * 10).roundToInt()
        "$prefix$euros,$frac km"
    }
}
