use rusqlite::{Connection, Result, params};
use chrono::{Utc, Duration};
use tracing::info;

pub fn prune_old_time_entries(conn: &Connection, retention_months: i64) -> Result<usize> {
    if retention_months <= 0 {
        return Ok(0);
    }

    let cutoff = Utc::now() - Duration::days(retention_months * 30);
    let cutoff_str = cutoff.to_rfc3339();

    let deleted = conn.execute(
        "DELETE FROM time_entries WHERE start_time < ?1",
        params![cutoff_str],
    )?;

    if deleted > 0 {
        info!("Pruned {} time entries older than {} months", deleted, retention_months);
    }

    Ok(deleted)
}
