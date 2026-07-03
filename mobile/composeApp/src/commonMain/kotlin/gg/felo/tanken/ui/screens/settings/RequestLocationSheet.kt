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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.LocalAppGraph
import gg.felo.tanken.i18n.Strings
import gg.felo.tanken.map.MapCamera
import gg.felo.tanken.map.MapView
import gg.felo.tanken.map.TileStyle
import gg.felo.tanken.platform.LatLng
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.BottomSheet
import gg.felo.tanken.ui.components.Chip
import gg.felo.tanken.ui.components.ChipRow
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.LocalAppFont
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme
import kotlinx.coroutines.launch

/**
 * "Standort anfragen" sheet: name + note inputs, radius chips and a mini map —
 * the requested point is wherever the map's center pin sits (drag to choose).
 */
@Composable
fun RequestLocationSheet(
    visible: Boolean,
    viewModel: SettingsViewModel,
    strings: Strings,
    onDismiss: () -> Unit,
) {
    val graph = LocalAppGraph.current
    val scope = rememberCoroutineScope()
    val c = Theme.colors

    BottomSheet(visible = visible, onDismiss = onDismiss) {
        var name by remember { mutableStateOf("") }
        var note by remember { mutableStateOf("") }
        var radius by remember { mutableStateOf(10.0) }
        val camera = remember {
            MapCamera(
                viewModel.userLocation.value ?: LatLng(52.52, 13.405),
                11.0,
            )
        }

        Column(Modifier.fillMaxWidth().padding(horizontal = Sp.s5, vertical = Sp.s2)) {
            Text(strings.requestLocation, style = TextStyle(fontSize = 19.sp, fontWeight = FontWeight.Bold))

            // Mini map with a fixed center pin
            Box(
                Modifier
                    .padding(top = Sp.s3)
                    .fillMaxWidth()
                    .height(190.dp)
                    .clip(RoundedCornerShape(12.dp)),
            ) {
                MapView(
                    camera = camera,
                    tiles = graph.tiles,
                    style = if (c.isDark) TileStyle.Dark else TileStyle.Light,
                    modifier = Modifier.fillMaxWidth().height(190.dp),
                )
                AppIcon(
                    AppIcons.Pin,
                    tint = c.accent,
                    size = 34.dp,
                    modifier = Modifier.align(Alignment.Center).padding(bottom = 17.dp),
                )
            }

            // Name input
            SheetInput(
                value = name,
                onChange = { name = it },
                placeholder = strings.requestName,
            )
            // Note input
            SheetInput(
                value = note,
                onChange = { note = it },
                placeholder = "Notiz (optional)",
            )

            // Radius chips
            Text(
                "Radius",
                modifier = Modifier.padding(top = Sp.s3, bottom = 6.dp),
                style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = c.hint, letterSpacing = 0.5.sp),
            )
            ChipRow {
                listOf(5, 10, 15, 25).forEach { km ->
                    Chip("$km km", radius == km.toDouble(), {
                        radius = km.toDouble()
                        graph.haptics.selection()
                    })
                }
            }

            // Submit
            Box(
                Modifier
                    .fillMaxWidth()
                    .padding(top = Sp.s4, bottom = Sp.s5)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (name.isBlank()) c.hint.copy(alpha = 0.4f) else c.accent)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                    ) {
                        if (name.isBlank()) return@clickable
                        scope.launch {
                            val center = camera.center
                            if (viewModel.submitRequest(name.trim(), center.lat, center.lng, radius, note)) {
                                onDismiss()
                            }
                        }
                    }
                    .padding(vertical = 13.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    strings.requestSubmit,
                    style = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = c.accentText),
                )
            }
        }
    }
}

@Composable
private fun SheetInput(value: String, onChange: (String) -> Unit, placeholder: String) {
    val c = Theme.colors
    Box(
        Modifier
            .padding(top = Sp.s3)
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(c.bgSecondary)
            .padding(horizontal = Sp.s3, vertical = 12.dp),
    ) {
        if (value.isEmpty()) {
            Text(placeholder, style = TextStyle(fontSize = 14.sp, color = c.hint), maxLines = 1)
        }
        BasicTextField(
            value = value,
            onValueChange = onChange,
            singleLine = true,
            textStyle = TextStyle(fontSize = 14.sp, color = c.text, fontFamily = LocalAppFont.current),
            cursorBrush = SolidColor(c.accent),
            modifier = Modifier.fillMaxWidth(),
        )
    }
}
