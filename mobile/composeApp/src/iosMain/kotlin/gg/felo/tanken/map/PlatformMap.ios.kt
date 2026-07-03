package gg.felo.tanken.map

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.UIKitView
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.platform.LatLng
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.util.twoDecimals
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.ObjCSignatureOverride
import kotlinx.cinterop.useContents
import platform.CoreLocation.CLLocationCoordinate2D
import platform.CoreLocation.CLLocationCoordinate2DMake
import platform.Foundation.NSError
import platform.MapKit.MKAnnotationProtocol
import platform.MapKit.MKAnnotationView
import platform.MapKit.MKCoordinateRegionMake
import platform.MapKit.MKCoordinateSpanMake
import platform.MapKit.MKMapView
import platform.MapKit.MKMapViewDelegateProtocol
import platform.MapKit.MKUserLocation
import platform.UIKit.NSTextAlignmentCenter
import platform.UIKit.UIColor
import platform.UIKit.UIFont
import platform.UIKit.UILabel
import platform.UIKit.UIUserInterfaceStyle
import platform.UIKit.UIView
import platform.darwin.NSObject
import kotlin.math.ln
import kotlin.math.pow

/*
 * Native Apple Maps implementation. Annotations are pre-clustered by the
 * shared world-grid clustering, so MapKit only renders ready-made price
 * bubbles: rounded pills (brand + price) for single stations and circles
 * (count + ~avg) for clusters.
 */

private class PriceAnnotation(
    val cluster: MapCluster,
    val colorR: Double,
    val colorG: Double,
    val colorB: Double,
    val selected: Boolean,
    val favourite: Boolean,
) : NSObject(), MKAnnotationProtocol {
    @OptIn(ExperimentalForeignApi::class)
    override fun coordinate(): kotlinx.cinterop.CValue<CLLocationCoordinate2D> =
        CLLocationCoordinate2DMake(cluster.lat, cluster.lng)

    override fun title(): String? = cluster.single?.name ?: "${cluster.count}"
}

@OptIn(ExperimentalForeignApi::class)
private class MapDelegate(
    var onRegionChanged: (MKMapView) -> Unit = {},
    var onAnnotationTap: (PriceAnnotation) -> Unit = {},
) : NSObject(), MKMapViewDelegateProtocol {

    @ObjCSignatureOverride
    override fun mapView(mapView: MKMapView, regionDidChangeAnimated: Boolean) {
        onRegionChanged(mapView)
    }

    @ObjCSignatureOverride
    override fun mapView(mapView: MKMapView, viewForAnnotation: MKAnnotationProtocol): MKAnnotationView? {
        if (viewForAnnotation is MKUserLocation) return null
        val annotation = viewForAnnotation as? PriceAnnotation ?: return null
        val view = MKAnnotationView(annotation = annotation, reuseIdentifier = null)
        view.canShowCallout = false
        val content = buildBubbleView(annotation)
        view.addSubview(content)
        val size = content.frame.useContents { size.width to size.height }
        view.setFrame(platform.CoreGraphics.CGRectMake(0.0, 0.0, size.first, size.second))
        if (annotation.cluster.single != null) {
            // Pill anchors above the station point.
            view.centerOffset = platform.CoreGraphics.CGPointMake(0.0, -size.second / 2.0)
        }
        return view
    }

    @ObjCSignatureOverride
    override fun mapView(mapView: MKMapView, didSelectAnnotationView: MKAnnotationView) {
        val annotation = didSelectAnnotationView.annotation as? PriceAnnotation
        mapView.deselectAnnotation(didSelectAnnotationView.annotation, animated = false)
        if (annotation != null) onAnnotationTap(annotation)
    }
}

@OptIn(ExperimentalForeignApi::class)
private fun buildBubbleView(annotation: PriceAnnotation): UIView {
    val cluster = annotation.cluster
    val color = UIColor(
        red = annotation.colorR,
        green = annotation.colorG,
        blue = annotation.colorB,
        alpha = 1.0,
    )
    val single = cluster.single
    return if (single != null) {
        val brand = (single.brand?.takeIf { it.isNotBlank() } ?: single.name).take(14)
        val price = single.price?.let { twoDecimals(it) } ?: "–"
        val brandLabel = UILabel().apply {
            text = brand
            font = UIFont.systemFontOfSize(9.0, weight = 0.4)
            textColor = UIColor.colorWithWhite(1.0, alpha = 0.9)
            textAlignment = NSTextAlignmentCenter
            sizeToFit()
        }
        val priceLabel = UILabel().apply {
            text = price
            font = UIFont.boldSystemFontOfSize(14.0)
            textColor = UIColor.whiteColor
            textAlignment = NSTextAlignmentCenter
            sizeToFit()
        }
        val brandW = brandLabel.frame.useContents { size.width }
        val priceW = priceLabel.frame.useContents { size.width }
        val width = maxOf(brandW, priceW) + 16.0
        val height = 34.0
        val container = UIView(frame = platform.CoreGraphics.CGRectMake(0.0, 0.0, width, height))
        container.backgroundColor = color
        container.layer.cornerRadius = 9.0
        if (annotation.selected || annotation.favourite) {
            container.layer.borderWidth = 2.0
            container.layer.borderColor = (
                if (annotation.selected) UIColor.whiteColor else UIColor(red = 1.0, green = 0.72, blue = 0.0, alpha = 1.0)
                ).CGColor
        }
        brandLabel.setFrame(platform.CoreGraphics.CGRectMake(0.0, 4.0, width, 10.0))
        priceLabel.setFrame(platform.CoreGraphics.CGRectMake(0.0, 15.0, width, 16.0))
        container.addSubview(brandLabel)
        container.addSubview(priceLabel)
        container
    } else {
        val size = 50.0
        val container = UIView(frame = platform.CoreGraphics.CGRectMake(0.0, 0.0, size, size))
        container.backgroundColor = color
        container.layer.cornerRadius = size / 2.0
        container.layer.borderWidth = 2.0
        container.layer.borderColor = UIColor.colorWithWhite(1.0, alpha = 0.85).CGColor
        val countLabel = UILabel().apply {
            text = "${cluster.count}"
            font = UIFont.boldSystemFontOfSize(14.0)
            textColor = UIColor.whiteColor
            textAlignment = NSTextAlignmentCenter
        }
        val avgLabel = UILabel().apply {
            text = cluster.avgPrice?.let { "~${twoDecimals(it)}" } ?: ""
            font = UIFont.systemFontOfSize(9.0, weight = 0.4)
            textColor = UIColor.colorWithWhite(1.0, alpha = 0.92)
            textAlignment = NSTextAlignmentCenter
        }
        countLabel.setFrame(platform.CoreGraphics.CGRectMake(0.0, 9.0, size, 16.0))
        avgLabel.setFrame(platform.CoreGraphics.CGRectMake(0.0, 26.0, size, 12.0))
        container.addSubview(countLabel)
        container.addSubview(avgLabel)
        container
    }
}

@OptIn(ExperimentalForeignApi::class)
@Composable
actual fun PlatformMapView(
    controller: MapController,
    dark: Boolean,
    clusters: List<MapCluster>,
    band: PriceBand?,
    selectedId: String?,
    favourites: Set<String>,
    showUserLocation: Boolean,
    userLocation: LatLng?,
    onStationTap: (Station) -> Unit,
    onClusterTap: (MapCluster) -> Unit,
    modifier: Modifier,
) {
    val mapView = remember { MKMapView() }
    val delegate = remember { MapDelegate() }

    // Keep the callbacks fresh without recreating the delegate.
    delegate.onAnnotationTap = { annotation ->
        val single = annotation.cluster.single
        if (single != null) onStationTap(single) else onClusterTap(annotation.cluster)
    }
    delegate.onRegionChanged = { view ->
        val (centerLat, centerLng, latDelta, lngDelta) = view.region.useContents {
            listOf(center.latitude, center.longitude, span.latitudeDelta, span.longitudeDelta)
        }
        controller.center.value = LatLng(centerLat, centerLng)
        controller.bounds.value = GeoBounds(
            south = centerLat - latDelta / 2.0,
            west = centerLng - lngDelta / 2.0,
            north = centerLat + latDelta / 2.0,
            east = centerLng + lngDelta / 2.0,
        )
        // Approximate slippy zoom from the visible longitude span and view width.
        val widthPoints = view.bounds.useContents { size.width }
        if (lngDelta > 0 && widthPoints > 0) {
            val zoom = ln(360.0 * widthPoints / (256.0 * lngDelta)) / ln(2.0)
            controller.zoom.value = zoom.coerceIn(2.0, 20.0)
        }
        controller.moved.value = true
    }

    // Consume fly-to requests natively.
    val fly by controller.flyTo.collectAsState()
    LaunchedEffect(fly) {
        fly?.let { request ->
            val spanDegrees = 360.0 / 2.0.pow(request.zoom) * 1.4
            mapView.setRegion(
                MKCoordinateRegionMake(
                    CLLocationCoordinate2DMake(request.target.lat, request.target.lng),
                    MKCoordinateSpanMake(spanDegrees, spanDegrees),
                ),
                animated = true,
            )
            // A programmatic move must not surface the "Hier suchen" pill.
            controller.moved.value = false
        }
    }

    UIKitView(
        factory = {
            mapView.delegate = delegate
            mapView.showsUserLocation = showUserLocation
            // Include-nothing filter hides Apple's own POI pins (incl. their fuel prices).
            mapView.pointOfInterestFilter =
                platform.MapKit.MKPointOfInterestFilter(includingCategories = emptyList<Any?>())
            val start = controller.center.value
            val spanDegrees = 360.0 / 2.0.pow(controller.zoom.value) * 1.4
            mapView.setRegion(
                MKCoordinateRegionMake(
                    CLLocationCoordinate2DMake(start.lat, start.lng),
                    MKCoordinateSpanMake(spanDegrees, spanDegrees),
                ),
                animated = false,
            )
            mapView
        },
        modifier = modifier,
        update = { view ->
            view.overrideUserInterfaceStyle =
                if (dark) UIUserInterfaceStyle.UIUserInterfaceStyleDark else UIUserInterfaceStyle.UIUserInterfaceStyleLight
            view.showsUserLocation = showUserLocation
            // Replace price annotations with the current cluster set.
            val stale = view.annotations.filterIsInstance<PriceAnnotation>()
            view.removeAnnotations(stale)
            clusters.forEach { cluster ->
                val rgb = colorOf(cluster, band)
                view.addAnnotation(
                    PriceAnnotation(
                        cluster = cluster,
                        colorR = rgb.first,
                        colorG = rgb.second,
                        colorB = rgb.third,
                        selected = cluster.single?.id == selectedId,
                        favourite = cluster.single?.id?.let { it in favourites } == true,
                    ),
                )
            }
        },
    )
}

private fun colorOf(cluster: MapCluster, band: PriceBand?): Triple<Double, Double, Double> {
    val price = cluster.single?.price ?: cluster.avgPrice
    val color = PriceColor.forPrice(price, band?.p10, band?.p90)
    return Triple(color.red.toDouble(), color.green.toDouble(), color.blue.toDouble())
}
