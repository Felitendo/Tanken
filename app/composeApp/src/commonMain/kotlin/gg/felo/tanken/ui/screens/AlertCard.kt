package gg.felo.tanken.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.Remove
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.i18n.LocalStrings
import gg.felo.tanken.model.FuelType
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.state.AlertViewModel
import gg.felo.tanken.ui.components.SegmentedControl
import gg.felo.tanken.ui.theme.Spacing
import gg.felo.tanken.ui.theme.TankenTheme
import gg.felo.tanken.util.formatPrice

/** Price-alert editor: enable toggle, threshold slider/stepper, fuel + channel pickers, save/delete. */
@Composable
fun AlertCard(vm: AlertViewModel, haptics: Haptics) {
    val colors = TankenTheme.colors
    val t = LocalStrings.current
    val s by vm.state.collectAsState()

    Column(verticalArrangement = Arrangement.spacedBy(Spacing.m)) {
        // Enable toggle
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(t.notification, color = colors.textPrimary, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                Text(t.notificationHint, color = colors.textHint, fontSize = 12.sp)
            }
            Switch(
                checked = s.enabled,
                onCheckedChange = { haptics.selection(); vm.setEnabled(it) },
                colors = SwitchDefaults.colors(checkedTrackColor = colors.good),
            )
        }

        // Threshold stepper + slider
        Text(t.thresholdUpper, color = colors.textHint, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Spacing.s)) {
            IconButton(onClick = { haptics.selection(); vm.setThreshold(s.threshold - 0.01) }) {
                Icon(Icons.Outlined.Remove, t.decrease, tint = colors.accent)
            }
            Text(
                "${formatPrice(s.threshold)} €",
                color = colors.textPrimary,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.weight(1f),
            )
            IconButton(onClick = { haptics.selection(); vm.setThreshold(s.threshold + 0.01) }) {
                Icon(Icons.Outlined.Add, t.increase, tint = colors.accent)
            }
        }
        Slider(
            value = s.threshold.toFloat().coerceIn(1.0f, 2.5f),
            onValueChange = { vm.setThreshold(it.toDouble()) },
            onValueChangeFinished = { haptics.selection() },
            valueRange = 1.0f..2.5f,
        )

        // Fuel
        Text(t.fuelUpper, color = colors.textHint, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
        SegmentedControl(
            options = FuelType.entries.map { it.label },
            selectedIndex = FuelType.entries.indexOf(s.fuel),
            onSelect = { haptics.selection(); vm.setFuel(FuelType.entries[it]) },
        )

        // Channel
        Text(t.channelUpper, color = colors.textHint, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
        SegmentedControl(
            options = listOf("ntfy.sh", t.channelEmail),
            selectedIndex = if (s.channel == "email") 1 else 0,
            onSelect = { haptics.selection(); vm.setChannel(if (it == 1) "email" else "ntfy") },
        )
        if (s.channel == "email") {
            OutlinedTextField(
                value = s.email,
                onValueChange = vm::setEmail,
                placeholder = { Text(t.emailPlaceholder) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
        } else {
            OutlinedTextField(
                value = s.ntfyTopic,
                onValueChange = vm::setNtfyTopic,
                placeholder = { Text(t.ntfyPlaceholder) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
        }

        // Actions
        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.s), verticalAlignment = Alignment.CenterVertically) {
            Button(
                onClick = {
                    vm.save { ok -> if (ok) haptics.success() else haptics.error() }
                },
                enabled = !s.saving,
            ) {
                if (s.saving) {
                    CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp, color = colors.bgElevated)
                } else {
                    Text(t.saveAlert)
                }
            }
            if (s.exists) {
                OutlinedButton(onClick = { vm.delete { ok -> if (ok) haptics.warning() } }) {
                    Text(t.delete)
                }
            }
        }
        s.message?.let { Box { Text(it, color = colors.textHint, fontSize = 12.sp, modifier = Modifier.padding(top = Spacing.xs)) } }
    }
}
