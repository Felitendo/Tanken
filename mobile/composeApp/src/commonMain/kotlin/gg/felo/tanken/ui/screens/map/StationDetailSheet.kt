package gg.felo.tanken.ui.screens.map

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.i18n.Strings
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.model.Station
import gg.felo.tanken.model.StationDetail
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.util.formatKm
import gg.felo.tanken.util.twoDecimals
import tanken.composeapp.generated.resources.Res
import tanken.composeapp.generated.resources.apple_maps
import tanken.composeapp.generated.resources.apple_maps_dark
import tanken.composeapp.generated.resources.google_maps
import tanken.composeapp.generated.resources.google_maps_dark

/**
 * Station detail sheet content, mirroring the PWA's `loadStationSheet` markup:
 * name/brand + favourite star, big colored price, address, open state +
 * distance, opening hours, Google/Apple Maps buttons. The price-history chart
 * slot arrives with the chart phase.
 */
@Composable
fun StationDetailContent(
    station: Station,
    detail: StationDetail?,
    fuelPrice: Double?,
    band: PriceBand?,
    favourite: Boolean,
    loggedIn: Boolean,
    strings: Strings,
    onToggleFavourite: () -> Unit,
    onNavigate: (gg.felo.tanken.platform.MapsProvider) -> Unit,
    chart: (@Composable () -> Unit)? = null,
) {
    val c = Theme.colors
    val price = fuelPrice ?: station.price
    val color = PriceColor.forPrice(price, band?.p10, band?.p90)
    val isOpen = detail?.isOpen ?: station.isOpen

    Column(
        Modifier
            .fillMaxWidth()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = Sp.s5, vertical = Sp.s2),
    ) {
        // Header: name/brand + favourite star
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(
                    station.name.ifBlank { station.brand ?: "" },
                    style = TextStyle(fontSize = 19.sp, fontWeight = FontWeight.Bold),
                    maxLines = 2,
                )
                station.brand?.takeIf { it.isNotBlank() }?.let {
                    Text(it, style = TextStyle(fontSize = 13.sp, color = c.hint), maxLines = 1)
                }
            }
            if (loggedIn) {
                Box(
                    Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            onClick = onToggleFavourite,
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    AppIcon(AppIcons.Star, tint = if (favourite) c.favorite else c.hint.copy(alpha = 0.45f), size = 24.dp)
                }
            }
        }

        // Big price
        Row(
            Modifier.padding(top = Sp.s2, bottom = Sp.s2),
            verticalAlignment = Alignment.Bottom,
        ) {
            Text(
                price?.let { twoDecimals(it) } ?: "–",
                style = TextStyle(fontSize = 42.sp, fontWeight = FontWeight.Bold, color = color, letterSpacing = (-1).sp),
            )
            Text(
                " €/L",
                modifier = Modifier.padding(bottom = 6.dp),
                style = TextStyle(fontSize = 16.sp, color = c.hint),
            )
        }

        // Address
        if (station.address.isNotBlank()) {
            InfoRow(icon = AppIcons.Pin) {
                Text(station.address, style = TextStyle(fontSize = 14.sp), maxLines = 2)
            }
        }

        // Open state + distance
        Row(
            Modifier.fillMaxWidth().padding(vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(Modifier.padding(end = 10.dp).size(10.dp).clip(CircleShape).background(if (isOpen) c.good else c.bad))
            Text(
                if (isOpen) strings.open else strings.closed,
                style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Medium),
            )
            Box(Modifier.weight(1f))
            station.dist?.let {
                Text(
                    "${formatKm(it, station.distApprox).removeSuffix(" km")} ${strings.kmAway}",
                    style = TextStyle(fontSize = 13.sp, color = c.hint),
                )
            }
        }

        // Opening hours (collapsible)
        val hours = detail?.openingTimes.orEmpty()
        if (detail?.wholeDay == true) {
            InfoRow(icon = AppIcons.Clock) {
                Text(strings.open24h, style = TextStyle(fontSize = 14.sp))
            }
        } else if (hours.isNotEmpty()) {
            var expanded by remember { mutableStateOf(false) }
            Column(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(c.bgSecondary)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                    ) { expanded = !expanded }
                    .padding(horizontal = Sp.s3, vertical = Sp.s2),
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    AppIcon(AppIcons.Clock, tint = c.hint, size = 16.dp)
                    Text(
                        strings.openingHours,
                        modifier = Modifier.padding(start = 10.dp).weight(1f),
                        style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Medium),
                    )
                    AppIcon(AppIcons.ChevronRight, tint = c.hint, size = 16.dp)
                }
                if (expanded) {
                    hours.forEach { time ->
                        Row(Modifier.fillMaxWidth().padding(top = 6.dp)) {
                            Text(time.text, style = TextStyle(fontSize = 13.sp, color = c.hint), modifier = Modifier.weight(1f))
                            Text("${time.start}–${time.end}", style = TextStyle(fontSize = 13.sp))
                        }
                    }
                }
            }
        }

        // `.sheet-nav-buttons`: Google Maps + Apple Maps side by side with brand icons
        Row(
            Modifier.fillMaxWidth().padding(vertical = Sp.s3),
            horizontalArrangement = Arrangement.spacedBy(Sp.s2),
        ) {
            NavButton(
                label = "Google Maps",
                icon = if (c.isDark) Res.drawable.google_maps_dark else Res.drawable.google_maps,
                modifier = Modifier.weight(1f),
            ) { onNavigate(gg.felo.tanken.platform.MapsProvider.Google) }
            NavButton(
                label = "Apple Maps",
                icon = if (c.isDark) Res.drawable.apple_maps_dark else Res.drawable.apple_maps,
                modifier = Modifier.weight(1f),
            ) { onNavigate(gg.felo.tanken.platform.MapsProvider.Apple) }
        }

        chart?.invoke()
        Box(Modifier.size(Sp.s5))
    }
}

/** `.sheet-nav-btn`: secondary-surface button with the provider's brand icon. */
@Composable
private fun NavButton(
    label: String,
    icon: org.jetbrains.compose.resources.DrawableResource,
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
) {
    val c = Theme.colors
    Row(
        modifier
            .clip(RoundedCornerShape(12.dp))
            .background(c.bgSecondary)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick,
            )
            .padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        androidx.compose.foundation.Image(
            painter = org.jetbrains.compose.resources.painterResource(icon),
            contentDescription = null,
            modifier = Modifier.size(22.dp),
        )
        Text(
            label,
            modifier = Modifier.padding(start = 8.dp),
            style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.SemiBold),
            maxLines = 1,
        )
    }
}

@Composable
private fun InfoRow(icon: androidx.compose.ui.graphics.vector.ImageVector, content: @Composable () -> Unit) {
    Row(
        Modifier.fillMaxWidth().padding(vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        AppIcon(icon, tint = Theme.colors.hint, size = 18.dp)
        Box(Modifier.padding(start = 10.dp)) { content() }
    }
}
