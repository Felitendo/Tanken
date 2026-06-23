package gg.felo.tanken.platform

/**
 * Cross-platform haptic feedback. iOS maps to UIImpact/Notification/Selection feedback generators;
 * Android to VibrationEffect / HapticFeedbackConstants. Wired into every meaningful interaction so
 * the app feels premium (tab switch, marker tap, pull-to-refresh, save/test, errors).
 */
interface Haptics {
    fun light()
    fun medium()
    fun heavy()
    fun selection()
    fun success()
    fun warning()
    fun error()
}

/** No-op used for @Preview / tests. */
object NoopHaptics : Haptics {
    override fun light() {}
    override fun medium() {}
    override fun heavy() {}
    override fun selection() {}
    override fun success() {}
    override fun warning() {}
    override fun error() {}
}
