package gg.felo.tanken.ui

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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.ui.components.AppCard
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.Chip
import gg.felo.tanken.ui.components.ChipRow
import gg.felo.tanken.ui.components.FlagAt
import gg.felo.tanken.ui.components.FlagDe
import gg.felo.tanken.ui.components.HeroCard
import gg.felo.tanken.ui.components.IosSwitch
import gg.felo.tanken.ui.components.PageHeader
import gg.felo.tanken.ui.components.SectionHeader
import gg.felo.tanken.ui.components.SectionHint
import gg.felo.tanken.ui.components.SegOption
import gg.felo.tanken.ui.components.SegmentedControl
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.util.formatDelta
import gg.felo.tanken.util.formatPrice

/** Hidden component showcase used by the Phase-1 screenshot gate. */
@Composable
fun GalleryScreen() {
    val c = Theme.colors
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        PageHeader("Galerie", "Alle Bausteine im Überblick.")

        Column(Modifier.padding(horizontal = Sp.s4)) {
            SectionHeader("Chips")
            var fuel by remember { mutableStateOf(0) }
            ChipRow {
                Chip("Diesel", fuel == 0, { fuel = 0 })
                Chip("Super E5", fuel == 1, { fuel = 1 })
                Chip("Super E10", fuel == 2, { fuel = 2 })
            }
            ChipRow(Modifier.padding(top = Sp.s2)) {
                Chip("Deutschland", true, {}, leading = { FlagDe() })
                Chip("Österreich", false, {}, leading = { FlagAt() })
            }

            SectionHeader("Hero")
            HeroCard {
                Text(
                    "AKTUELL Ø",
                    style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = c.hint, letterSpacing = 0.6.sp),
                )
                Text(
                    formatPrice(1.92),
                    style = TextStyle(fontSize = 44.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.5).sp),
                )
                Row(
                    Modifier.padding(top = Sp.s2),
                    horizontalArrangement = Arrangement.spacedBy(Sp.s2),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(
                        Modifier.clip(RoundedCornerShape(999.dp)).background(c.accent.copy(alpha = 0.15f))
                            .padding(horizontal = 10.dp, vertical = 5.dp),
                    ) {
                        Text("Letzte 31 Tage", style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = c.accent))
                    }
                    Box(
                        Modifier.clip(RoundedCornerShape(999.dp)).background(c.bad.copy(alpha = 0.15f))
                            .padding(horizontal = 10.dp, vertical = 5.dp),
                    ) {
                        Text("↑ ${formatDelta(0.09)} vs. letzte Woche", style = TextStyle(fontSize = 12.sp, color = c.bad))
                    }
                }
            }

            SectionHeader("Karte / Preise")
            AppCard {
                Row(horizontalArrangement = Arrangement.spacedBy(Sp.s3), verticalAlignment = Alignment.CenterVertically) {
                    listOf(1.66, 1.72, 1.79, 1.86, 1.94).forEach { p ->
                        Box(
                            Modifier
                                .clip(RoundedCornerShape(999.dp))
                                .background(PriceColor.forPrice(p, 1.66, 1.94))
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                        ) {
                            Text(
                                formatPrice(p),
                                style = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color.White),
                            )
                        }
                    }
                }
            }

            SectionHeader("Schalter & Segmente")
            AppCard {
                Row(
                    Modifier.fillMaxWidth().padding(vertical = Sp.s1),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(Sp.s3), verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            Modifier.size(32.dp).clip(RoundedCornerShape(9.dp)).background(c.accent.copy(alpha = 0.14f)),
                            contentAlignment = Alignment.Center,
                        ) {
                            AppIcon(AppIcons.Bell, tint = c.accent, size = 16.dp)
                        }
                        Text("Benachrichtigung", style = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.Medium))
                    }
                    var on by remember { mutableStateOf(true) }
                    IosSwitch(on, { on = it })
                }
            }
            var seg by remember { mutableStateOf(0) }
            SegmentedControl(
                options = listOf(
                    SegOption("Auto", AppIcons.ThemeAuto),
                    SegOption("Hell", AppIcons.Sun),
                    SegOption("Dunkel", AppIcons.Moon),
                ),
                selected = seg,
                onSelect = { seg = it },
                modifier = Modifier.padding(top = Sp.s2),
            )

            SectionHeader("Sektion")
            SectionHint("Für diese Standorte sammeln wir täglich Preise für Verlaufscharts.")
            AppCard {
                Row(
                    Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(Sp.s3), verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            Modifier.size(38.dp).clip(RoundedCornerShape(10.dp)).background(c.accent.copy(alpha = 0.14f)),
                            contentAlignment = Alignment.Center,
                        ) {
                            AppIcon(AppIcons.Pin, tint = c.accent, size = 18.dp)
                        }
                        Column {
                            Text("4", style = TextStyle(fontSize = 22.sp, fontWeight = FontWeight.Bold))
                            Text("STANDORTE", style = TextStyle(fontSize = 11.sp, color = c.hint, letterSpacing = 0.6.sp))
                        }
                    }
                    AppIcon(AppIcons.ChevronRight, tint = c.hint, size = 16.dp)
                }
            }
            Box(Modifier.size(Sp.s8))
        }
    }
}
