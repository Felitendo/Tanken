package gg.felo.tanken.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.LocalAppGraph
import gg.felo.tanken.model.FuelType
import gg.felo.tanken.state.AppLanguage
import gg.felo.tanken.ui.components.AppCard
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.Chip
import gg.felo.tanken.ui.components.ChipRow
import gg.felo.tanken.ui.components.FlagDe
import gg.felo.tanken.ui.components.HeroCard
import gg.felo.tanken.ui.components.PageHeader
import gg.felo.tanken.ui.components.SectionHeader
import gg.felo.tanken.ui.components.SectionHint
import gg.felo.tanken.ui.components.SegOption
import gg.felo.tanken.ui.components.SegmentedControl
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.ui.theme.ThemeMode
import kotlinx.coroutines.launch

/** Einstellungen tab: account hero, fuel, price alert, locations, appearance, language, about. */
@Composable
fun SettingsScreen(viewModel: SettingsViewModel) {
    val graph = LocalAppGraph.current
    val scope = rememberCoroutineScope()
    val c = Theme.colors
    val strings = graph.state.stringsFlow.collectAsState().value
    val user by graph.state.user.collectAsState()
    val config by graph.state.config.collectAsState()
    val fuel by graph.state.fuel.collectAsState()
    val themeMode by graph.state.themeMode.collectAsState()
    val language by graph.state.language.collectAsState()
    val historyDays by graph.state.historyDefaultDays.collectAsState()
    val band by viewModel.band.collectAsState()
    val scanLocations by viewModel.scanLocations.collectAsState()
    val myRequests by viewModel.myRequests.collectAsState()
    var showRequestSheet by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) { viewModel.start() }

    Box(Modifier.fillMaxSize()) {
        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
            PageHeader(strings.settingsTitle, strings.settingsDescription)

            Column(Modifier.padding(horizontal = Sp.s4)) {
                // FELO ID hero (`.account-hero`)
                HeroCard {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Sp.s4)) {
                        Box(
                            Modifier
                                .size(60.dp)
                                .clip(CircleShape)
                                .background(c.accent.copy(alpha = 0.18f)),
                            contentAlignment = Alignment.Center,
                        ) {
                            val initial = user?.displayName?.firstOrNull() ?: user?.username?.firstOrNull()
                            if (user != null && initial != null) {
                                Text(
                                    initial.uppercase(),
                                    style = TextStyle(fontSize = 24.sp, fontWeight = FontWeight.Bold, color = c.accent),
                                )
                            } else {
                                AppIcon(AppIcons.Person, tint = c.accent.copy(alpha = 0.8f), size = 32.dp)
                            }
                        }
                        Column(Modifier.weight(1f)) {
                            Text(
                                strings.feloId,
                                style = TextStyle(fontSize = 10.sp, fontWeight = FontWeight.Bold, color = c.hint, letterSpacing = 0.7.sp),
                            )
                            Text(
                                user?.displayName ?: user?.username ?: strings.notLoggedIn,
                                style = TextStyle(fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = (-0.4).sp),
                                maxLines = 1,
                            )
                            Text(
                                user?.email ?: strings.loginSubline,
                                style = TextStyle(fontSize = 13.sp, color = c.hint),
                                maxLines = 1,
                            )
                        }
                    }
                    Row(
                        Modifier.fillMaxWidth().padding(top = Sp.s4),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(Sp.s3),
                    ) {
                        Row(
                            Modifier.weight(1f),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                        ) {
                            AppIcon(AppIcons.Cloud, tint = c.accent.copy(alpha = 0.85f), size = 13.dp)
                            Text(
                                strings.cloudSyncHint,
                                style = TextStyle(fontSize = 11.sp, color = c.hint, lineHeight = 15.sp),
                                maxLines = 3,
                            )
                        }
                        Box(
                            Modifier
                                .clip(RoundedCornerShape(999.dp))
                                .background(if (user == null) c.accent else c.text.copy(alpha = 0.08f))
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null,
                                ) {
                                    scope.launch {
                                        if (user == null) viewModel.login() else viewModel.logout()
                                    }
                                }
                                .padding(horizontal = 18.dp, vertical = 9.dp),
                        ) {
                            Text(
                                if (user == null) "${strings.loginWith} ${config?.auth?.oidcName ?: "Felo ID"}" else "Logout",
                                style = TextStyle(
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = if (user == null) c.accentText else c.text,
                                ),
                                maxLines = 1,
                            )
                        }
                    }
                }

                // KRAFTSTOFF
                SectionHeader(strings.fuelType)
                ChipRow {
                    Chip("Diesel", fuel == FuelType.Diesel, { graph.state.setFuel(FuelType.Diesel); graph.haptics.selection() })
                    Chip("Super E5", fuel == FuelType.E5, { graph.state.setFuel(FuelType.E5); graph.haptics.selection() })
                    Chip("Super E10", fuel == FuelType.E10, { graph.state.setFuel(FuelType.E10); graph.haptics.selection() })
                }

                // PREISALARM
                SectionHeader(strings.priceAlert)
                AlertCard(viewModel, band, strings, smtpConfigured = config?.smtpConfigured == true)

                // STANDORTE MIT VERLAUFSDATEN
                SectionHeader(strings.historyLocations)
                SectionHint(strings.historyLocationsHint)
                var locationsOpen by remember { mutableStateOf(false) }
                AppCard {
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                            ) { locationsOpen = !locationsOpen },
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Box(
                            Modifier.size(38.dp).clip(RoundedCornerShape(10.dp)).background(c.accent.copy(alpha = 0.14f)),
                            contentAlignment = Alignment.Center,
                        ) {
                            AppIcon(AppIcons.Pin, tint = c.accent, size = 18.dp)
                        }
                        Row(
                            Modifier.weight(1f).padding(horizontal = Sp.s3),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(Sp.s2),
                        ) {
                            Text("${scanLocations.size}", style = TextStyle(fontSize = 22.sp, fontWeight = FontWeight.Bold))
                            Text(
                                strings.historyLocTotalLabel.uppercase(),
                                style = TextStyle(fontSize = 11.sp, color = c.hint, letterSpacing = 0.6.sp, fontWeight = FontWeight.SemiBold),
                            )
                        }
                        AppIcon(AppIcons.ChevronRight, tint = c.hint, size = 16.dp)
                    }
                    if (locationsOpen) {
                        scanLocations.forEach { location ->
                            Box(Modifier.fillMaxWidth().padding(vertical = 6.dp).height(0.5.dp).background(c.separator))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                FlagDe()
                                Text(
                                    location.name,
                                    modifier = Modifier.weight(1f).padding(horizontal = Sp.s3),
                                    style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Medium),
                                    maxLines = 1,
                                )
                                location.radiusKm?.let {
                                    Text("${it.toInt()} km", style = TextStyle(fontSize = 12.sp, color = c.hint))
                                }
                            }
                        }
                    }
                }

                // MEINE ANFRAGEN
                SectionHeader(strings.myRequests)
                AppCard {
                    myRequests.forEach { request ->
                        Row(
                            Modifier.fillMaxWidth().padding(vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text(request.name, style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Medium), maxLines = 1)
                                request.note?.takeIf { it.isNotBlank() }?.let {
                                    Text(it, style = TextStyle(fontSize = 12.sp, color = c.hint), maxLines = 1)
                                }
                            }
                            val (label, color) = when (request.status) {
                                "approved" -> strings.requestApproved to c.good
                                "denied" -> strings.requestDenied to c.bad
                                else -> strings.requestPending to c.okay
                            }
                            Box(
                                Modifier.clip(RoundedCornerShape(999.dp)).background(color.copy(alpha = 0.15f))
                                    .padding(horizontal = 10.dp, vertical = 4.dp),
                            ) {
                                Text(label, style = TextStyle(fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = color))
                            }
                        }
                        Box(Modifier.fillMaxWidth().height(0.5.dp).background(c.separator))
                    }
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                            ) {
                                if (user != null) showRequestSheet = true else viewModel.showToast(strings.requestsLoginHint)
                            }
                            .padding(vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(Sp.s2),
                    ) {
                        AppIcon(AppIcons.Plus, tint = c.accent, size = 18.dp)
                        Text(
                            strings.requestLocation,
                            style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = c.accent),
                        )
                    }
                }
                if (user == null) {
                    Row(
                        Modifier.padding(top = Sp.s2, start = Sp.s1),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        AppIcon(AppIcons.Info, tint = c.hint, size = 14.dp)
                        Text(strings.requestsLoginHint, style = TextStyle(fontSize = 11.sp, color = c.hint), maxLines = 2)
                    }
                }

                // DARSTELLUNG
                SectionHeader(strings.appearance)
                AppCard {
                    SettingsRowHeader(AppIcons.Contrast, strings.appearanceLabel)
                    SegmentedControl(
                        options = listOf(
                            SegOption("Auto", AppIcons.ThemeAuto),
                            SegOption(strings.themeLight, AppIcons.Sun),
                            SegOption(strings.themeDark, AppIcons.Moon),
                        ),
                        selected = when (themeMode) {
                            ThemeMode.Auto -> 0
                            ThemeMode.Light -> 1
                            ThemeMode.Dark -> 2
                        },
                        onSelect = {
                            graph.haptics.selection()
                            graph.state.setThemeMode(
                                when (it) {
                                    1 -> ThemeMode.Light
                                    2 -> ThemeMode.Dark
                                    else -> ThemeMode.Auto
                                },
                            )
                        },
                        modifier = Modifier.padding(top = Sp.s2),
                    )
                }

                // PREISVERLAUF default range
                SectionHeader(strings.historyDefault)
                AppCard {
                    SettingsRowHeader(AppIcons.ListRows, strings.historyDefaultLabel)
                    SegmentedControl(
                        options = listOf(
                            SegOption(strings.historyDefault24h, AppIcons.Clock),
                            SegOption(strings.historyDefault7d, AppIcons.Calendar),
                        ),
                        selected = if (historyDays == 1) 0 else 1,
                        onSelect = {
                            graph.haptics.selection()
                            graph.state.setHistoryDefaultDays(if (it == 0) 1 else 7)
                        },
                        modifier = Modifier.padding(top = Sp.s2),
                    )
                }

                // SPRACHE
                SectionHeader(strings.language)
                AppCard {
                    SettingsRowHeader(AppIcons.Language, strings.languageLabel)
                    SegmentedControl(
                        options = listOf(SegOption("Deutsch"), SegOption("English")),
                        selected = if (language == AppLanguage.De) 0 else 1,
                        onSelect = {
                            graph.haptics.selection()
                            graph.state.setLanguage(if (it == 0) AppLanguage.De else AppLanguage.En)
                        },
                        modifier = Modifier.padding(top = Sp.s2),
                    )
                }

                // ÜBER
                SectionHeader(strings.about)
                AppCard {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Sp.s4)) {
                        Box(
                            Modifier.size(56.dp).clip(RoundedCornerShape(13.dp)).background(c.accent.copy(alpha = 0.16f)),
                            contentAlignment = Alignment.Center,
                        ) {
                            AppIcon(AppIcons.TabMap, tint = c.accent, size = 30.dp)
                        }
                        Column {
                            Text("Tanken", style = TextStyle(fontSize = 17.sp, fontWeight = FontWeight.SemiBold))
                            Text("iOS · 1.0.0", style = TextStyle(fontSize = 13.sp, color = c.hint))
                            Text(strings.aboutTagline, style = TextStyle(fontSize = 13.sp, color = c.hint))
                        }
                    }
                }
                var contributorsOpen by remember { mutableStateOf(false) }
                AppCard(Modifier.padding(top = Sp.s2)) {
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                            ) { contributorsOpen = !contributorsOpen }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(Sp.s3),
                    ) {
                        AppIcon(AppIcons.People, tint = c.hint, size = 20.dp)
                        Text(strings.contributors, modifier = Modifier.weight(1f), style = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.Medium))
                        AppIcon(AppIcons.ChevronRight, tint = c.hint, size = 16.dp)
                    }
                    if (contributorsOpen) {
                        Row(
                            Modifier.fillMaxWidth().padding(top = Sp.s2, start = Sp.s1),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(Sp.s3),
                        ) {
                            Box(
                                Modifier.size(36.dp).clip(CircleShape).background(c.accent.copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center,
                            ) {
                                Text("F", style = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.Bold, color = c.accent))
                            }
                            Column {
                                Text("Felitendo", style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.SemiBold))
                                Text(strings.ownerRole, style = TextStyle(fontSize = 12.sp, color = c.hint))
                            }
                        }
                    }
                    Box(Modifier.fillMaxWidth().padding(vertical = Sp.s2).height(0.5.dp).background(c.separator))
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                            ) { gg.felo.tanken.platform.openUrl("https://github.com/Felitendo/Tanken") }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(Sp.s3),
                    ) {
                        AppIcon(AppIcons.Github, tint = c.hint, size = 20.dp)
                        Text(strings.viewOnGithub, modifier = Modifier.weight(1f), style = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.Medium))
                        AppIcon(AppIcons.ChevronRight, tint = c.hint, size = 16.dp)
                    }
                }

                Text(
                    "${strings.madeWith} ❤️ ${strings.madeIn}",
                    modifier = Modifier.fillMaxWidth().padding(vertical = Sp.s6),
                    style = TextStyle(fontSize = 12.sp, color = c.hint, textAlign = androidx.compose.ui.text.style.TextAlign.Center),
                )
            }
        }

        RequestLocationSheet(
            visible = showRequestSheet,
            viewModel = viewModel,
            strings = strings,
            onDismiss = { showRequestSheet = false },
        )

        // Toast
        val toastText by viewModel.toast.collectAsState()
        toastText?.let {
            Box(
                Modifier.align(Alignment.BottomCenter).padding(bottom = 24.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(androidx.compose.ui.graphics.Color(0xEB111111))
                    .padding(horizontal = 16.dp, vertical = 12.dp),
            ) {
                Text(it, style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = androidx.compose.ui.graphics.Color.White))
            }
        }
    }
}

@Composable
private fun SettingsRowHeader(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String) {
    val c = Theme.colors
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Sp.s3)) {
        Box(
            Modifier.size(32.dp).clip(RoundedCornerShape(9.dp)).background(c.accent.copy(alpha = 0.14f)),
            contentAlignment = Alignment.Center,
        ) {
            AppIcon(icon, tint = c.accent, size = 16.dp)
        }
        Text(label, style = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.Medium))
    }
}
