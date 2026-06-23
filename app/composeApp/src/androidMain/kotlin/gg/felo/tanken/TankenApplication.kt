package gg.felo.tanken

import android.app.Application
import gg.felo.tanken.di.initKoin

class TankenApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        initKoin(androidModule(this))
    }
}
