#[tauri::command]
pub async fn get_system_info() -> Result<serde_json::Value, String> {
    let mut info = serde_json::Map::new();

    if let Some(home) = dirs::home_dir() {
        info.insert(
            "home_dir".to_string(),
            serde_json::Value::String(home.to_string_lossy().to_string()),
        );
    }

    let tools = vec!["node", "npm", "yarn", "expo", "react-native"];
    let mut installed_tools = Vec::new();

    for tool in tools {
        if which::which(tool).is_ok() {
            installed_tools.push(tool);
        }
    }

    info.insert(
        "installed_tools".to_string(),
        serde_json::Value::Array(
            installed_tools
                .into_iter()
                .map(|t| serde_json::Value::String(t.to_string()))
                .collect(),
        ),
    );

    Ok(serde_json::Value::Object(info))
}
