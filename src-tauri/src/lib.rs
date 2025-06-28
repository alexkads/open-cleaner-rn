mod commands;
mod models;
mod tray;
mod utils;

use commands::*;
use tray::create_tray;

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
            scan_metro_cache,
            scan_ios_cache,
            scan_android_cache,
            scan_npm_cache,
            scan_watchman_cache,
            scan_cocoapods_cache,
            scan_flipper_logs,
            scan_temp_files,
            scan_react_native_cache,
            scan_hermes_cache,
            scan_vscode_cache,
            scan_android_studio_cache,
            scan_build_artifacts,
            scan_homebrew_cache,
            scan_docker_containers,
            scan_docker_images,
            scan_docker_volumes,
            scan_docker_cache,
            clean_docker_resources,
            scan_node_modules,
            clean_files,
            get_system_info,
            scan_git_cache,
            scan_intellij_cache,
            scan_python_cache,
            scan_rust_cache,
            scan_browser_cache,
            scan_system_logs,
            scan_pnpm_cache,
            scan_unity_cache,
            scan_simulator_cache
        ])
        .setup(|app| {
            create_tray(app.handle())?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
