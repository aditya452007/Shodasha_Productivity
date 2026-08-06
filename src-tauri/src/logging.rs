use std::fs;
use std::path::PathBuf;
use tracing_subscriber::{fmt, EnvFilter};

const MAX_LOG_BYTES: u64 = 5 * 1024 * 1024; // 5 MB

pub fn init_logging() {
    let mut log_dir = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    log_dir.push("Shodasha");
    log_dir.push("logs");
    fs::create_dir_all(&log_dir).ok();

    let log_file = log_dir.join("tauri.log");

    // Rotate: if the log exceeds MAX_LOG_BYTES, move it to .old
    if let Ok(meta) = fs::metadata(&log_file) {
        if meta.len() > MAX_LOG_BYTES {
            let old_log = log_dir.join("tauri.log.old");
            let _ = fs::rename(&log_file, &old_log);
        }
    }

    if let Ok(file) = fs::OpenOptions::new().create(true).append(true).open(log_file) {
        let subscriber = fmt::Subscriber::builder()
            .with_env_filter(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
            .with_writer(std::sync::Arc::new(file))
            .with_ansi(false)
            .finish();
        
        let _ = tracing::subscriber::set_global_default(subscriber);
    }
}
