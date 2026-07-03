package gg.felo.tanken.map

import androidx.compose.animation.core.AnimationState
import androidx.compose.animation.core.animateDecay
import androidx.compose.animation.core.animateTo
import androidx.compose.animation.core.exponentialDecay
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.unit.IntSize
import gg.felo.tanken.platform.LatLng
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch

/**
 * Camera state for [MapView]: center in normalized world coordinates plus a
 * continuous zoom. All screen math happens in *logical pixels* (dp x density
 * conversion is the renderer's business — gestures and layout both deliver
 * logical px on every platform).
 */
@Stable
class MapCamera(
    center: LatLng = LatLng(52.52, 13.405),
    zoom: Double = 11.0,
) {
    var centerX by mutableStateOf(Projection.worldX(center.lng))
        private set
    var centerY by mutableStateOf(Projection.worldY(center.lat))
        private set
    var zoom by mutableStateOf(zoom.coerceIn(MIN_ZOOM, MAX_ZOOM))
        private set

    /** Viewport size in physical px, set by MapView's layout pass. */
    var viewport by mutableStateOf(IntSize.Zero)

    /** Screen density; camera math runs in physical px = logical * density. */
    var density: Float = 1f

    /** Bumped after every gesture/animation ends — drives "camera idle" loads. */
    var idleTick by mutableLongStateOf(0L)
        private set

    /** True once the user panned/zoomed (shows the "Hier suchen" pill). */
    var moved by mutableStateOf(false)

    val center: LatLng get() = LatLng(Projection.lat(centerY), Projection.lng(centerX))

    private var flingJob: Job? = null

    companion object {
        const val MIN_ZOOM = 3.0
        const val MAX_ZOOM = 19.0
    }

    /** World size in physical pixels at [z]. */
    fun worldSizePx(z: Double): Double = Projection.worldSize(z) * density

    fun panBy(delta: Offset) {
        val size = worldSizePx(zoom)
        centerX -= delta.x / size
        centerY = (centerY - delta.y / size).coerceIn(0.0, 1.0)
        moved = true
    }

    /** Zooms by [factor], keeping [focus] (logical px in the viewport) fixed. */
    fun zoomBy(factor: Double, focus: Offset) {
        if (factor == 1.0 || factor <= 0.0) return
        val newZoom = (zoom + kotlin.math.ln(factor) / kotlin.math.ln(2.0)).coerceIn(MIN_ZOOM, MAX_ZOOM)
        applyZoom(newZoom, focus)
        moved = true
    }

    private fun applyZoom(newZoom: Double, focus: Offset) {
        val sizeBefore = worldSizePx(zoom)
        val fx = centerX + (focus.x - viewport.width / 2.0) / sizeBefore
        val fy = centerY + (focus.y - viewport.height / 2.0) / sizeBefore
        val sizeAfter = worldSizePx(newZoom)
        zoom = newZoom
        centerX = fx - (focus.x - viewport.width / 2.0) / sizeAfter
        centerY = (fy - (focus.y - viewport.height / 2.0) / sizeAfter).coerceIn(0.0, 1.0)
    }

    fun screenOf(point: LatLng): Offset {
        val size = worldSizePx(zoom)
        val x = ((Projection.worldX(point.lng) - centerX) * size + viewport.width / 2.0).toFloat()
        val y = ((Projection.worldY(point.lat) - centerY) * size + viewport.height / 2.0).toFloat()
        return Offset(x, y)
    }

    fun latLngOf(screen: Offset): LatLng {
        val size = worldSizePx(zoom)
        val wx = centerX + (screen.x - viewport.width / 2.0) / size
        val wy = centerY + (screen.y - viewport.height / 2.0) / size
        return LatLng(Projection.lat(wy.coerceIn(0.0, 1.0)), Projection.lng(wx))
    }

    fun visibleBounds(): GeoBounds {
        val topLeft = latLngOf(Offset.Zero)
        val bottomRight = latLngOf(Offset(viewport.width.toFloat(), viewport.height.toFloat()))
        return GeoBounds(
            south = bottomRight.lat,
            west = topLeft.lng,
            north = topLeft.lat,
            east = bottomRight.lng,
        )
    }

    fun notifyIdle() {
        idleTick += 1
    }

    fun cancelFling() {
        flingJob?.cancel()
        flingJob = null
    }

    /** Decay-animated fling from a gesture-end velocity (logical px/s). */
    fun fling(scope: CoroutineScope, velocity: Offset) {
        cancelFling()
        if (velocity.getDistance() < 80f) {
            notifyIdle()
            return
        }
        flingJob = scope.launch {
            val decay = exponentialDecay<Float>(frictionMultiplier = 1.6f)
            var lastX = 0f
            var lastY = 0f
            val jobX = launch {
                AnimationState(0f, velocity.x).animateDecay(decay) {
                    panByRaw(value - lastX, 0f)
                    lastX = value
                }
            }
            val jobY = launch {
                AnimationState(0f, velocity.y).animateDecay(decay) {
                    panByRaw(0f, value - lastY)
                    lastY = value
                }
            }
            jobX.join()
            jobY.join()
            notifyIdle()
        }
    }

    private fun panByRaw(dx: Float, dy: Float) {
        val size = worldSizePx(zoom)
        centerX -= dx / size
        centerY = (centerY - dy / size).coerceIn(0.0, 1.0)
    }

    /** Animated recenter (GPS button, search result, "show on map"). */
    fun animateTo(scope: CoroutineScope, target: LatLng, targetZoom: Double = zoom, durationMs: Int = 450) {
        cancelFling()
        val startX = centerX
        val startY = centerY
        val startZ = zoom
        val endX = Projection.worldX(target.lng)
        val endY = Projection.worldY(target.lat)
        val endZ = targetZoom.coerceIn(MIN_ZOOM, MAX_ZOOM)
        flingJob = scope.launch {
            AnimationState(0f).animateTo(1f, tween(durationMs)) {
                val t = value.toDouble()
                val eased = t // tween already eases
                centerX = startX + (endX - startX) * eased
                centerY = startY + (endY - startY) * eased
                zoom = startZ + (endZ - startZ) * eased
            }
            notifyIdle()
        }
    }
}
