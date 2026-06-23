package gg.felo.tanken.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Circle
import androidx.compose.material.icons.outlined.Directions
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.i18n.LocalStrings
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.platform.MapsLink
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Spacing
import gg.felo.tanken.ui.theme.TankenTheme
import gg.felo.tanken.util.formatDistance
import gg.felo.tanken.util.formatPrice

/**
 * Shared station detail, rendered inside the Android bottom sheet and the iOS `.sheet`. Shows the
 * price (coloured by the regional band), address, open/closed status, distance, and Apple/Google
 * Maps navigation buttons.
 */
@Composable
fun StationDetailContent(
    station: Station,
    band: PriceBand?,
    mapsLink: MapsLink,
    haptics: Haptics,
    modifier: Modifier = Modifier,
) {
    val colors = TankenTheme.colors
    val s = LocalStrings.current
    val priceColor = PriceColor.forPrice(station.price, band)

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = Spacing.xl, vertical = Spacing.l),
        verticalArrangement = Arrangement.spacedBy(Spacing.l),
    ) {
        // Header: name + brand
        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text(
                station.name.ifBlank { station.displayBrand },
                color = colors.textPrimary,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
            )
            if (station.displayBrand.isNotBlank() && station.displayBrand != station.name) {
                Text(station.displayBrand, color = colors.textHint, fontSize = 14.sp)
            }
        }

        // Price (big, coloured)
        Row(verticalAlignment = Alignment.Bottom) {
            Text(formatPrice(station.price), color = priceColor, fontSize = 40.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.width(6.dp))
            Text("€/L", color = colors.textHint, fontSize = 14.sp, modifier = Modifier.padding(bottom = 6.dp))
        }

        // Address
        if (station.addressLine.isNotBlank() || station.cityLine.isNotBlank()) {
            InfoRow(icon = { Icon(Icons.Outlined.LocationOn, null, tint = colors.textHint, modifier = Modifier.size(18.dp)) }) {
                Column {
                    if (station.addressLine.isNotBlank()) Text(station.addressLine, color = colors.textPrimary, fontSize = 15.sp)
                    if (station.cityLine.isNotBlank()) Text(station.cityLine, color = colors.textHint, fontSize = 13.sp)
                }
            }
        }

        // Status + distance
        InfoRow(icon = {
            Icon(
                Icons.Filled.Circle,
                null,
                tint = if (station.isOpen) colors.good else colors.bad,
                modifier = Modifier.size(12.dp),
            )
        }) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(if (station.isOpen) s.open else s.closed, color = colors.textPrimary, fontSize = 15.sp)
                if (station.dist > 0) {
                    Text(formatDistance(station.dist, station.distApprox), color = colors.textHint, fontSize = 14.sp)
                }
            }
        }

        // Navigation buttons
        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.s), modifier = Modifier.fillMaxWidth()) {
            if (mapsLink.showAppleMaps) {
                Button(
                    onClick = { haptics.light(); mapsLink.openAppleMaps(station.lat, station.lng, station.name) },
                    colors = ButtonDefaults.buttonColors(containerColor = colors.accent),
                    modifier = Modifier.weight(1f),
                ) {
                    Icon(Icons.Outlined.Directions, null, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(6.dp))
                    Text(s.appleMaps)
                }
            }
            if (mapsLink.hasGoogleMaps) {
                val primary = !mapsLink.showAppleMaps
                if (primary) {
                    Button(
                        onClick = { haptics.light(); mapsLink.openGoogleMaps(station.lat, station.lng, station.name) },
                        colors = ButtonDefaults.buttonColors(containerColor = colors.accent),
                        modifier = Modifier.weight(1f),
                    ) {
                        Icon(Icons.Outlined.Directions, null, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(6.dp))
                        Text(s.googleMaps)
                    }
                } else {
                    OutlinedButton(
                        onClick = { haptics.light(); mapsLink.openGoogleMaps(station.lat, station.lng, station.name) },
                        modifier = Modifier.weight(1f),
                    ) { Text("Google Maps") }
                }
            }
        }
    }
}

@Composable
private fun InfoRow(icon: @Composable () -> Unit, content: @Composable () -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Spacing.m)) {
        Box(
            modifier = Modifier.size(28.dp).clip(CircleShape).background(TankenTheme.colors.bgSecondary),
            contentAlignment = Alignment.Center,
        ) { icon() }
        Box(Modifier.weight(1f)) { content() }
    }
}
