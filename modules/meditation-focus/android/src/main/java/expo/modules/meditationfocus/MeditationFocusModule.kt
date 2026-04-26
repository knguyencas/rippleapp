package expo.modules.meditationfocus

import android.app.KeyguardManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.PowerManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MeditationFocusModule : Module() {
  private var receiver: BroadcastReceiver? = null

  override fun definition() = ModuleDefinition {
    Name("MeditationFocus")

    Events("onScreenOff", "onScreenOn")

    Function("isScreenLocked") {
      val context = appContext.reactContext ?: return@Function false
      val km = context.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager
      val pm = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
      val keyguardLocked = km?.isKeyguardLocked == true
      val screenOff = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
        pm?.isInteractive == false
      } else {
        @Suppress("DEPRECATION")
        pm?.isScreenOn == false
      }
      keyguardLocked || screenOff
    }

    OnStartObserving {
      val context = appContext.reactContext ?: return@OnStartObserving
      if (receiver != null) return@OnStartObserving

      val newReceiver = object : BroadcastReceiver() {
        override fun onReceive(c: Context?, intent: Intent?) {
          when (intent?.action) {
            Intent.ACTION_SCREEN_OFF -> sendEvent("onScreenOff")
            Intent.ACTION_USER_PRESENT -> sendEvent("onScreenOn")
          }
        }
      }

      val filter = IntentFilter().apply {
        addAction(Intent.ACTION_SCREEN_OFF)
        addAction(Intent.ACTION_USER_PRESENT)
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        context.registerReceiver(newReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
      } else {
        context.registerReceiver(newReceiver, filter)
      }

      receiver = newReceiver
    }

    OnStopObserving {
      val context = appContext.reactContext
      receiver?.let {
        try { context?.unregisterReceiver(it) } catch (_: Throwable) {}
      }
      receiver = null
    }

    OnDestroy {
      val context = appContext.reactContext
      receiver?.let {
        try { context?.unregisterReceiver(it) } catch (_: Throwable) {}
      }
      receiver = null
    }
  }
}
