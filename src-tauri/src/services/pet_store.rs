use std::path::PathBuf;
use std::fs;
use std::io::{Read, Cursor};

const CATALOG_URL: &str = "https://openpets.dev/pets/catalog.v3.json";
const MAX_PAGES: usize = 3;

/// A single pet entry from a catalog page
#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
pub struct CatalogEntry {
    pub id: String,
    #[serde(rename = "displayName")]
    pub display_name: String,
    pub description: String,
    pub thumbnail: String,
    pub spritesheet: String,
    pub zip: String,
    pub category: Option<String>,
    pub subcategory: Option<String>,
    pub featured: Option<bool>,
}

/// Root catalog — points to paginated page files
#[derive(serde::Deserialize, Debug)]
struct CatalogRoot {
    pub version: u32,
    pub pages: Vec<String>,
}

/// A single page of the catalog
#[derive(serde::Deserialize, Debug)]
struct CatalogPage {
    pub version: u32,
    pub page: u32,
    #[serde(rename = "pageSize")]
    pub page_size: u32,
    pub pets: Vec<CatalogEntry>,
}

/// Installed pet metadata (from local filesystem)
#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
pub struct PetMeta {
    pub id: String,
    pub display_name: String,
    pub description: String,
    pub spritesheet_path: String,
    pub preview_path: Option<String>,
}

/// Returns the Shodasha pet store directory: %APPDATA%/Shodasha/pets
pub fn store_dir() -> PathBuf {
    let base = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    base.join("Shodasha").join("pets")
}

/// Returns the OpenPets pet directory (for compatibility): %APPDATA%/OpenPets/pets
pub fn openpets_pets_dir() -> PathBuf {
    let base = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    base.join("OpenPets").join("pets")
}

/// Fetch pet catalog — root JSON is paginated, so we fetch root + first N pages
pub fn fetch_catalog() -> Result<Vec<CatalogEntry>, String> {
    // 1. Fetch root catalog
    let root_body = http_get(CATALOG_URL, 500_000)?;
    let root: CatalogRoot = serde_json::from_slice(&root_body)
        .map_err(|e| format!("Failed to parse catalog root: {}", e))?;

    if root.pages.is_empty() {
        return Err("Catalog has no pages".to_string());
    }

    // 2. Fetch first N pages
    let mut all_pets: Vec<CatalogEntry> = Vec::new();
    let page_count = root.pages.len().min(MAX_PAGES);

    for i in 0..page_count {
        let page_url = &root.pages[i];
        match fetch_page(page_url) {
            Ok(pets) => all_pets.extend(pets),
            Err(e) => eprintln!("Warning: failed to fetch catalog page {}: {}", i, e),
        }
    }

    Ok(all_pets)
}

fn fetch_page(url: &str) -> Result<Vec<CatalogEntry>, String> {
    let body = http_get(url, 1_000_000)?;
    let page: CatalogPage = serde_json::from_slice(&body)
        .map_err(|e| format!("Failed to parse catalog page: {}", e))?;
    Ok(page.pets)
}

fn http_get(url: &str, max_bytes: u64) -> Result<Vec<u8>, String> {
    let resp = ureq::get(url)
        .call()
        .map_err(|e| format!("HTTP GET failed ({}): {}", url, e))?;

    let mut body = Vec::new();
    resp.into_body()
        .into_reader()
        .take(max_bytes)
        .read_to_end(&mut body)
        .map_err(|e| format!("Failed to read response ({}): {}", url, e))?;

    Ok(body)
}

/// Find a pet entry in the catalog by ID
pub fn find_in_catalog(pets: &[CatalogEntry], pet_id: &str) -> Option<CatalogEntry> {
    pets.iter().find(|p| p.id == pet_id).cloned()
}

/// Download a pet ZIP and extract it to the store directory
pub fn download_and_extract(pet_entry: &CatalogEntry) -> Result<PetMeta, String> {
    let dest = store_dir().join(&pet_entry.id);
    fs::create_dir_all(&dest).map_err(|e| format!("Failed to create pet dir: {}", e))?;

    // Download ZIP
    let resp = ureq::get(&pet_entry.zip)
        .call()
        .map_err(|e| format!("Failed to download pet ZIP ({}): {}", pet_entry.zip, e))?;

    let mut zip_bytes = Vec::new();
    resp.into_body()
        .into_reader()
        .take(50_000_000)
        .read_to_end(&mut zip_bytes)
        .map_err(|e| format!("Failed to read pet ZIP: {}", e))?;

    let cursor = Cursor::new(zip_bytes);
    let mut archive = zip::ZipArchive::new(cursor)
        .map_err(|e| format!("Failed to open ZIP: {}", e))?;

    let total = archive.len();
    if total == 0 || total > 500 {
        return Err(format!("Invalid ZIP: {} files", total));
    }

    let mut spritesheet_path = None;
    let mut preview_path = None;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)
            .map_err(|e| format!("ZIP entry {} error: {}", i, e))?;

        let out_name = file.name().to_string();
        let clean_name = out_name.replace('\\', "/");
        let basename = clean_name.split('/').last().unwrap_or(&clean_name);
        if basename.is_empty() || basename.contains("..") {
            continue;
        }

        let out_path = dest.join(basename);

        let lower = basename.to_lowercase();
        if !(lower.ends_with(".json") || lower.ends_with(".webp") || lower.ends_with(".png")) {
            continue;
        }

        let mut data = Vec::new();
        file.read_to_end(&mut data)
            .map_err(|e| format!("Failed to read entry {}: {}", basename, e))?;

        if data.len() > 100_000_000 {
            return Err(format!("File too large: {}", basename));
        }

        fs::write(&out_path, &data)
            .map_err(|e| format!("Failed to write {}: {}", basename, e))?;

        if lower == "spritesheet.webp" {
            spritesheet_path = Some(out_path.to_string_lossy().to_string());
        } else if lower == "preview.webp" || lower == "preview.png" {
            preview_path = Some(out_path.to_string_lossy().to_string());
        }
    }

    let sprite = spritesheet_path
        .ok_or_else(|| "Pet ZIP has no spritesheet.webp".to_string())?;

    Ok(PetMeta {
        id: pet_entry.id.clone(),
        display_name: pet_entry.display_name.clone(),
        description: pet_entry.description.clone(),
        spritesheet_path: sprite,
        preview_path,
    })
}

/// List locally installed pets (from Shodasha's own store)
pub fn list_installed() -> Result<Vec<PetMeta>, String> {
    let dir = store_dir();
    if !dir.exists() {
        return Ok(vec![]);
    }

    let mut pets = Vec::new();
    let entries = fs::read_dir(&dir).map_err(|e| format!("Failed to read pet dir: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let path = entry.path();
        if !path.is_dir() { continue; }

        let pet_id = path.file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("")
            .to_string();

        let meta_path = path.join("pet.json");
        let sprite_path = path.join("spritesheet.webp");
        let preview_path = path.join("preview.webp");

        if !sprite_path.exists() { continue; }

        let (display_name, description) = if meta_path.exists() {
            let content = fs::read_to_string(&meta_path).unwrap_or_default();
            parse_pet_json(&content, &pet_id)
        } else {
            (pet_id.clone(), String::new())
        };

        pets.push(PetMeta {
            id: pet_id,
            display_name,
            description,
            spritesheet_path: sprite_path.to_string_lossy().to_string(),
            preview_path: if preview_path.exists() {
                Some(preview_path.to_string_lossy().to_string())
            } else { None },
        });
    }

    Ok(pets)
}

fn parse_pet_json(content: &str, fallback_id: &str) -> (String, String) {
    if let Ok(val) = serde_json::from_str::<serde_json::Value>(content) {
        let name = val.get("displayName")
            .or_else(|| val.get("name"))
            .and_then(|v| v.as_str())
            .unwrap_or(fallback_id)
            .to_string();
        let desc = val.get("description")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string();
        (name, desc)
    } else {
        (fallback_id.to_string(), String::new())
    }
}
