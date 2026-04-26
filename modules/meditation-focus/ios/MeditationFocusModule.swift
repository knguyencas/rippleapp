import ExpoModulesCore
import UIKit

public class MeditationFocusModule: Module {
  private var willBecomeUnavailableObserver: NSObjectProtocol?
  private var didBecomeAvailableObserver: NSObjectProtocol?

  public func definition() -> ModuleDefinition {
    Name("MeditationFocus")

    Events("onScreenOff", "onScreenOn")

    Function("isScreenLocked") { () -> Bool in
      return !UIApplication.shared.isProtectedDataAvailable
    }

    OnStartObserving {
      if self.willBecomeUnavailableObserver == nil {
        self.willBecomeUnavailableObserver = NotificationCenter.default.addObserver(
          forName: UIApplication.protectedDataWillBecomeUnavailableNotification,
          object: nil,
          queue: .main
        ) { [weak self] _ in
          self?.sendEvent("onScreenOff", [:])
        }
      }
      if self.didBecomeAvailableObserver == nil {
        self.didBecomeAvailableObserver = NotificationCenter.default.addObserver(
          forName: UIApplication.protectedDataDidBecomeAvailableNotification,
          object: nil,
          queue: .main
        ) { [weak self] _ in
          self?.sendEvent("onScreenOn", [:])
        }
      }
    }

    OnStopObserving {
      if let obs = self.willBecomeUnavailableObserver {
        NotificationCenter.default.removeObserver(obs)
        self.willBecomeUnavailableObserver = nil
      }
      if let obs = self.didBecomeAvailableObserver {
        NotificationCenter.default.removeObserver(obs)
        self.didBecomeAvailableObserver = nil
      }
    }

    OnDestroy {
      if let obs = self.willBecomeUnavailableObserver {
        NotificationCenter.default.removeObserver(obs)
      }
      if let obs = self.didBecomeAvailableObserver {
        NotificationCenter.default.removeObserver(obs)
      }
    }
  }
}
