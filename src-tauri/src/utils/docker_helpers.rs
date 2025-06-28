pub fn parse_docker_size(size_str: &str) -> Option<u64> {
    let size_str = size_str.trim();
    if size_str == "0B" || size_str == "0" {
        return Some(0);
    }

    let size_str = size_str.replace(" ", "");
    let (number_part, unit_part) = if let Some(pos) = size_str.find(|c: char| c.is_alphabetic()) {
        (&size_str[..pos], &size_str[pos..])
    } else {
        return None;
    };

    let number: f64 = number_part.parse().ok()?;

    let multiplier = match unit_part.to_uppercase().as_str() {
        "B" => 1,
        "KB" => 1024,
        "MB" => 1024 * 1024,
        "GB" => 1024 * 1024 * 1024,
        "TB" => 1024_u64.pow(4),
        _ => return None,
    };

    Some((number * multiplier as f64) as u64)
}

pub fn parse_docker_volume_size(df_output: &str) -> Option<u64> {
    for line in df_output.lines() {
        let parts: Vec<&str> = line.split('\t').collect();
        if parts.len() >= 4 && parts[0].trim() == "Local Volumes" {
            return parse_docker_size(parts[3].trim());
        }
    }
    None
}
