package gg.felo.tanken.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.model.FuelType
import gg.felo.tanken.model.SanitizedUser
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.state.AlertViewModel
import gg.felo.tanken.state.AppConfig
import gg.felo.tanken.state.ThemeMode
import gg.felo.tanken.state.UserViewModel
import gg.felo.tanken.ui.components.Card
import gg.felo.tanken.ui.components.SectionHeader
import gg.felo.tanken.ui.components.SegmentedControl
import gg.felo.tanken.ui.theme.Spacing
import gg.felo.tanken.ui.theme.TankenTheme
import org.koin.compose.koinInject

/**
 * Settings: account/login (OIDC via Felo-ID), price alert, API base-URL (default
 * https://tanken.felo.gg), fuel type and appearance.
 */
@Composable
fun SettingsScreen() {
    val config = koinInject<AppConfig>()
    val haptics = koinInject<Haptics>()
    val userVm = koinInject<UserViewModel>()
    val alertVm = koinInject<AlertViewModel>()

    val baseUrl by config.baseUrl.collectAsState()
    val fuel by config.fuelType.collectAsState()
    val themeName by config.themeMode.collectAsState()
    val user by userVm.state.collectAsState()
    val colors = TankenTheme.colors

    var urlField by remember(baseUrl) { mutableStateOf(baseUrl) }

    LaunchedEffect(Unit) { userVm.start() }
    LaunchedEffect(user.loggedIn) { if (user.loggedIn) alertVm.load() }

    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(Spacing.l),
        verticalArrangement = Arrangement.spacedBy(Spacing.l),
    ) {
        Text("Einstellungen", color = colors.textPrimary, style = MaterialTheme.typography.headlineLarge)

        // --- Account ---
        Column {
            SectionHeader("Konto")
            Card {
                when {
                    user.loading -> Box(Modifier.fillMaxWidth().padding(Spacing.s), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = colors.accent, modifier = Modifier.size(24.dp))
                    }
                    user.loggedIn && user.user != null -> AccountRow(user.user!!) {
                        haptics.selection()
                        userVm.logout()
                    }
                    else -> Column(verticalArrangement = Arrangement.spacedBy(Spacing.s)) {
                        Text("Nicht angemeldet", color = colors.textPrimary, fontWeight = FontWeight.SemiBold)
                        Text(
                            "Melde dich mit deiner Felo-ID an, um Favoriten und Preisalarme zu synchronisieren.",
                            color = colors.textHint,
                            fontSize = 13.sp,
                        )
                        Button(onClick = { haptics.medium(); userVm.login() }) { Text("Mit Felo-ID anmelden") }
                    }
                }
            }
        }

        // --- Price alert ---
        Column {
            SectionHeader("Preisalarm")
            Card {
                if (user.loggedIn) {
                    AlertCard(alertVm, haptics)
                } else {
                    Text("Melde dich an, um Preisalarme einzurichten.", color = colors.textHint, fontSize = 13.sp)
                }
            }
        }

        // --- Server / API base URL ---
        Column {
            SectionHeader("Server")
            Card {
                Column(verticalArrangement = Arrangement.spacedBy(Spacing.m)) {
                    Text("API-Adresse", color = colors.textPrimary)
                    OutlinedTextField(
                        value = urlField,
                        onValueChange = { urlField = it },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri),
                    )
                    Text(
                        "Standard: ${AppConfig.DEFAULT_BASE_URL}",
                        color = colors.textHint,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(Spacing.s)) {
                        Button(onClick = { haptics.success(); config.setBaseUrl(urlField) }) { Text("Speichern") }
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
                    onSelect = { idx -> haptics.selection(); config.setFuelType(FuelType.entries[idx]) },
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
                    onSelect = { idx -> haptics.selection(); config.setThemeMode(modes[idx]) },
                )
            }
        }

        Text("Tanken Companion · v0.1.0", color = colors.textHint, modifier = Modifier.padding(top = Spacing.s))
    }
}

@Composable
private fun AccountRow(user: SanitizedUser, onLogout: () -> Unit) {
    val colors = TankenTheme.colors
    val name = user.displayName?.takeIf { it.isNotBlank() } ?: user.username.ifBlank { "Felo ID" }
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Spacing.m)) {
        Box(
            Modifier.size(44.dp).clip(CircleShape).background(colors.accent),
            contentAlignment = Alignment.Center,
        ) {
            Text(name.take(1).uppercase(), color = androidx.compose.ui.graphics.Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
        Column(Modifier.weight(1f)) {
            Text(name, color = colors.textPrimary, fontWeight = FontWeight.SemiBold, maxLines = 1)
            if (user.email.isNotBlank()) Text(user.email, color = colors.textHint, fontSize = 13.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
        OutlinedButton(onClick = onLogout) { Text("Abmelden") }
    }
}

private fun ThemeMode.localized(): String = when (this) {
    ThemeMode.AUTO -> "Automatisch"
    ThemeMode.LIGHT -> "Hell"
    ThemeMode.DARK -> "Dunkel"
}
