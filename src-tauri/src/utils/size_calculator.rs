use walkdir::WalkDir;

pub fn get_dir_size(path: &std::path::Path) -> Result<u64, std::io::Error> {
    let mut size = 0;
    for entry in WalkDir::new(path) {
        let entry = entry?;
        if entry.file_type().is_file() {
            size += entry.metadata()?.len();
        }
    }
    Ok(size)
}
