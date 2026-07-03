package gg.felo.tanken.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.i18n.Strings
import gg.felo.tanken.model.ScanLocation
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme

/**
 * `.location-picker` + `.location-auto-hint`: dropdown-style scan-location
 * picker with the "Automatisch · nächster Standort" hint. Selection is shared
 * between Verlauf and Stats like the PWA's synced pickers.
 */
@Composable
fun LocationPickerRow(
    locations: List<ScanLocation>,
    selected: ScanLocation?,
    autoPicked: Boolean,
    strings: Strings,
    onSelect: (ScanLocation?) -> Unit,
) {
    if (locations.isEmpty()) return
    val c = Theme.colors
    var open by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxWidth()) {
        Row(
            Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(10.dp))
                .background(c.bgSecondary)
                .border(1.dp, c.separator, RoundedCornerShape(10.dp))
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                ) { open = !open }
                .padding(horizontal = Sp.s3, vertical = 11.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                selected?.name ?: "Alle Standorte",
                modifier = Modifier.weight(1f),
                style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Medium),
                maxLines = 1,
            )
            Box(Modifier.rotate(90f)) {
                AppIcon(AppIcons.ChevronRight, tint = c.hint, size = 16.dp)
            }
        }
        if (open) {
            Column(
                Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(c.bgSecondary)
                    .border(1.dp, c.separator, RoundedCornerShape(10.dp)),
            ) {
                PickerOption("Alle Standorte", selected == null) {
                    open = false
                    onSelect(null)
                }
                locations.forEach { location ->
                    Box(Modifier.fillMaxWidth().height(0.5.dp).background(c.separator))
                    PickerOption(location.name, selected?.id == location.id) {
                        open = false
                        onSelect(location)
                    }
                }
            }
        }
        if (autoPicked && selected != null) {
            Row(
                Modifier.padding(start = Sp.s1, top = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                AppIcon(AppIcons.Pin, tint = c.hint, size = 11.dp)
                Text(strings.locationAutoPicked, style = TextStyle(fontSize = 11.sp, color = c.hint))
            }
        }
    }
}

@Composable
private fun PickerOption(label: String, active: Boolean, onTap: () -> Unit) {
    val c = Theme.colors
    Row(
        Modifier
            .fillMaxWidth()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onTap,
            )
            .padding(horizontal = Sp.s3, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            label,
            modifier = Modifier.weight(1f),
            style = TextStyle(
                fontSize = 14.sp,
                fontWeight = if (active) FontWeight.SemiBold else FontWeight.Normal,
                color = if (active) c.accent else c.text,
            ),
            maxLines = 1,
        )
        if (active) AppIcon(AppIcons.Check, tint = c.accent, size = 16.dp)
    }
}
