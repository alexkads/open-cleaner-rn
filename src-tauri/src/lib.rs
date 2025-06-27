use tauri::{
    tray::{TrayIconBuilder, TrayIconEvent},
    menu::{Menu, MenuItem},
    Manager, Runtime,
};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use walkdir::WalkDir;

#[derive(Debug, Serialize, Deserialize)]
struct CleaningResult {
    files_deleted: u32,
    space_freed: u64,
    duration: u64,
    errors: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ScanResult {
    path: String,
    size: u64,
    file_type: String,
    can_delete: bool,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn scan_expo_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();
    
    // Get user home directory
    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;
    
    // Common React Native / Expo cache paths
    let cache_paths = vec![
        home_dir.join(".expo"),
        home_dir.join(".gradle/caches"),
        home_dir.join("Library/Developer/Xcode/DerivedData"),
        home_dir.join("Library/Caches/com.apple.dt.Xcode"),
        home_dir.join("AppData/Local/Temp"), // Windows
    ];
    
    for cache_path in cache_paths {
        if cache_path.exists() {
            if let Ok(entries) = WalkDir::new(&cache_path).into_iter().collect::<Result<Vec<_>, _>>() {
                for entry in entries {
                    if let Ok(metadata) = entry.metadata() {
                        if metadata.is_file() {
                            results.push(ScanResult {
                                path: entry.path().to_string_lossy().to_string(),
                                size: metadata.len(),
                                file_type: "cache".to_string(),
                                can_delete: true,
                            });
                        }
                    }
                }
            }
        }
    }
    
    Ok(results)
}

#[tauri::command]
async fn scan_node_modules(project_path: String) -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();
    let path = PathBuf::from(project_path);
    
    if !path.exists() {
        return Err("Project path does not exist".to_string());
    }
    
    // Find all node_modules directories
    for entry in WalkDir::new(&path)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_name() == "node_modules" && e.file_type().is_dir())
    {
        if let Ok(size) = get_dir_size(entry.path()) {
            results.push(ScanResult {
                path: entry.path().to_string_lossy().to_string(),
                size,
                file_type: "node_modules".to_string(),
                can_delete: true,
            });
        }
    }
    
    Ok(results)
}

#[tauri::command]
async fn clean_files(file_paths: Vec<String>) -> Result<CleaningResult, String> {
    let start_time = std::time::Instant::now();
    let mut files_deleted = 0;
    let mut space_freed = 0;
    let mut errors = Vec::new();
    
    for file_path in file_paths {
        let path = PathBuf::from(&file_path);
        
        if path.exists() {
            // Calculate size before deletion
            if let Ok(size) = if path.is_dir() {
                get_dir_size(&path)
            } else {
                path.metadata().map(|m| m.len())
            } {
                space_freed += size;
            }
            
            // Delete the file/directory
            let result = if path.is_dir() {
                std::fs::remove_dir_all(&path)
            } else {
                std::fs::remove_file(&path)
            };
            
            match result {
                Ok(_) => files_deleted += 1,
                Err(e) => errors.push(format!("Failed to delete {}: {}", file_path, e)),
            }
        }
    }
    
    let duration = start_time.elapsed().as_millis() as u64;
    
    Ok(CleaningResult {
        files_deleted,
        space_freed,
        duration,
        errors,
    })
}

#[tauri::command]
async fn get_system_info() -> Result<serde_json::Value, String> {
    let mut info = serde_json::Map::new();
    
    // Get system information
    if let Some(home) = dirs::home_dir() {
        info.insert("home_dir".to_string(), serde_json::Value::String(home.to_string_lossy().to_string()));
    }
    
    // Check if common development tools are installed
    let tools = vec!["node", "npm", "yarn", "expo", "react-native"];
    let mut installed_tools = Vec::new();
    
    for tool in tools {
        if which::which(tool).is_ok() {
            installed_tools.push(tool);
        }
    }
    
    info.insert("installed_tools".to_string(), serde_json::Value::Array(
        installed_tools.into_iter().map(|t| serde_json::Value::String(t.to_string())).collect()
    ));
    
    Ok(serde_json::Value::Object(info))
}

fn get_dir_size(path: &std::path::Path) -> Result<u64, std::io::Error> {
    let mut size = 0;
    for entry in WalkDir::new(path) {
        let entry = entry?;
        if entry.file_type().is_file() {
            size += entry.metadata()?.len();
        }
    }
    Ok(size)
}

fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let show_i = MenuItem::with_id(app, "show", "Mostrar Janela", true, None::<&str>)?;
    let separator = MenuItem::new(app, "---", false, None::<&str>)?;
    let quit_i = MenuItem::with_id(app, "quit", "Sair", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show_i, &separator, &quit_i])?;

    let _ = TrayIconBuilder::with_id("main-tray")
        .tooltip("Clean RN Dev - React Native Environment Cleaner")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "quit" => {
                app.exit(0);
            }
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                    let _ = window.unminimize();
                }
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: tauri::tray::MouseButton::Left,
                button_state: tauri::tray::MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app);

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            scan_expo_cache,
            scan_node_modules,
            clean_files,
            get_system_info
        ])
        .setup(|app| {
            create_tray(app.handle())?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                // Prevent the window from closing and hide it instead
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
