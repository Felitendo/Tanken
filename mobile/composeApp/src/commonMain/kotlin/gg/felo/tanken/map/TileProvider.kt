package gg.felo.tanken.map

import androidx.compose.ui.graphics.ImageBitmap
import io.ktor.client.HttpClient
import io.ktor.client.engine.HttpClientEngineFactory
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.statement.bodyAsBytes
import io.ktor.http.isSuccess
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class TileKey(val style: TileStyle, val z: Int, val x: Int, val y: Int, val retina: Boolean)

enum class TileStyle(val path: String) {
    /** PWA dark theme: CARTO dark_all. */
    Dark("dark_all"),

    /** PWA light theme: CARTO voyager. */
    Light("rastertiles/voyager"),
}

/**
 * Fetches and caches CARTO raster tiles — the exact tiles the PWA's Leaflet
 * map uses, so the map is pixel-identical to the website.
 *
 * Threading: every map/cache mutation happens on the caller's (main) thread;
 * only the network fetch + decode run on Dispatchers.Default. [peek] and
 * [request] must be called from the UI thread (draw pass / effects).
 */
class TileProvider(
    engine: HttpClientEngineFactory<*>,
    private val scope: CoroutineScope,
    private val maxBytes: Long = 48L * 1024 * 1024,
) {
    private val client = HttpClient(engine) {
        expectSuccess = false
        install(HttpTimeout) {
            requestTimeoutMillis = 15_000
            connectTimeoutMillis = 10_000
        }
    }

    private val cache = LinkedHashMap<TileKey, ImageBitmap>(64, 0.75f)
    private var cacheBytes = 0L
    private val pending = mutableSetOf<TileKey>()
    private val failed = mutableMapOf<TileKey, Long>() // key -> retry-not-before wave

    private val _inFlight = MutableStateFlow(0)
    val inFlight: StateFlow<Int> = _inFlight

    /** Bumped whenever a tile lands so the map canvas knows to redraw. */
    val version = MutableStateFlow(0L)

    private var requestWave = 0L

    /** Cache lookup for the draw pass; refreshes LRU recency. */
    fun peek(key: TileKey): ImageBitmap? {
        val hit = cache.remove(key) ?: return null
        cache[key] = hit
        return hit
    }

    /** Kicks off downloads for any of [keys] not yet cached or in flight. */
    fun request(keys: List<TileKey>) {
        requestWave += 1
        keys.forEach { key ->
            if (cache.containsKey(key) || key in pending) return@forEach
            val notBefore = failed[key]
            if (notBefore != null && requestWave < notBefore) return@forEach
            pending += key
            _inFlight.value += 1
            scope.launch {
                try {
                    val bitmap = withContext(Dispatchers.Default) { download(key) }
                    if (bitmap != null) {
                        insert(key, bitmap)
                        failed.remove(key)
                        version.value += 1
                    } else {
                        failed[key] = requestWave + 30
                    }
                } catch (t: Throwable) {
                    failed[key] = requestWave + 30
                } finally {
                    pending -= key
                    _inFlight.value -= 1
                }
            }
        }
    }

    private suspend fun download(key: TileKey): ImageBitmap? {
        val subdomain = "abcd"[((key.x + key.y) % 4 + 4) % 4]
        val retina = if (key.retina) "@2x" else ""
        val url = "https://$subdomain.basemaps.cartocdn.com/${key.style.path}/${key.z}/${key.x}/${key.y}$retina.png"
        val response = client.get(url) {
            header("User-Agent", "TankenApp/1.0 (+https://tanken.felo.gg)")
        }
        if (!response.status.isSuccess()) return null
        return decodeImage(response.bodyAsBytes())
    }

    private fun insert(key: TileKey, bitmap: ImageBitmap) {
        cache[key] = bitmap
        cacheBytes += bitmap.byteSize()
        while (cacheBytes > maxBytes && cache.size > 1) {
            val eldest = cache.entries.first()
            cache.remove(eldest.key)
            cacheBytes -= eldest.value.byteSize()
        }
    }

    private fun ImageBitmap.byteSize(): Long = width.toLong() * height * 4
}

/** Decodes an encoded PNG/JPEG into an ImageBitmap (Skia on both targets). */
expect fun decodeImage(bytes: ByteArray): ImageBitmap
