package gg.felo.tanken.platform

import platform.Foundation.NSLocale
import platform.Foundation.currentLocale
import platform.Foundation.languageCode

actual fun platformLanguageCode(): String = NSLocale.currentLocale.languageCode ?: "de"
