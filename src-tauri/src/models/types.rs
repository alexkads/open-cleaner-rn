use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CleaningResult {
    pub files_deleted: u32,
    pub space_freed: u64,
    pub duration: u64,
    pub errors: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ScanResult {
    pub path: String,
    pub size: u64,
    pub file_type: String,
    pub can_delete: bool,
}
