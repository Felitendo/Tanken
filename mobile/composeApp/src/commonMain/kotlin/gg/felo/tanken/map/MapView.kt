package gg.felo.tanken.map

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.calculateCentroid
import androidx.compose.foundation.gestures.calculatePan
import androidx.compose.foundation.gestures.calculateZoom
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.isSpecified
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.positionChanged
import androidx.compose.ui.input.pointer.util.VelocityTracker
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.ParentDataModifier
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import gg.felo.tanken.platform.LatLng
import kotlin.math.ceil
import kotlin.math.floor
import kotlin.math.pow
import kotlin.math.roundToInt

/**
 * Pure-Compose slippy map: CARTO raster tiles + composable overlay children
 * positioned via [MapScope.mapAnchor]. Gestures: drag pan with fling, pinch
 * zoom anchored on the gesture centroid, double-tap zoom, scroll-wheel zoom
 * (desktop verification builds).
 */
interface MapScope {
    /** Anchors a child so ([ax],[ay]) of it sits on the given coordinate (0.5/1.0 = bottom-center). */
    fun Modifier.mapAnchor(lat: Double, lng: Double, ax: Float = 0.5f, ay: Float = 1.0f): Modifier
}

private data class AnchorData(val lat: Double, val lng: Double, val ax: Float, val ay: Float)

private class AnchorModifier(val data: AnchorData) : ParentDataModifier {
    override fun Density.modifyParentData(parentData: Any?): Any = data
}

private object MapScopeInstance : MapScope {
    override fun Modifier.mapAnchor(lat: Double, lng: Double, ax: Float, ay: Float): Modifier =
        this.then(AnchorModifier(AnchorData(lat, lng, ax, ay)))
}

@Composable
fun MapView(
    camera: MapCamera,
    tiles: TileProvider,
    style: TileStyle,
    modifier: Modifier = Modifier,
    background: Color = if (style == TileStyle.Dark) Color(0xFF0A0A0A) else Color(0xFFE8E6E1),
    onTap: ((LatLng) -> Unit)? = null,
    content: @Composable MapScope.() -> Unit = {},
) {
    val scope = rememberCoroutineScope()
    val density = LocalDensity.current.density
    val retina = density >= 1.5f
    val tileVersion by tiles.version.collectAsState()

    Layout(
        content = {
            Canvas(Modifier.fillMaxSize().background(background)) {
                @Suppress("UNUSED_EXPRESSION")
                tileVersion // read so new tiles trigger a redraw
                drawTiles(camera, tiles, style, retina, density)
            }
            MapScopeInstance.content()
        },
        modifier = modifier
            .pointerInput(camera) {
                awaitEachGesture {
                    awaitFirstDown(requireUnconsumed = false)
                    camera.cancelFling()
                    val velocity = VelocityTracker()
                    var lastCentroid: Offset? = null
                    while (true) {
                        val event = awaitPointerEvent()
                        val pressed = event.changes.filter { it.pressed }
                        if (pressed.isEmpty()) break
                        val zoomChange = event.calculateZoom()
                        val pan = event.calculatePan()
                        val centroid = event.calculateCentroid()
                        if (zoomChange != 1f && centroid.isSpecified) {
                            camera.zoomBy(zoomChange.toDouble(), centroid)
                        }
                        if (pan != Offset.Zero) {
                            camera.panBy(pan)
                        }
                        if (centroid.isSpecified) {
                            // Track the centroid for fling velocity across the gesture.
                            val previous = lastCentroid
                            if (previous != null || pan != Offset.Zero || zoomChange != 1f) {
                                velocity.addPosition(event.changes.first().uptimeMillis, centroid)
                            }
                            lastCentroid = centroid
                        }
                        event.changes.forEach { if (it.positionChanged()) it.consume() }
                    }
                    val v = velocity.calculateVelocity()
                    camera.fling(scope, Offset(v.x, v.y))
                }
            }
            .pointerInput(camera, onTap) {
                detectTapGestures(
                    onDoubleTap = { position ->
                        camera.cancelFling()
                        camera.zoomBy(2.0, position)
                        camera.notifyIdle()
                    },
                    onTap = { position -> onTap?.invoke(camera.latLngOf(position)) },
                )
            }
            .pointerInput(camera) {
                // Desktop scroll-wheel zoom; never fires on touch platforms.
                awaitPointerEventScope {
                    while (true) {
                        val event = awaitPointerEvent()
                        if (event.type == PointerEventType.Scroll) {
                            val delta = event.changes.firstOrNull()?.scrollDelta?.y ?: 0f
                            if (delta != 0f) {
                                val focus = event.changes.first().position
                                camera.zoomBy(2.0.pow(-delta * 0.4), focus)
                                camera.notifyIdle()
                                event.changes.forEach { it.consume() }
                            }
                        }
                    }
                }
            },
    ) { measurables, constraints ->
        val width = constraints.maxWidth
        val height = constraints.maxHeight
        camera.viewport = IntSize(width, height)

        val canvasPlaceable = measurables.first().measure(Constraints.fixed(width, height))
        val markers = measurables.drop(1).map { measurable ->
            val data = measurable.parentData as? AnchorData
            measurable.measure(Constraints()) to data
        }

        layout(width, height) {
            canvasPlaceable.place(0, 0)
            markers.forEach { (placeable, data) ->
                if (data == null) {
                    placeable.place(0, 0)
                } else {
                    val screen = camera.screenOf(LatLng(data.lat, data.lng))
                    val x = screen.x - placeable.width * data.ax
                    val y = screen.y - placeable.height * data.ay
                    placeable.place(x.roundToInt(), y.roundToInt())
                }
            }
        }
    }
}

/**
 * Draws the visible tile grid. Tiles render in *logical* pixel space scaled by
 * [density]; missing tiles fall back to a cropped, scaled-up ancestor (up to 3
 * levels) so panning never shows a blank checkerboard.
 */
private fun DrawScope.drawTiles(
    camera: MapCamera,
    tiles: TileProvider,
    style: TileStyle,
    retina: Boolean,
    density: Float,
) {
    val viewportW = camera.viewport.width
    val viewportH = camera.viewport.height
    if (viewportW == 0 || viewportH == 0) return

    val tz = camera.zoom.roundToInt().coerceIn(MapCamera.MIN_ZOOM.toInt(), 19)
    val tilesAcross = 1 shl tz
    val scale = 2.0.pow(camera.zoom - tz)
    val tileSizeLogical = Projection.TILE_SIZE * scale
    val worldSizeLogical = tileSizeLogical * tilesAcross

    // World origin (top-left of world) position on screen, in logical px.
    val originX = viewportW / 2.0 - camera.centerX * worldSizeLogical
    val originY = viewportH / 2.0 - camera.centerY * worldSizeLogical

    val firstX = floor((-originX) / tileSizeLogical).toInt()
    val lastX = ceil((viewportW - originX) / tileSizeLogical).toInt() - 1
    val firstY = floor((-originY) / tileSizeLogical).toInt().coerceAtLeast(0)
    val lastY = (ceil((viewportH - originY) / tileSizeLogical).toInt() - 1).coerceAtMost(tilesAcross - 1)

    val wanted = mutableListOf<TileKey>()

    for (ty in firstY..lastY) {
        for (txRaw in firstX..lastX) {
            val tx = ((txRaw % tilesAcross) + tilesAcross) % tilesAcross
            val key = TileKey(style, tz, tx, ty, retina)
            val dstX = (originX + txRaw * tileSizeLogical) * density
            val dstY = (originY + ty * tileSizeLogical) * density
            val dstSize = tileSizeLogical * density
            val bitmap = tiles.peek(key)
            if (bitmap != null) {
                drawImage(
                    image = bitmap,
                    srcOffset = IntOffset.Zero,
                    srcSize = IntSize(bitmap.width, bitmap.height),
                    dstOffset = IntOffset(dstX.roundToInt(), dstY.roundToInt()),
                    dstSize = IntSize(ceil(dstSize).toInt(), ceil(dstSize).toInt()),
                )
            } else {
                wanted += key
                drawAncestorFallback(tiles, style, retina, tz, tx, ty, dstX, dstY, dstSize)
            }
        }
    }

    if (wanted.isNotEmpty()) tiles.request(wanted)
}

private fun DrawScope.drawAncestorFallback(
    tiles: TileProvider,
    style: TileStyle,
    retina: Boolean,
    tz: Int,
    tx: Int,
    ty: Int,
    dstX: Double,
    dstY: Double,
    dstSize: Double,
) {
    for (level in 1..3) {
        val pz = tz - level
        if (pz < MapCamera.MIN_ZOOM.toInt()) return
        val px = tx shr level
        val py = ty shr level
        val parent = tiles.peek(TileKey(style, pz, px, py, retina)) ?: continue
        // Portion of the parent tile that covers this tile.
        val sub = 1 shl level
        val subX = tx - (px shl level)
        val subY = ty - (py shl level)
        val srcTile = parent.width / sub
        drawImage(
            image = parent,
            srcOffset = IntOffset(subX * srcTile, subY * srcTile),
            srcSize = IntSize(srcTile, srcTile),
            dstOffset = IntOffset(dstX.roundToInt(), dstY.roundToInt()),
            dstSize = IntSize(ceil(dstSize).toInt(), ceil(dstSize).toInt()),
        )
        return
    }
}
