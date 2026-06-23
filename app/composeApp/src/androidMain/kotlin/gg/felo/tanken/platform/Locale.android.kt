package gg.felo.tanken.platform

import java.util.Locale

actual fun platformLanguageCode(): String = Locale.getDefault().language
