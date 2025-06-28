use crate::models::{CleaningResult, ScanResult};
use crate::utils::{parse_docker_size, parse_docker_volume_size};
use std::process::Command;

#[tauri::command]
pub async fn scan_docker_containers() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    if which::which("docker").is_err() {
        return Ok(results);
    }

    let output = Command::new("docker")
        .args(&[
            "container",
            "ls",
            "-a",
            "--filter",
            "status=exited",
            "--format",
            "{{.ID}},{{.Names}},{{.Size}}",
        ])
        .output();

    if let Ok(output) = output {
        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                let parts: Vec<&str> = line.split(',').collect();
                if parts.len() >= 3 {
                    let container_id = parts[0];
                    let _container_name = parts[1];
                    let size_str = parts[2];

                    let size = parse_docker_size(size_str).unwrap_or(0);

                    if size > 0 {
                        results.push(ScanResult {
                            path: format!("docker://container/{}", container_id),
                            size,
                            file_type: "docker_container".to_string(),
                            can_delete: true,
                        });
                    }
                }
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_docker_images() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    if which::which("docker").is_err() {
        return Ok(results);
    }

    let output = Command::new("docker")
        .args(&[
            "images",
            "-f",
            "dangling=true",
            "--format",
            "{{.ID}},{{.Size}}",
        ])
        .output();

    if let Ok(output) = output {
        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                let parts: Vec<&str> = line.split(',').collect();
                if parts.len() >= 2 {
                    let image_id = parts[0];
                    let size_str = parts[1];

                    let size = parse_docker_size(size_str).unwrap_or(0);

                    if size > 0 {
                        results.push(ScanResult {
                            path: format!("docker://image/{}", image_id),
                            size,
                            file_type: "docker_image".to_string(),
                            can_delete: true,
                        });
                    }
                }
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_docker_volumes() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    if which::which("docker").is_err() {
        return Ok(results);
    }

    let output = Command::new("docker")
        .args(&[
            "volume",
            "ls",
            "-f",
            "dangling=true",
            "--format",
            "{{.Name}}",
        ])
        .output();

    if let Ok(output) = output {
        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                let volume_name = line.trim();
                if !volume_name.is_empty() {
                    let inspect_output = Command::new("docker")
                        .args(&[
                            "system",
                            "df",
                            "-v",
                            "--format",
                            "table {{.Type}}\t{{.TotalCount}}\t{{.Size}}\t{{.Reclaimable}}",
                        ])
                        .output();

                    let size = if let Ok(inspect_output) = inspect_output {
                        if inspect_output.status.success() {
                            let inspect_stdout = String::from_utf8_lossy(&inspect_output.stdout);
                            parse_docker_volume_size(&inspect_stdout).unwrap_or(1024 * 1024)
                        } else {
                            1024 * 1024
                        }
                    } else {
                        1024 * 1024
                    };

                    results.push(ScanResult {
                        path: format!("docker://volume/{}", volume_name),
                        size,
                        file_type: "docker_volume".to_string(),
                        can_delete: true,
                    });
                }
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn scan_docker_cache() -> Result<Vec<ScanResult>, String> {
    let mut results = Vec::new();

    if which::which("docker").is_err() {
        return Ok(results);
    }

    let output = Command::new("docker")
        .args(&[
            "system",
            "df",
            "--format",
            "table {{.Type}}\t{{.TotalCount}}\t{{.Size}}\t{{.Reclaimable}}",
        ])
        .output();

    if let Ok(output) = output {
        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let lines: Vec<&str> = stdout.lines().collect();

            for line in lines {
                let parts: Vec<&str> = line.split('\t').collect();
                if parts.len() >= 4 {
                    let resource_type = parts[0].trim();
                    let reclaimable_str = parts[3].trim();

                    if resource_type == "Build Cache"
                        && reclaimable_str != "0B"
                        && reclaimable_str != "0"
                    {
                        let size = parse_docker_size(reclaimable_str).unwrap_or(0);

                        if size > 0 {
                            results.push(ScanResult {
                                path: "docker://cache/build".to_string(),
                                size,
                                file_type: "docker_cache".to_string(),
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
pub async fn clean_docker_resources(resource_paths: Vec<String>) -> Result<CleaningResult, String> {
    let start_time = std::time::Instant::now();
    let mut files_deleted = 0;
    let mut space_freed = 0;
    let mut errors = Vec::new();

    for resource_path in resource_paths {
        if resource_path.starts_with("docker://") {
            let parts: Vec<&str> = resource_path
                .strip_prefix("docker://")
                .unwrap()
                .split('/')
                .collect();
            if parts.len() >= 2 {
                let resource_type = parts[0];
                let resource_id = parts[1];

                let result = match resource_type {
                    "container" => Command::new("docker")
                        .args(&["container", "rm", resource_id])
                        .output(),
                    "image" => Command::new("docker")
                        .args(&["image", "rm", resource_id])
                        .output(),
                    "volume" => Command::new("docker")
                        .args(&["volume", "rm", resource_id])
                        .output(),
                    "cache" => Command::new("docker")
                        .args(&["builder", "prune", "-f"])
                        .output(),
                    _ => {
                        errors.push(format!("Unknown Docker resource type: {}", resource_type));
                        continue;
                    }
                };

                match result {
                    Ok(output) => {
                        if output.status.success() {
                            files_deleted += 1;
                            space_freed += 10 * 1024 * 1024;
                        } else {
                            let error_msg = String::from_utf8_lossy(&output.stderr);
                            errors
                                .push(format!("Failed to remove {}: {}", resource_path, error_msg));
                        }
                    }
                    Err(e) => {
                        errors.push(format!(
                            "Failed to execute Docker command for {}: {}",
                            resource_path, e
                        ));
                    }
                }
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
