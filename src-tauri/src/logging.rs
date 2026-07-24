use std::fs;
use std::path::PathBuf;
use tracing_subscriber::{fmt, EnvFilter};

pub fn init_logging() {
    let mut log_dir = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    log_dir.push("Shodasha");
    log_dir.push("logs");
    fs::create_dir_all(&log_dir).ok();

    let log_file = log_dir.join("tauri.log");

    if let Ok(file) = fs::OpenOptions::new().create(true).append(true).open(log_file) {
        let subscriber = fmt::Subscriber::builder()
            .with_env_filter(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
            .with_writer(std::sync::Arc::new(file))
            .with_ansi(false)
            .finish();
        
        let _ = tracing::subscriber::set_global_default(subscriber);
    }
}
