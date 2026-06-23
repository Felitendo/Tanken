package gg.felo.tanken.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.MyLocation
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.rememberModalBottomSheetState
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng as GLatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.MapProperties
import com.google.maps.android.compose.MapUiSettings
import com.google.maps.android.compose.MapsComposeExperimentalApi
import com.google.maps.android.compose.MarkerComposable
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState
import gg.felo.tanken.i18n.LocalStrings
import gg.felo.tanken.net.ApiClient
import gg.felo.tanken.platform.Haptics
import gg.felo.tanken.platform.MapsLink
import gg.felo.tanken.state.MapViewModel
import gg.felo.tanken.ui.theme.PriceColor
import gg.felo.tanken.ui.theme.Spacing
import gg.felo.tanken.ui.theme.TankenTheme
import gg.felo.tanken.util.formatPrice
import kotlinx.coroutines.launch
import org.koin.compose.koinInject

@OptIn(ExperimentalMaterial3Api::class, MapsComposeExperimentalApi::class)
@Composable
actual fun MapScreen() {
    val vm = koinInject<MapViewModel>()
    val haptics = koinInject<Haptics>()
    val mapsLink = koinInject<MapsLink>()
    val api = koinInject<ApiClient>()
    val state by vm.state.collectAsState()
    val s = LocalStrings.current
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val keyboard = LocalSoftwareKeyboardController.current

    var hasLocation by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED,
        )
    }
    val permLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        hasLocation = granted
        if (granted) vm.locateUser()
    }

    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(GLatLng(state.center.lat, state.center.lng), 12f)
    }

    LaunchedEffect(Unit) { vm.start() }
    LaunchedEffect(state.center) {
        cameraPositionState.animate(CameraUpdateFactory.newLatLng(GLatLng(state.center.lat, state.center.lng)), 600)
    }

    var query by remember { mutableStateOf("") }

    Box(Modifier.fillMaxSize()) {
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState,
            properties = MapProperties(isMyLocationEnabled = hasLocation),
            uiSettings = MapUiSettings(zoomControlsEnabled = false, myLocationButtonEnabled = false, mapToolbarEnabled = false),
            onMapClick = { vm.select(null) },
        ) {
            state.stations.forEach { s ->
                if (s.price != null && s.price > 0) {
                    val color = PriceColor.forPrice(s.price, state.band)
                    MarkerComposable(
                        s.id, s.price, color.value,
                        state = MarkerState(position = GLatLng(s.lat, s.lng)),
                        onClick = { haptics.light(); vm.select(s); true },
                        anchor = androidx.compose.ui.geometry.Offset(0.5f, 1f),
                    ) {
                        PriceBubble(brand = s.displayBrand, price = s.price, color = color)
                    }
                }
            }
        }

        // Top: search field + "Hier suchen"
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .windowInsetsPadding(WindowInsets.statusBars)
                .padding(Spacing.m),
            verticalArrangement = Arrangement.spacedBy(Spacing.s),
        ) {
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = TankenTheme.colors.bgElevated,
                shadowElevation = 4.dp,
                modifier = Modifier.fillMaxWidth(),
            ) {
                TextField(
                    value = query,
                    onValueChange = { query = it },
                    placeholder = { Text(s.mapSearchPlaceholder) },
                    leadingIcon = { Icon(Icons.Outlined.Search, null, tint = TankenTheme.colors.textHint) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                    keyboardActions = KeyboardActions(onSearch = {
                        keyboard?.hide()
                        if (query.isNotBlank()) {
                            haptics.medium()
                            scope.launch {
                                val res = runCatching { api.geocode(query) }.getOrNull()?.results?.firstOrNull()
                                if (res != null) vm.searchHere(res.lat, res.lng)
                            }
                        }
                    }),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Color.Transparent,
                        unfocusedContainerColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent,
                    ),
                )
            }

            Row(horizontalArrangement = Arrangement.Center, modifier = Modifier.fillMaxWidth()) {
                Pill(text = s.searchHere) {
                    haptics.medium()
                    val target = cameraPositionState.position.target
                    vm.searchHere(target.latitude, target.longitude)
                }
            }
        }

        if (state.loading) {
            CircularProgressIndicator(
                color = TankenTheme.colors.accent,
                modifier = Modifier.align(Alignment.Center).size(36.dp),
            )
        }

        // Location FAB
        Box(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(Spacing.l)
                .size(48.dp)
                .clip(CircleShape)
                .background(TankenTheme.colors.bgElevated)
                .clickable {
                    haptics.light()
                    if (hasLocation) vm.locateUser() else permLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
                },
            contentAlignment = Alignment.Center,
        ) {
            Icon(Icons.Outlined.MyLocation, s.myLocation, tint = TankenTheme.colors.accent)
        }

        // Detail sheet
        val selected = state.selected
        if (selected != null) {
            val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = false)
            ModalBottomSheet(
                onDismissRequest = { vm.select(null) },
                sheetState = sheetState,
                containerColor = TankenTheme.colors.bgElevated,
            ) {
                StationDetailContent(selected, state.band, mapsLink, haptics)
            }
        }
    }
}

@Composable
private fun PriceBubble(brand: String, price: Double, color: Color) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(color)
            .padding(horizontal = 8.dp, vertical = 3.dp),
    ) {
        if (brand.isNotBlank()) {
            Text(brand.take(12), color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Medium)
        }
        Text(formatPrice(price), color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.ExtraBold)
    }
}

@Composable
private fun Pill(text: String, onClick: () -> Unit) {
    Surface(
        shape = RoundedCornerShape(999.dp),
        color = TankenTheme.colors.accent,
        shadowElevation = 4.dp,
        modifier = Modifier.clip(RoundedCornerShape(999.dp)).clickable(onClick = onClick),
    ) {
        Text(
            text,
            color = Color.White,
            fontWeight = FontWeight.SemiBold,
            fontSize = 14.sp,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
        )
    }
}
