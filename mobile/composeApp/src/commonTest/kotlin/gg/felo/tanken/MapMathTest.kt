package gg.felo.tanken

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.unit.IntSize
import gg.felo.tanken.map.MapCamera
import gg.felo.tanken.map.Projection
import gg.felo.tanken.platform.LatLng
import kotlin.math.abs
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class MapMathTest {

    @Test
    fun worldRoundTrip() {
        val berlin = LatLng(52.52, 13.405)
        assertEquals(berlin.lng, Projection.lng(Projection.worldX(berlin.lng)), 1e-9)
        assertEquals(berlin.lat, Projection.lat(Projection.worldY(berlin.lat)), 1e-9)
    }

    @Test
    fun knownTileForBerlin() {
        // Slippy-map reference: Berlin at z=10 falls in tile x=550, y=335.
        val z = 10
        val n = 1 shl z
        val tx = (Projection.worldX(13.405) * n).toInt()
        val ty = (Projection.worldY(52.52) * n).toInt()
        assertEquals(550, tx)
        assertEquals(335, ty)
    }

    @Test
    fun equatorAndPoles() {
        assertEquals(0.5, Projection.worldY(0.0), 1e-9)
        assertEquals(0.5, Projection.worldX(0.0), 1e-9)
        assertTrue(Projection.worldY(Projection.MAX_LATITUDE) < 1e-9)
        assertTrue(abs(Projection.worldY(-Projection.MAX_LATITUDE) - 1.0) < 1e-9)
    }

    @Test
    fun cameraScreenRoundTrip() {
        val camera = MapCamera(LatLng(52.52, 13.405), 12.0)
        camera.viewport = IntSize(390, 844)
        val point = LatLng(52.53, 13.41)
        val screen = camera.screenOf(point)
        val back = camera.latLngOf(screen)
        assertEquals(point.lat, back.lat, 1e-6)
        assertEquals(point.lng, back.lng, 1e-6)
    }

    @Test
    fun zoomKeepsFocusFixed() {
        val camera = MapCamera(LatLng(52.52, 13.405), 11.0)
        camera.viewport = IntSize(390, 844)
        val focus = Offset(100f, 200f)
        val before = camera.latLngOf(focus)
        camera.zoomBy(2.0, focus)
        val after = camera.latLngOf(focus)
        assertEquals(before.lat, after.lat, 1e-6)
        assertEquals(before.lng, after.lng, 1e-6)
        assertEquals(12.0, camera.zoom, 1e-9)
    }

    @Test
    fun panMovesCenter() {
        val camera = MapCamera(LatLng(52.52, 13.405), 12.0)
        camera.viewport = IntSize(390, 844)
        val before = camera.center
        camera.panBy(Offset(100f, 0f)) // drag east -> map center moves west
        assertTrue(camera.center.lng < before.lng)
        assertTrue(camera.moved)
    }

    @Test
    fun boundsOrdering() {
        val camera = MapCamera(LatLng(52.52, 13.405), 12.0)
        camera.viewport = IntSize(390, 844)
        val bounds = camera.visibleBounds()
        assertTrue(bounds.north > bounds.south)
        assertTrue(bounds.east > bounds.west)
        assertTrue(bounds.contains(LatLng(52.52, 13.405)))
    }

    @Test
    fun distanceSanity() {
        // Berlin -> Potsdam is ~27 km
        val d = Projection.distanceKm(LatLng(52.52, 13.405), LatLng(52.39, 13.06))
        assertTrue(d in 25.0..30.0, "got $d")
    }
}
