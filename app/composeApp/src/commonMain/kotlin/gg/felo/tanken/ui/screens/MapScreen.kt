package gg.felo.tanken.ui.screens

import androidx.compose.runtime.Composable

/**
 * The Map tab. Android renders Google Maps (maps-compose) bound to the shared MapViewModel; on iOS
 * the map tab is a native SwiftUI MapKit view, so the iOS actual is only a fallback that is never
 * shown in the SwiftUI shell.
 */
@Composable
expect fun MapScreen()
