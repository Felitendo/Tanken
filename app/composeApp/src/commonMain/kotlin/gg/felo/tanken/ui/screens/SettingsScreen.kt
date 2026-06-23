package gg.felo.tanken.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import gg.felo.tanken.model.FuelType
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.state.AppConfig
import gg.felo.tanken.state.ThemeMode
import gg.felo.tanken.ui.components.Card
import gg.felo.tanken.ui.components.SectionHeader
import gg.felo.tanken.ui.components.SegmentedControl
import gg.felo.tanken.ui.theme.Spacing
import gg.felo.tanken.ui.theme.TankenTheme
import org.koin.compose.koinInject

/**
 * Settings: API base-URL configuration (default https://tanken.felo.gg), fuel type and theme.
 * Account/login + price-alert sections are added in Phase 4.
 */
@Composable
fun SettingsScreen() {
    val config = koinInject<AppConfig>()
    val haptics = koinInject<Haptics>()

    val baseUrl by config.baseUrl.collectAsState()
    val fuel by config.fuelType.collectAsState()
    val themeName by config.themeMode.collectAsState()

    var urlField by remember(baseUrl) { mutableStateOf(baseUrl) }

    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(Spacing.l),
        verticalArrangement = Arrangement.spacedBy(Spacing.l),
    ) {
        Text(
            "Einstellungen",
            color = TankenTheme.colors.textPrimary,
            style = MaterialTheme.typography.headlineLarge,
        )

        // --- Server / API base URL ---
        Column {
            SectionHeader("Server")
            Card {
                Column(verticalArrangement = Arrangement.spacedBy(Spacing.m)) {
                    Text(
                        "API-Adresse",
                        color = TankenTheme.colors.textPrimary,
                    )
                    OutlinedTextField(
                        value = urlField,
                        onValueChange = { urlField = it },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri),
                    )
                    Text(
                        "Standard: ${AppConfig.DEFAULT_BASE_URL}",
                        color = TankenTheme.colors.textHint,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(Spacing.s)) {
                        Button(onClick = {
                            haptics.success()
                            config.setBaseUrl(urlField)
                        }) { Text("Speichern") }
                        OutlinedButton(onClick = {
                            haptics.selection()
                            config.resetBaseUrl()
                            urlField = AppConfig.DEFAULT_BASE_URL
                        }) { Text("Zurücksetzen") }
                    }
                }
            }
        }

        // --- Fuel type ---
        Column {
            SectionHeader("Kraftstoff")
            Card {
                SegmentedControl(
                    options = FuelType.entries.map { it.label },
                    selectedIndex = FuelType.entries.indexOf(fuel),
                    onSelect = { idx ->
                        haptics.selection()
                        config.setFuelType(FuelType.entries[idx])
                    },
                )
            }
        }

        // --- Appearance ---
        Column {
            SectionHeader("Darstellung")
            Card {
                val modes = ThemeMode.entries
                SegmentedControl(
                    options = modes.map { it.localized() },
                    selectedIndex = modes.indexOfFirst { it.name == themeName }.coerceAtLeast(0),
                    onSelect = { idx ->
                        haptics.selection()
                        config.setThemeMode(modes[idx])
                    },
                )
            }
        }

        Text(
            "Tanken Companion · v0.1.0",
            color = TankenTheme.colors.textHint,
            modifier = Modifier.padding(top = Spacing.s),
        )
    }
}

private fun ThemeMode.localized(): String = when (this) {
    ThemeMode.AUTO -> "Automatisch"
    ThemeMode.LIGHT -> "Hell"
    ThemeMode.DARK -> "Dunkel"
}
