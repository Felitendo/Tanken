package gg.felo.tanken.ui.theme

import androidx.compose.ui.graphics.Color
import kotlin.math.max
import kotlin.math.roundToInt

/**
 * Station price coloring, transcribed from the PWA (`public/app.js`,
 * `priceColor3` / `bandRatio` / `rankColor`). A price is mapped to t in [0,1]
 * across the regional [P10, P90] band and interpolated linearly in RGB from
 * green (52,199,89) to red (255,59,48). No band -> flat neutral grey so it
 * can't be mistaken for a heatmap signal.
 */
object PriceColor {

    /** `hsl(0, 0%, 72%)` — shown when no regional band is available. */
    val neutral = Color(0xFFB8B8B8)

    /** Floor on the band's P10->P90 span used by [bandRatio]. */
    const val MIN_BAND_SPREAD = 0.03

    /** Radius (km) used to anchor the regional band request. */
    const val BAND_RADIUS_KM = 100.0

    /** Snap step (deg) matching the server's cache cells. */
    const val BAND_SNAP_DEG = 0.5

    /** `priceColor3(t)`: two-stop linear RGB green -> red. */
    fun ofRatio(t: Double): Color {
        val x = t.coerceIn(0.0, 1.0)
        val r = (52 + x * 203).roundToInt()
        val g = (199 - x * 140).roundToInt()
        val b = (89 - x * 41).roundToInt()
        return Color(r, g, b)
    }

    /** `bandRatio(price, band)`: linear position of price within [p10, p90]. */
    fun bandRatio(price: Double, p10: Double, p90: Double): Double {
        if (!(p90 > p10)) return 0.0
        if (price <= p10) return 0.0
        val spread = max(p90 - p10, MIN_BAND_SPREAD)
        val r = (price - p10) / spread
        return if (r >= 1.0) 1.0 else r
    }

    /** Color for a station price given the active band; neutral without one. */
    fun forPrice(price: Double?, p10: Double?, p90: Double?): Color {
        if (price == null || price <= 0.0 || p10 == null || p90 == null) return neutral
        return ofRatio(bandRatio(price, p10, p90))
    }

    /** `rankColor(ratio)`: green -> orange -> red, used by stats rankings. */
    fun rank(ratio: Double): Color {
        return if (ratio <= 0.5) {
            val t = ratio * 2
            Color((52 + t * 203).roundToInt(), (199 - t * 50).roundToInt(), (89 - t * 89).roundToInt())
        } else {
            val t = (ratio - 0.5) * 2
            Color(255, (149 - t * 90).roundToInt(), (t * 48).roundToInt())
        }
    }
}
