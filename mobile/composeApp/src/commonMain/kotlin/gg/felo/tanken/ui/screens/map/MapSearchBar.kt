package gg.felo.tanken.ui.screens.map

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gg.felo.tanken.i18n.Strings
import gg.felo.tanken.model.PriceBand
import gg.felo.tanken.ui.components.AppIcon
import gg.felo.tanken.ui.components.Text
import gg.felo.tanken.ui.icons.AppIcons
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Theme
import gg.felo.tanken.ui.theme.LocalAppFont
import gg.felo.tanken.util.twoDecimals

/**
 * Top overlay of the map: search box + "Hier suchen" pill + route chip and
 * the suggestion dropdown (`#map-search-box`, `.map-search-here`,
 * `.map-route-chip` in the PWA).
 */
@Composable
fun MapSearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    suggestions: List<SearchSuggestion>,
    band: PriceBand?,
    showSearchHere: Boolean,
    strings: Strings,
    onSuggestionTap: (SearchSuggestion) -> Unit,
    onSearchHere: () -> Unit,
    onRouteTap: (() -> Unit)?,
    modifier: Modifier = Modifier,
) {
    val c = Theme.colors
    Column(modifier.fillMaxWidth().padding(horizontal = 12.dp)) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // `#map-search-box`
            Row(
                Modifier
                    .weight(1f)
                    .height(44.dp)
                    .shadow(4.dp, RoundedCornerShape(12.dp))
                    .clip(RoundedCornerShape(12.dp))
                    .background(c.bg)
                    .padding(horizontal = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                AppIcon(AppIcons.Search, tint = c.hint, size = 18.dp)
                Box(Modifier.weight(1f)) {
                    if (query.isEmpty()) {
                        Text(
                            strings.searchPlaceholder,
                            style = TextStyle(fontSize = 15.sp, color = c.hint),
                            maxLines = 1,
                        )
                    }
                    BasicTextField(
                        value = query,
                        onValueChange = onQueryChange,
                        singleLine = true,
                        textStyle = TextStyle(fontSize = 15.sp, color = c.text, fontFamily = LocalAppFont.current),
                        cursorBrush = SolidColor(c.accent),
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
                if (query.isNotEmpty()) {
                    Box(
                        Modifier
                            .size(24.dp)
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                            ) { onQueryChange("") },
                        contentAlignment = Alignment.Center,
                    ) {
                        AppIcon(AppIcons.Close, tint = c.hint, size = 16.dp)
                    }
                }
            }
            // `.map-search-here` pill
            if (showSearchHere) {
                Row(
                    Modifier
                        .shadow(5.dp, RoundedCornerShape(999.dp))
                        .clip(RoundedCornerShape(999.dp))
                        .background(c.accent)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            onClick = onSearchHere,
                        )
                        .padding(horizontal = 18.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    AppIcon(AppIcons.Search, tint = c.accentText, size = 16.dp)
                    Text(
                        strings.searchHere,
                        style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = c.accentText),
                        maxLines = 1,
                    )
                }
            }
        }

        // `.map-route-chip`
        if (onRouteTap != null) {
            Row(
                Modifier
                    .padding(top = 8.dp)
                    .shadow(3.dp, RoundedCornerShape(999.dp))
                    .clip(RoundedCornerShape(999.dp))
                    .background(c.bg)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onRouteTap,
                    )
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                AppIcon(AppIcons.Route, tint = c.text, size = 14.dp)
                Text(strings.routePlan, style = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Medium), maxLines = 1)
            }
        }

        // Suggestion dropdown
        if (suggestions.isNotEmpty()) {
            Column(
                Modifier
                    .padding(top = 8.dp)
                    .fillMaxWidth()
                    .shadow(8.dp, RoundedCornerShape(12.dp))
                    .clip(RoundedCornerShape(12.dp))
                    .background(c.bg)
                    .heightIn(max = 320.dp)
                    .verticalScroll(rememberScrollState()),
            ) {
                suggestions.forEach { suggestion ->
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                            ) { onSuggestionTap(suggestion) }
                            .padding(horizontal = 14.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        AppIcon(
                            if (suggestion.isPlace) AppIcons.Pin else AppIcons.Search,
                            tint = c.hint,
                            size = 16.dp,
                        )
                        Column(Modifier.weight(1f)) {
                            Text(suggestion.title, style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Medium), maxLines = 1)
                            suggestion.subtitle?.let {
                                Text(it, style = TextStyle(fontSize = 12.sp, color = c.hint), maxLines = 1)
                            }
                        }
                        suggestion.price?.let { price ->
                            Text(
                                twoDecimals(price),
                                style = TextStyle(
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PriceColor.forPrice(price, band?.p10, band?.p90),
                                ),
                            )
                        }
                    }
                    Box(Modifier.fillMaxWidth().height(0.5.dp).background(c.separator))
                }
            }
        }
    }
}
