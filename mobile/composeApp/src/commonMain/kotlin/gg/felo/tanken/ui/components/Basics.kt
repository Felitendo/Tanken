package gg.felo.tanken.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.ui.theme.Rad
import gg.felo.tanken.ui.theme.Sp
import gg.felo.tanken.ui.theme.Theme

/** `.page-header`: big bold title + hint description, pushed below the status bar. */
@Composable
fun PageHeader(title: String, description: String? = null) {
    Column(
        Modifier
            .fillMaxWidth()
            .windowInsetsPadding(WindowInsets.statusBars)
            .padding(horizontal = Sp.s4, vertical = Sp.s3),
    ) {
        Text(
            title,
            style = TextStyle(fontSize = 28.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.56).sp),
        )
        if (description != null) {
            Text(
                description,
                modifier = Modifier.padding(top = Sp.s1),
                style = TextStyle(fontSize = 14.sp, color = Theme.colors.hint),
            )
        }
    }
}

/** `.section-header`: 13px semibold uppercase, letterspaced, hint-colored. */
@Composable
fun SectionHeader(text: String, modifier: Modifier = Modifier) {
    Text(
        text.uppercase(),
        modifier = modifier.padding(start = Sp.s1, end = Sp.s1, top = Sp.s5, bottom = Sp.s2),
        style = TextStyle(
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = Theme.colors.hint,
            letterSpacing = 0.6.sp,
        ),
    )
}

/** `.section-hint`: small hint paragraph under a section header. */
@Composable
fun SectionHint(text: String) {
    Text(
        text,
        modifier = Modifier.padding(start = Sp.s1, end = Sp.s1, bottom = Sp.s3),
        style = TextStyle(fontSize = 12.sp, color = Theme.colors.hint, lineHeight = 18.sp),
    )
}

/** `.card`: secondary surface, hairline border, 12dp radius. */
@Composable
fun AppCard(
    modifier: Modifier = Modifier,
    padding: androidx.compose.foundation.layout.PaddingValues =
        androidx.compose.foundation.layout.PaddingValues(horizontal = Sp.s4, vertical = Sp.s3),
    content: @Composable androidx.compose.foundation.layout.ColumnScope.() -> Unit,
) {
    Column(
        modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(Rad.md))
            .background(Theme.colors.bgSecondary)
            .border(1.dp, Theme.colors.separator, RoundedCornerShape(Rad.md))
            .padding(padding),
        content = { content() },
    )
}

/** `.account-hero` / stat hero: card with a subtle accent gradient + glow. */
@Composable
fun HeroCard(
    modifier: Modifier = Modifier,
    content: @Composable androidx.compose.foundation.layout.ColumnScope.() -> Unit,
) {
    val c = Theme.colors
    val mix = androidx.compose.ui.graphics.lerp(c.bgSecondary, c.accent, 0.08f)
    val glow = c.accent.copy(alpha = if (c.isDark) 0.20f else 0.10f)
    Column(
        modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(Rad.md))
            .background(Brush.linearGradient(listOf(c.bgSecondary, mix)))
            .background(
                Brush.radialGradient(
                    colors = listOf(glow, Color.Transparent),
                    center = androidx.compose.ui.geometry.Offset(Float.POSITIVE_INFINITY, 0f),
                    radius = 600f,
                ),
            )
            .border(1.dp, c.separator, RoundedCornerShape(Rad.md))
            .padding(Sp.s5),
        content = { content() },
    )
}

/** `.chip`: pill button; active = accent bg + white text. */
@Composable
fun Chip(
    label: String,
    active: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    leading: (@Composable () -> Unit)? = null,
) {
    val c = Theme.colors
    val bg by animateColorAsState(if (active) c.accent else c.bgSecondary, tween(150))
    val fg by animateColorAsState(if (active) c.accentText else c.text, tween(150))
    Row(
        modifier
            .clip(RoundedCornerShape(Rad.pill))
            .background(bg)
            .clickable(interactionSource = remember { MutableInteractionSource() }, indication = null, onClick = onClick)
            .padding(horizontal = Sp.s4, vertical = Sp.s2),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        leading?.invoke()
        Text(label, style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Medium, color = fg), maxLines = 1)
    }
}

/** `.chip-row`: horizontal chip group with 8dp gaps. */
@Composable
fun ChipRow(modifier: Modifier = Modifier, content: @Composable androidx.compose.foundation.layout.RowScope.() -> Unit) {
    Row(
        modifier.fillMaxWidth().padding(bottom = Sp.s1),
        horizontalArrangement = Arrangement.spacedBy(Sp.s2),
        content = { content() },
    )
}

/** `.toggle-switch`: iOS-style switch, 51x31, green when on. */
@Composable
fun IosSwitch(checked: Boolean, onCheckedChange: (Boolean) -> Unit, modifier: Modifier = Modifier) {
    val trackColor by animateColorAsState(
        if (checked) Color(0xFF34C759) else Theme.colors.hint.copy(alpha = 0.5f),
        tween(200),
    )
    val knobOffset by animateDpAsState(if (checked) 22.dp else 2.dp, tween(200))
    Box(
        modifier
            .size(width = 51.dp, height = 31.dp)
            .clip(RoundedCornerShape(Rad.pill))
            .background(trackColor)
            .clickable(interactionSource = remember { MutableInteractionSource() }, indication = null) {
                onCheckedChange(!checked)
            },
    ) {
        Box(
            Modifier
                .offset(x = knobOffset, y = 2.dp)
                .size(27.dp)
                .shadow(3.dp, CircleShape)
                .background(Color.White, CircleShape),
        )
    }
}

/** One option of a [SegmentedControl]. */
data class SegOption(val label: String, val icon: ImageVector? = null)

/** `.seg-control`: sliding-thumb segmented control. */
@Composable
fun SegmentedControl(
    options: List<SegOption>,
    selected: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val c = Theme.colors
    androidx.compose.ui.layout.SubcomposeLayout(
        modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(c.text.copy(alpha = 0.06f))
            .border(1.dp, c.separator, RoundedCornerShape(12.dp))
            .padding(4.dp),
    ) { constraints ->
        val count = options.size.coerceAtLeast(1)
        val gap = 4.dp.roundToPx()
        val cellW = (constraints.maxWidth - gap * (count - 1)) / count
        val thumbX = selected * (cellW + gap)

        val cells = options.mapIndexed { i, opt ->
            subcompose("cell$i") {
                Row(
                    Modifier
                        .clip(RoundedCornerShape(9.dp))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                        ) { onSelect(i) }
                        .padding(vertical = 9.dp, horizontal = 10.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterHorizontally),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    val active = i == selected
                    if (opt.icon != null) {
                        AppIcon(opt.icon, tint = if (active) c.accent else c.hint.copy(alpha = 0.65f), size = 15.dp)
                    }
                    Text(
                        opt.label,
                        style = TextStyle(
                            fontSize = 13.sp,
                            fontWeight = if (active) FontWeight.Bold else FontWeight.SemiBold,
                            color = if (active) c.text else c.hint,
                        ),
                        maxLines = 1,
                    )
                }
            }.map { it.measure(androidx.compose.ui.unit.Constraints.fixedWidth(cellW)) }
        }
        val rowH = cells.maxOf { it.maxOf { p -> p.height } }

        val thumb = subcompose("thumb") {
            Box(
                Modifier
                    .shadow(2.dp, RoundedCornerShape(9.dp))
                    .background(c.bg, RoundedCornerShape(9.dp)),
            )
        }.map { it.measure(androidx.compose.ui.unit.Constraints.fixed(cellW, rowH)) }

        layout(constraints.maxWidth, rowH) {
            thumb.forEach { it.place(thumbX, 0) }
            cells.forEachIndexed { i, placeables ->
                placeables.forEach { it.place(i * (cellW + gap), 0) }
            }
        }
    }
}

/** German flag chip icon (5x3 stripes from shell.ts). */
@Composable
fun FlagDe(modifier: Modifier = Modifier) {
    Column(modifier.size(width = 18.dp, height = 11.dp).clip(RoundedCornerShape(1.dp))) {
        Box(Modifier.weight(1f).fillMaxWidth().background(Color(0xFF000000)))
        Box(Modifier.weight(1f).fillMaxWidth().background(Color(0xFFDD0000)))
        Box(Modifier.weight(1f).fillMaxWidth().background(Color(0xFFFFCE00)))
    }
}

/** Austrian flag chip icon (red/white/red). */
@Composable
fun FlagAt(modifier: Modifier = Modifier) {
    Column(modifier.size(width = 16.dp, height = 11.dp).clip(RoundedCornerShape(1.dp))) {
        Box(Modifier.weight(1f).fillMaxWidth().background(Color(0xFFED2939)))
        Box(Modifier.weight(1f).fillMaxWidth().background(Color(0xFFFFFFFF)))
        Box(Modifier.weight(1f).fillMaxWidth().background(Color(0xFFED2939)))
    }
}
