package gg.felo.tanken.ui.theme

import androidx.compose.ui.graphics.Color
import gg.felo.tanken.model.PriceBand
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

/**
 * Direct port of the website's station colouring (public/app.js: priceColor3 / bandRatio).
 * A price is mapped to t∈[0,1] across the regional [P10, P90] band, then a straight-line RGB
 * interpolation from green (52,199,89 = #34c759) to red (255,59,48 = #ff3b30) is applied, so
 * the cheapest local station is green and the most expensive red. Without a band → neutral grey.
 */
object PriceColor {
    private const val MIN_BAND_SPREAD = 0.03
    val NEUTRAL = Color(0xFFB7B7B7) // hsl(0,0%,72%)

    /** priceColor3(t) from app.js. */
    fun ofRatio(t: Double): Color {
        val x = max(0.0, min(1.0, t))
        val r = (52 + x * 203).roundToInt()
        val g = (199 - x * 140).roundToInt()
        val b = (89 - x * 41).roundToInt()
        return Color(r, g, b)
    }

    /** bandRatio(price, band) from app.js. */
    fun bandRatio(price: Double, band: PriceBand): Double {
        if (!(band.p90 > band.p10)) return 0.0
        if (price <= band.p10) return 0.0
        val spread = max(band.p90 - band.p10, MIN_BAND_SPREAD)
        val r = (price - band.p10) / spread
        return if (r >= 1.0) 1.0 else r
    }

    /** Colour for a station price given the active regional band (null band → neutral). */
    fun forPrice(price: Double?, band: PriceBand?): Color {
        if (price == null || price <= 0.0 || band == null) return NEUTRAL
        return ofRatio(bandRatio(price, band))
    }
}
