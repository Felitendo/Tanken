package gg.felo.tanken.di

import gg.felo.tanken.data.StationRepository
import gg.felo.tanken.net.ApiClient
import gg.felo.tanken.net.TokenProvider
import gg.felo.tanken.platform.SecureStore
import gg.felo.tanken.state.AppConfig
import gg.felo.tanken.state.MapViewModel
import org.koin.core.KoinApplication
import org.koin.core.context.startKoin
import org.koin.core.module.Module
import org.koin.dsl.module

/**
 * Common DI graph. Platform modules supply `Settings`, `Haptics`, `SecureStore`, `Geolocation`
 * and `MapsLink` (they need a Context on Android), then call [initKoin] with their module.
 */
val commonModule = module {
    single { AppConfig(get()) }
    single { TokenProvider(get<SecureStore>().getToken()) }
    single { ApiClient(get(), get()) }
    single { StationRepository(get()) }
    single { MapViewModel(get(), get(), get()) }
}

fun initKoin(platformModule: Module): KoinApplication = startKoin {
    modules(platformModule, commonModule)
}
