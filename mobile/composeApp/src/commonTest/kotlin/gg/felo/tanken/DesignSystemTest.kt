package gg.felo.tanken

import androidx.compose.ui.graphics.Color
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.util.formatDelta
import gg.felo.tanken.util.formatKm
import gg.felo.tanken.util.formatPrice
import kotlin.test.Test
import kotlin.test.assertEquals

/** Exact-value parity tests against the PWA's app.js implementations. */
class DesignSystemTest {

    @Test
    fun priceColor3Endpoints() {
        // priceColor3(0) = rgb(52,199,89), priceColor3(1) = rgb(255,59,48)
        assertEquals(Color(52, 199, 89), PriceColor.ofRatio(0.0))
        assertEquals(Color(255, 59, 48), PriceColor.ofRatio(1.0))
        // midpoint passes through olive: rgb(52+0.5*203, 199-0.5*140, 89-0.5*41) = rgb(154,129,69) rounded
        assertEquals(Color(154, 129, 69), PriceColor.ofRatio(0.5))
        // clamped outside [0,1]
        assertEquals(PriceColor.ofRatio(0.0), PriceColor.ofRatio(-3.0))
        assertEquals(PriceColor.ofRatio(1.0), PriceColor.ofRatio(9.0))
    }

    @Test
    fun bandRatioMatchesJs() {
        // normal band
        assertEquals(0.0, PriceColor.bandRatio(1.60, 1.60, 1.90))
        assertEquals(1.0, PriceColor.bandRatio(1.90, 1.60, 1.90))
        assertEquals(0.5, PriceColor.bandRatio(1.75, 1.60, 1.90), 1e-9)
        // price below p10 clamps to 0, above p90 clamps to 1
        assertEquals(0.0, PriceColor.bandRatio(1.50, 1.60, 1.90))
        assertEquals(1.0, PriceColor.bandRatio(2.50, 1.60, 1.90))
        // degenerate band: spread floored at MIN_BAND_SPREAD = 0.03
        assertEquals((1.62 - 1.60) / 0.03, PriceColor.bandRatio(1.62, 1.60, 1.61), 1e-9)
        // inverted/flat band -> 0
        assertEquals(0.0, PriceColor.bandRatio(1.70, 1.80, 1.80))
    }

    @Test
    fun neutralWithoutBand() {
        assertEquals(PriceColor.neutral, PriceColor.forPrice(null, 1.6, 1.9))
        assertEquals(PriceColor.neutral, PriceColor.forPrice(1.7, null, 1.9))
        assertEquals(PriceColor.neutral, PriceColor.forPrice(0.0, 1.6, 1.9))
    }

    @Test
    fun rankColorMatchesJs() {
        assertEquals(Color(52, 199, 89), PriceColor.rank(0.0))
        assertEquals(Color(255, 149, 0), PriceColor.rank(0.5))
        assertEquals(Color(255, 59, 48), PriceColor.rank(1.0))
    }

    @Test
    fun priceFormatting() {
        assertEquals("1,72€", formatPrice(1.719))
        assertEquals("1,72€", formatPrice(1.72))
        assertEquals("1,90€", formatPrice(1.9))
        assertEquals("2,00€", formatPrice(1.999))
        assertEquals("0,89€", formatPrice(0.889))
    }

    @Test
    fun deltaFormatting() {
        assertEquals("±0,00€", formatDelta(0.004))
        assertEquals("+0,09€", formatDelta(0.09))
        assertEquals("−0,05€", formatDelta(-0.05))
        assertEquals("–", formatDelta(null))
        assertEquals("–", formatDelta(Double.NaN))
    }

    @Test
    fun kmFormatting() {
        assertEquals("6.9 km", formatKm(6.93))
        assertEquals("~1.2 km", formatKm(1.24, approx = true))
        assertEquals("15.2 km", formatKm(15.21))
    }
}
