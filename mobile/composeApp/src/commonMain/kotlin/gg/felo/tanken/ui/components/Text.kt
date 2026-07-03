package gg.felo.tanken.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import gg.felo.tanken.ui.theme.LocalTextStyle

/** BasicText wrapper that inherits the theme's [LocalTextStyle]. */
@Composable
fun Text(
    text: String,
    modifier: Modifier = Modifier,
    style: TextStyle = TextStyle.Default,
    maxLines: Int = Int.MAX_VALUE,
    overflow: TextOverflow = TextOverflow.Ellipsis,
) {
    BasicText(
        text = text,
        modifier = modifier,
        style = LocalTextStyle.current.merge(style),
        maxLines = maxLines,
        overflow = overflow,
    )
}

/** Tinted vector icon (the PWA's `fill: currentColor`). */
@Composable
fun AppIcon(
    vector: ImageVector,
    tint: Color,
    size: Dp = 24.dp,
    modifier: Modifier = Modifier,
) {
    Image(
        imageVector = vector,
        contentDescription = null,
        modifier = modifier.size(size),
        colorFilter = ColorFilter.tint(tint),
    )
}
