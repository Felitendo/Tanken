package gg.felo.tanken.util

import kotlin.math.roundToInt

/** German-style price formatting (e.g. 1.789 € → "1,789"). */
fun formatPrice3(price: Double?): String {
    if (price == null || price <= 0.0) return "—"
    val milli = (price * 1000).roundToInt()
    val euros = milli / 1000
    val frac = (milli % 1000).toString().padStart(3, '0')
    return "$euros,$frac"
}

/** Splits a price into the main part ("1,78") and the superscript last digit ("9"), like the website. */
fun priceMainAndSuper(price: Double?): Pair<String, String> {
    val full = formatPrice3(price)
    if (full == "—" || full.length < 2) return full to ""
    return full.dropLast(1) to full.takeLast(1)
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
