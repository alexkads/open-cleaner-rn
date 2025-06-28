use crate::models::ScanResult;
use crate::utils::get_dir_size;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub async fn scan_expo_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".expo"),
        home_dir.join("Library/Caches/Expo"),
        home_dir.join("AppData/Local/Expo"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "expo_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_metro_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".metro"),
        home_dir.join("Library/Caches/Metro"),
        home_dir.join("AppData/Local/Metro"),
        std::env::temp_dir().join("metro-cache"),
        std::env::temp_dir().join("react-native-packager-cache"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "metro_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_ios_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join("Library/Developer/Xcode/DerivedData"),
        home_dir.join("Library/Caches/com.apple.dt.Xcode"),
        home_dir.join("Library/Developer/CoreSimulator/Caches"),
        home_dir.join("Library/Logs/CoreSimulator"),
        home_dir.join("Library/Developer/Xcode/iOS DeviceSupport"),
        home_dir.join("Library/Developer/Xcode/watchOS DeviceSupport"),
        home_dir.join("Library/Developer/Xcode/tvOS DeviceSupport"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "ios_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_android_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".gradle/caches"),
        home_dir.join(".gradle/daemon"),
        home_dir.join(".android/cache"),
        home_dir.join(".android/avd/.temp"),
        home_dir.join("Library/Android/sdk/.temp"),
        home_dir.join("AppData/Local/Android/Sdk/.temp"),
        home_dir.join("AppData/Local/Temp/AndroidEmulator"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "android_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_npm_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".npm/_cacache"),
        home_dir.join(".yarn/cache"),
        home_dir.join("Library/Caches/npm"),
        home_dir.join("Library/Caches/yarn"),
        home_dir.join("AppData/Roaming/npm-cache"),
        home_dir.join("AppData/Local/Yarn/Cache"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "npm_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_watchman_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".watchman"),
        std::env::temp_dir().join("watchman"),
        home_dir.join("Library/Logs/watchman"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "watchman_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_cocoapods_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join("Library/Caches/CocoaPods"),
        home_dir.join(".cocoapods/repos"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "cocoapods_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_flipper_logs() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".flipper"),
        home_dir.join("Library/Application Support/flipper"),
        home_dir.join("AppData/Roaming/flipper"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "flipper_logs".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_temp_files() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;
    let temp_dir = std::env::temp_dir();

    let temp_patterns = vec![
        temp_dir.join("react-native-*"),
        temp_dir.join("metro-*"),
        temp_dir.join("expo-*"),
        temp_dir.join("haste-map-*"),
        home_dir.join(".tmp"),
    ];

    for pattern in temp_patterns {
        let parent = pattern.parent().unwrap_or(&temp_dir);
        if parent.exists() {
            if let Ok(entries) = std::fs::read_dir(parent) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                        if name.starts_with("react-native-")
                            || name.starts_with("metro-")
                            || name.starts_with("expo-")
                            || name.starts_with("haste-map-")
                            || name == ".tmp"
                        {
                            if let Ok(size) = get_dir_size(&path) {
                                results.push(ScanResult {
                                    path: path.to_string_lossy().to_string(),
                                    size,
                                    file_type: "temp_files".to_string(),
                                    can_delete: true,
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_react_native_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".react-native"),
        home_dir.join("Library/Caches/com.facebook.react"),
        home_dir.join("AppData/Local/React Native"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "react_native_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_hermes_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".hermes"),
        home_dir.join("Library/Caches/Hermes"),
        home_dir.join("AppData/Local/Hermes"),
        std::env::temp_dir().join("hermes-*"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "hermes_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_vscode_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".vscode/extensions"),
        home_dir.join("Library/Application Support/Code/logs"),
        home_dir.join("Library/Caches/com.microsoft.VSCode"),
        home_dir.join("AppData/Roaming/Code/logs"),
        home_dir.join("AppData/Roaming/Code/CachedExtensions"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "vscode_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_android_studio_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join("Library/Application Support/Google/AndroidStudio*/system"),
        home_dir.join("Library/Logs/Google/AndroidStudio*"),
        home_dir.join("Library/Caches/Google/AndroidStudio*"),
        home_dir.join("AppData/Local/Google/AndroidStudio*/system"),
        home_dir.join("AppData/Local/Google/AndroidStudio*/log"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "android_studio_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_build_artifacts() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let artifact_paths = vec![
        home_dir.join("Desktop/*.apk"),
        home_dir.join("Desktop/*.ipa"),
        home_dir.join("Downloads/*.apk"),
        home_dir.join("Downloads/*.ipa"),
        home_dir.join("Documents/*.apk"),
        home_dir.join("Documents/*.ipa"),
    ];

    for pattern in artifact_paths {
        let parent = pattern.parent().unwrap_or(&home_dir);
        if parent.exists() {
            if let Ok(entries) = std::fs::read_dir(parent) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if let Some(extension) = path.extension().and_then(|e| e.to_str()) {
                        if extension == "apk" || extension == "ipa" {
                            if let Ok(metadata) = entry.metadata() {
                                results.push(ScanResult {
                                    path: path.to_string_lossy().to_string(),
                                    size: metadata.len(),
                                    file_type: "build_artifacts".to_string(),
                                    can_delete: true,
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_homebrew_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let cache_paths = vec![
        std::path::PathBuf::from("/opt/homebrew/var/cache"),
        std::path::PathBuf::from("/usr/local/var/cache"),
        dirs::home_dir()
            .unwrap_or_default()
            .join("Library/Caches/Homebrew"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "homebrew_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_git_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join("Library/Caches/com.github.GitHubDesktop"),
        home_dir.join("AppData/Roaming/GitHub Desktop/logs"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() && cache_path.is_dir() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "git_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_intellij_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join("Library/Caches/JetBrains"),
        home_dir.join("Library/Logs/JetBrains"),
        home_dir.join("AppData/Local/JetBrains"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "intellij_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_python_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".pip/cache"),
        home_dir.join("Library/Caches/pip"),
        home_dir.join("AppData/Local/pip/Cache"),
        home_dir.join(".cache/pypoetry"),
        home_dir.join("Library/Caches/pypoetry"),
        home_dir.join(".conda/pkgs"),
        home_dir.join("Library/Caches/conda"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "python_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_rust_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".cargo/registry"),
        home_dir.join(".cargo/git"),
        home_dir.join(".rustup/downloads"),
        home_dir.join(".rustup/tmp"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "rust_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_browser_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join("Library/Caches/Google/Chrome"),
        home_dir.join("Library/Caches/Mozilla/Firefox"),
        home_dir.join("Library/Caches/com.apple.Safari"),
        home_dir.join("AppData/Local/Google/Chrome/User Data/Default/Cache"),
        home_dir.join("AppData/Local/Mozilla/Firefox/Profiles"),
        home_dir.join("AppData/Local/Microsoft/Edge/User Data/Default/Cache"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "browser_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_system_logs() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let log_paths = vec![
        home_dir.join("Library/Logs"),
        home_dir.join("Library/Application Support/CrashReporter"),
        std::path::PathBuf::from("/tmp"),
    ];

    for log_path in log_paths {
        if log_path.exists() {
            if let Ok(size) = get_dir_size(&log_path) {
                results.push(ScanResult {
                    path: log_path.to_string_lossy().to_string(),
                    size,
                    file_type: "system_logs".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_pnpm_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join(".pnpm-store"),
        home_dir.join("Library/pnpm"),
        home_dir.join("AppData/Local/pnpm-cache"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "pnpm_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_unity_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join("Library/Unity/cache"),
        home_dir.join("Library/Logs/Unity"),
        home_dir.join("AppData/Local/Unity/cache"),
        home_dir.join("AppData/LocalLow/Unity"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "unity_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_simulator_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;

    let cache_paths = vec![
        home_dir.join("Library/Developer/CoreSimulator/Devices"),
        home_dir.join("Library/Logs/CoreSimulator"),
        home_dir.join("Library/Saved Application State/com.apple.iphonesimulator.savedState"),
    ];

    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(size) = get_dir_size(&cache_path) {
                results.push(ScanResult {
                    path: cache_path.to_string_lossy().to_string(),
                    size,
                    file_type: "simulator_cache".to_string(),
                    can_delete: true,
                });
            }
        }
    }

    Ok(results)
}
