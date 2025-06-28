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
                        if name.starts_with("react-native-") || 
                           name.starts_with("metro-") || 
                           name.starts_with("expo-") || 
                           name.starts_with("haste-map-") ||
                           name == ".tmp" {
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