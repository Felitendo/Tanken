package gg.felo.tanken.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.LocalAppGraph
import gg.felo.tanken.i18n.Strings
import gg.felo.tanken.model.PriceAlert
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.platform.LatLng
import gg.felo.tanken.ui.components.AppCard
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.IosSwitch
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.LocalAppFont
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.util.formatPrice
import gg.felo.tanken.util.twoDecimals
import kotlinx.coroutines.launch

/**
 * `.alert-card`: price alert with enable toggle, threshold stepper, a
 * threshold-vs-market-band bar, ntfy/email channel picker and status panel.
 * Server-side evaluation — the app only persists the configuration.
 */
@Composable
fun AlertCard(viewModel: SettingsViewModel, band: PriceBand?, strings: Strings, smtpConfigured: Boolean) {
    val graph = LocalAppGraph.current
    val scope = rememberCoroutineScope()
    val c = Theme.colors
    val saved by viewModel.alert.collectAsState()

    var enabled by remember { mutableStateOf(false) }
    var threshold by remember { mutableStateOf(1.70) }
    var channel by remember { mutableStateOf("ntfy") }
    var ntfyTopic by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var hydrated by remember { mutableStateOf(false) }

    LaunchedEffect(saved) {
        val alert = saved
        if (alert != null && !hydrated) {
            enabled = alert.enabled
            alert.threshold?.let { threshold = it }
            alert.channel?.let { channel = it }
            alert.ntfyTopic?.let { ntfyTopic = it }
            alert.email?.let { email = it }
            hydrated = true
        }
    }

    suspend fun persist(on: Boolean) {
        val user = graph.geolocation.current()
        viewModel.saveAlert(
            PriceAlert(
                threshold = (threshold * 100).toInt() / 100.0,
                fuel = graph.state.fuel.value.wire,
                enabled = on,
                channel = channel,
                ntfyTopic = ntfyTopic.trim().ifBlank { null },
                email = email.trim().ifBlank { null },
                lat = user?.lat,
                lng = user?.lng,
                radiusKm = 25.0,
            ),
        )
    }

    AppCard {
        // Toggle row
        Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                Modifier.size(32.dp).clip(RoundedCornerShape(9.dp)).background(c.accent.copy(alpha = 0.14f)),
                contentAlignment = Alignment.Center,
            ) {
                AppIcon(AppIcons.Bell, tint = c.accent, size = 16.dp)
            }
            Column(Modifier.weight(1f).padding(horizontal = Sp.s3)) {
                Text(strings.notification, style = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.SemiBold))
                Text(
                    strings.alertBackgroundHint,
                    style = TextStyle(fontSize = 12.sp, color = c.hint, lineHeight = 16.sp),
                    maxLines = 2,
                )
            }
            IosSwitch(enabled, { on ->
                enabled = on
                graph.haptics.tap()
                scope.launch { if (on) persist(true) else viewModel.deleteAlert() }
            })
        }

        if (enabled) {
            // Threshold stepper
            Text(
                strings.threshold,
                modifier = Modifier.padding(top = Sp.s3),
                style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = c.hint, letterSpacing = 0.5.sp),
            )
            Row(
                Modifier.fillMaxWidth().padding(vertical = Sp.s2),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(Sp.s3),
            ) {
                StepButton(AppIcons.Minus) {
                    threshold = (threshold - 0.01).coerceAtLeast(0.5)
                    graph.haptics.selection()
                }
                Text(
                    formatPrice(threshold),
                    modifier = Modifier.weight(1f),
                    style = TextStyle(fontSize = 34.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center),
                )
                StepButton(AppIcons.Plus) {
                    threshold = (threshold + 0.01).coerceAtMost(3.5)
                    graph.haptics.selection()
                }
            }

            // Threshold vs market band
            if (band != null && band.p90 > band.p10) {
                val lo = band.p10 - 0.05
                val hi = band.p90 + 0.05
                val fraction = ((threshold - lo) / (hi - lo)).coerceIn(0.0, 1.0)
                Box(Modifier.fillMaxWidth().height(22.dp)) {
                    Box(
                        Modifier
                            .align(Alignment.Center)
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(999.dp))
                            .background(
                                androidx.compose.ui.graphics.Brush.horizontalGradient(
                                    listOf(c.good, androidx.compose.ui.graphics.Color(0xFFB8B140), c.okay, c.bad),
                                ),
                            ),
                    )
                    androidx.compose.ui.layout.Layout(
                        content = {
                            Box(
                                Modifier.size(18.dp).background(androidx.compose.ui.graphics.Color.White, CircleShape),
                            )
                        },
                        modifier = Modifier.fillMaxWidth(),
                    ) { measurables, constraints ->
                        val placeable = measurables.first().measure(androidx.compose.ui.unit.Constraints())
                        layout(constraints.maxWidth, 22.dp.roundToPx()) {
                            val x = ((constraints.maxWidth - placeable.width) * fraction).toInt()
                            placeable.place(x, (22.dp.roundToPx() - placeable.height) / 2)
                        }
                    }
                }
                Row(Modifier.fillMaxWidth()) {
                    Text(formatPrice(band.p10), style = TextStyle(fontSize = 11.sp, color = c.good, fontWeight = FontWeight.SemiBold))
                    Box(Modifier.weight(1f))
                    Text(formatPrice(band.p90), style = TextStyle(fontSize = 11.sp, color = c.bad, fontWeight = FontWeight.SemiBold))
                }
            }

            // Channel picker
            Text(
                strings.notificationChannel,
                modifier = Modifier.padding(top = Sp.s3),
                style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = c.hint, letterSpacing = 0.5.sp),
            )
            Row(
                Modifier
                    .padding(top = 6.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(c.text.copy(alpha = 0.06f))
                    .padding(3.dp),
                horizontalArrangement = Arrangement.spacedBy(3.dp),
            ) {
                ChannelSegment("ntfy.sh", AppIcons.Ntfy, channel == "ntfy") { channel = "ntfy" }
                if (smtpConfigured) {
                    ChannelSegment("E-Mail", AppIcons.Email, channel == "email") { channel = "email" }
                }
            }

            // Channel input
            val placeholder = if (channel == "email") strings.emailPlaceholder else strings.ntfyTopicPlaceholder
            val value = if (channel == "email") email else ntfyTopic
            Box(
                Modifier
                    .padding(top = Sp.s2)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(c.bg)
                    .padding(horizontal = Sp.s3, vertical = 11.dp),
            ) {
                if (value.isEmpty()) {
                    Text(placeholder, style = TextStyle(fontSize = 14.sp, color = c.hint), maxLines = 1)
                }
                BasicTextField(
                    value = value,
                    onValueChange = { if (channel == "email") email = it else ntfyTopic = it },
                    singleLine = true,
                    textStyle = TextStyle(fontSize = 14.sp, color = c.text, fontFamily = LocalAppFont.current),
                    cursorBrush = SolidColor(c.accent),
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            Text(
                if (channel == "email") strings.emailHint else "Installiere die ntfy App und abonniere dein Topic.",
                modifier = Modifier.padding(top = 4.dp),
                style = TextStyle(fontSize = 11.sp, color = c.hint, lineHeight = 15.sp),
                maxLines = 2,
            )

            // Status panel
            val status = saved
            Row(
                Modifier
                    .padding(top = Sp.s3)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(c.bg.copy(alpha = 0.6f))
                    .padding(horizontal = Sp.s3, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Box(
                    Modifier.size(8.dp).clip(CircleShape)
                        .background(if (status?.enabled == true) c.good else c.hint),
                )
                Text(
                    if (status?.enabled == true) strings.alertStatusArmed else strings.alertStatusInactive,
                    style = TextStyle(fontSize = 12.sp, color = if (status?.enabled == true) c.good else c.hint),
                    maxLines = 1,
                )
            }

            // Actions
            Row(
                Modifier.fillMaxWidth().padding(top = Sp.s3),
                horizontalArrangement = Arrangement.spacedBy(Sp.s2),
            ) {
                Box(
                    Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(10.dp))
                        .background(c.accent)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                        ) { scope.launch { persist(true) } }
                        .padding(vertical = 11.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        strings.saveAlarm,
                        style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = c.accentText),
                    )
                }
                Box(
                    Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(10.dp))
                        .background(c.text.copy(alpha = 0.08f))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                        ) {
                            scope.launch {
                                val target = if (channel == "email") email.trim() else ntfyTopic.trim()
                                if (target.isNotBlank()) viewModel.sendTest(channel, target)
                            }
                        }
                        .padding(vertical = 11.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        strings.sendTestNotification,
                        style = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Medium),
                        maxLines = 1,
                    )
                }
            }
        }
    }
}

@Composable
private fun StepButton(icon: androidx.compose.ui.graphics.vector.ImageVector, onTap: () -> Unit) {
    val c = Theme.colors
    Box(
        Modifier
            .size(44.dp)
            .clip(CircleShape)
            .background(c.text.copy(alpha = 0.08f))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onTap,
            ),
        contentAlignment = Alignment.Center,
    ) {
        AppIcon(icon, tint = c.text, size = 20.dp)
    }
}

@Composable
private fun ChannelSegment(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector, active: Boolean, onTap: () -> Unit) {
    val c = Theme.colors
    Row(
        Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(if (active) c.bg else androidx.compose.ui.graphics.Color.Transparent)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onTap,
            )
            .padding(horizontal = 14.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        AppIcon(icon, tint = if (active) c.accent else c.hint, size = 15.dp)
        Text(
            label,
            style = TextStyle(
                fontSize = 13.sp,
                fontWeight = if (active) FontWeight.SemiBold else FontWeight.Medium,
                color = if (active) c.text else c.hint,
            ),
        )
    }
}
