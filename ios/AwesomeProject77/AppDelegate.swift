import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "AwesomeProject77"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    // Disable the automatic React Native window setup so we can host the
    // React Native view inside a UITabBarController.
    self.automaticallyLoadReactNativeWindow = false

    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

    // Create the React Native root view using the factory set up by super.
    let rootView = self.rootViewFactory.view(
      withModuleName: self.moduleName!,
      initialProperties: self.initialProps,
      launchOptions: launchOptions
    )

    // Tab 1: React Native page.
    let rnViewController = UIViewController()
    rnViewController.view = rootView
    rnViewController.tabBarItem = UITabBarItem(title: "RN", image: nil, tag: 0)

    // Tab 2: Native button page.
    let nativeViewController = NativeButtonViewController()
    nativeViewController.tabBarItem = UITabBarItem(title: "Native", image: nil, tag: 1)

    let tabBarController = SwipeableTabBarController()
    // 左边为原生页面,右边为 RN 页面
    tabBarController.viewControllers = [nativeViewController, rnViewController]

    self.window = UIWindow(frame: UIScreen.main.bounds)
    if let windowScene = self.window.windowScene {
      windowScene.delegate = self
    }
    self.window.rootViewController = tabBarController
    self.window.makeKeyAndVisible()

    return result
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

/// A native view controller that displays a native UIButton.
class NativeButtonViewController: UIViewController {
  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .systemBackground

    let button = UIButton(type: .system)
    button.setTitle("原生按钮", for: .normal)
    button.titleLabel?.font = .systemFont(ofSize: 18, weight: .medium)
    button.addTarget(self, action: #selector(buttonTapped), for: .touchUpInside)
    button.translatesAutoresizingMaskIntoConstraints = false

    view.addSubview(button)
    NSLayoutConstraint.activate([
      button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
      button.centerYAnchor.constraint(equalTo: view.centerYAnchor),
    ])
  }

  @objc private func buttonTapped() {
    let alert = UIAlertController(
      title: "原生按钮",
      message: "你点击了原生按钮",
      preferredStyle: .alert
    )
    alert.addAction(UIAlertAction(title: "确定", style: .default))
    present(alert, animated: true)
  }
}

/// A UITabBarController subclass that supports swiping left/right to switch tabs.
class SwipeableTabBarController: UITabBarController {
  override func viewDidLoad() {
    super.viewDidLoad()

    let swipeLeft = UISwipeGestureRecognizer(target: self, action: #selector(handleSwipe(_:)))
    swipeLeft.direction = .left
    view.addGestureRecognizer(swipeLeft)

    let swipeRight = UISwipeGestureRecognizer(target: self, action: #selector(handleSwipe(_:)))
    swipeRight.direction = .right
    view.addGestureRecognizer(swipeRight)
  }

  @objc private func handleSwipe(_ gesture: UISwipeGestureRecognizer) {
    guard let count = viewControllers?.count else { return }
    let current = selectedIndex

    if gesture.direction == .left {
      // 左滑:切到右边(下一个) tab
      if current < count - 1 {
        selectedIndex = current + 1
      }
    } else if gesture.direction == .right {
      // 右滑:切到左边(上一个) tab
      if current > 0 {
        selectedIndex = current - 1
      }
    }
  }
}
