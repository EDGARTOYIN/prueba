// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use windows::core::HSTRING;
use windows::Devices::WiFi::{
    WiFiAdapter, WiFiAvailableNetwork, WiFiConnectionResult, WiFiConnectionStatus,
    WiFiNetworkReport, WiFiReconnectionKind,
};
use windows::Foundation::Collections::IVectorView;
use windows::Foundation::IAsyncOperation;
use windows::Security::Credentials::PasswordCredential;



fn find_network_index(
    networks: &IVectorView<WiFiAvailableNetwork>,
    desired_ssid: &str,
) -> Result<u32, String> {
    for i in 0..networks.Size().map_err(|e| e.to_string())? {
        let network = networks.GetAt(i).map_err(|e| e.to_string())?;
        let ssid = network.Ssid().map_err(|e| e.to_string())?;
        if ssid == desired_ssid {
            return Ok(i);
        }
    }
    Err("The network SSID was not found".to_string())
}

async fn connect_to_network(window: tauri::Window, ssid: String, pass: String) -> Result<String, String> {
    // Suponiendo que FindAllAdaptersAsync retorna un Result con un tipo específico, por ejemplo, Vec<WiFiAdapter>
    let operation: IAsyncOperation<IVectorView<WiFiAdapter>> =
        WiFiAdapter::FindAllAdaptersAsync().map_err(|e| e.to_string())?;

    window.emit("wifi-event", "getting network adapters").unwrap();
    // Convert the IAsyncOperation into a Rust future and await it
    let adapters = operation.get().map_err(|e| e.to_string())?;

    let size = adapters.Size().map_err(|e| e.to_string())?;

    window.emit("wifi-event", format!("network adapters: {}", size)).unwrap();

    if size >= 1 {
        // Get the main wifi adapter, or the first one
        let main_adapter = adapters.GetAt(0).map_err(|e| e.to_string())?;

        // Get the networks that is currently detecting
        let report: WiFiNetworkReport = main_adapter.NetworkReport().map_err(|e| e.to_string())?;
        let networks: IVectorView<WiFiAvailableNetwork> =
            report.AvailableNetworks().map_err(|e| e.to_string())?;

        //Create Credentials to a network
        let desired_ssid = ssid;
        let password_credential = PasswordCredential::new().map_err(|e| e.to_string())?;
        let pass = HSTRING::from(pass);
        password_credential
            .SetPassword(&pass)
            .map_err(|e| e.to_string())?;

        // Find and get the desired network
        let index = find_network_index(&networks, &desired_ssid)?;
        let desired_network = networks.GetAt(index).map_err(|e| e.to_string())?;

        //Connect to the desired network
        let kind = WiFiReconnectionKind::Manual;

        let operation: IAsyncOperation<WiFiConnectionResult> = main_adapter.ConnectWithPasswordCredentialAsync(
            &desired_network,
            kind,
            &password_credential, // Pass a reference to the PasswordCredential
        ).map_err(|e| e.to_string())?;

        let con_result: WiFiConnectionResult = operation.get().map_err(|e| e.to_string())?;
        let con_status: WiFiConnectionStatus = con_result.ConnectionStatus().map_err(|e| e.to_string())?;
        match con_status.0 {
            1 => {     
                // main_adapter.Disconnect().map_err(|e: windows::core::Error| e.to_string())?;
                Ok("Connected".to_string())},
            _ => Err("Something wrong".to_string()),
        }
    } else {
        Err("there are no network adapters to make a conections".to_string())
    }
}

#[tauri::command]
async fn test_conn(window: tauri::Window, ssid: String, pass: String) -> Result<String, String> {
    window.emit("wifi-event", "Iniciando prueba de WIFI").unwrap();
    // Call another async function and wait for it to finish
    match connect_to_network(window, ssid, pass).await {
        Ok(v) => Ok(format!("{v}")),
        Err(e) => Err(format!("{e}")),
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, test_conn])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
