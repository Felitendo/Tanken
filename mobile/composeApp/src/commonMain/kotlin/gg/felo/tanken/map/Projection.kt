package gg.felo.tanken.map

import gg.felo.tanken.platform.LatLng
import kotlin.math.PI
import kotlin.math.atan
import kotlin.math.cos
import kotlin.math.ln
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sinh
import kotlin.math.sqrt
import kotlin.math.tan

/**
 * Web-Mercator math on normalized world coordinates: the whole world maps to
 * the unit square [0,1]x[0,1] (x east, y south). At zoom z the world is
 * `256 * 2^z` logical pixels wide — the same convention Leaflet/CARTO use.
 */
object Projection {

    const val TILE_SIZE = 256.0
    const val MAX_LATITUDE = 85.05112878

    fun worldX(lng: Double): Double = (lng + 180.0) / 360.0

    fun worldY(lat: Double): Double {
        val clamped = lat.coerceIn(-MAX_LATITUDE, MAX_LATITUDE)
        val rad = clamped * PI / 180.0
        return (1.0 - ln(tan(rad) + 1.0 / cos(rad)) / PI) / 2.0
    }

    fun lng(worldX: Double): Double = worldX * 360.0 - 180.0

    fun lat(worldY: Double): Double {
        val n = PI * (1.0 - 2.0 * worldY)
        return atan(sinh(n)) * 180.0 / PI
    }

    fun world(point: LatLng): Pair<Double, Double> = worldX(point.lng) to worldY(point.lat)

    /** World size in logical pixels at a (fractional) zoom. */
    fun worldSize(zoom: Double): Double = TILE_SIZE * 2.0.pow(zoom)

    /** Great-circle distance in km (haversine). */
    fun distanceKm(a: LatLng, b: LatLng): Double {
        val r = 6371.0088
        val dLat = (b.lat - a.lat) * PI / 180.0
        val dLng = (b.lng - a.lng) * PI / 180.0
        val h = sin(dLat / 2).pow(2) + cos(a.lat * PI / 180.0) * cos(b.lat * PI / 180.0) * sin(dLng / 2).pow(2)
        return 2 * r * kotlin.math.asin(sqrt(h))
    }
}

/** Geographic bounding box (south/west/north/east). */
data class GeoBounds(val south: Double, val west: Double, val north: Double, val east: Double) {
    fun contains(p: LatLng): Boolean =
        p.lat in south..north && p.lng in west..east
}
