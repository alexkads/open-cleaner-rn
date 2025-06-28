use crate::models::{CleaningResult, ScanResult};
use crate::utils::get_dir_size;
use std::path::PathBuf;
use walkdir::WalkDir;

#[tauri::command]
pub async fn scan_node_modules(project_path: String) -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();
    let path = PathBuf::from(project_path);
    
    if !path.exists() {
        return Err("Project path does not exist".to_string());
    }
    
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
pub async fn clean_files(file_paths: Vec<String>) -> Result<CleaningResult, String> {
    let start_time = std::time::Instant::now();
    let mut files_deleted = 0;
    let mut space_freed = 0;
    let mut errors = Vec::new();
    
    for file_path in file_paths {
        let path = PathBuf::from(&file_path);
        
        if path.exists() {
            if let Ok(size) = if path.is_dir() {
                get_dir_size(&path)
            } else {
                path.metadata().map(|m| m.len())
            } {
                space_freed += size;
            }
            
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