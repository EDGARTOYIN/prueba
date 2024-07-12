use windows::core::HSTRING;
use windows::Devices::WiFi::{
    WiFiAdapter, WiFiAvailableNetwork, WiFiConnectionResult, WiFiConnectionStatus,
    WiFiNetworkReport, WiFiReconnectionKind,
};
use windows::Foundation::Collections::IVectorView;
use windows::Foundation::IAsyncOperation;
use windows::Security::Credentials::PasswordCredential;

async fn get_wifi_adapters() -> Result<IVectorView<WiFiAdapter>, String> {
    let operation = WiFiAdapter::FindAllAdaptersAsync().map_err(|e| e.to_string())?;
    let adapters: IVectorView<WiFiAdapter> = operation.await.map_err(|e| e.to_string())?;
    Ok(adapters)
}

fn get_first_adapter(adapters: IVectorView<WiFiAdapter>) -> Result<WiFiAdapter, String> {
    if adapters.Size().expect("Error") == 0 {
        return Err("No se encontraron adaptadores de red disponibles".to_string());
    }
    let first_adapter = adapters.GetAt(0).map_err(|e| e.to_string())?;
    Ok(first_adapter)
}

async fn get_networks(adapter: WiFiAdapter) -> Result<IVectorView<WiFiAvailableNetwork>, String> {
    let report: WiFiNetworkReport = adapter.NetworkReport().map_err(|e| e.to_string())?;
    let networks: IVectorView<WiFiAvailableNetwork> =
        report.AvailableNetworks().map_err(|e| e.to_string())?;
    Ok(networks)
}

fn find_network(
    networks: IVectorView<WiFiAvailableNetwork>,
    desired_ssid: &str,
) -> Result<Option<WiFiAvailableNetwork>, String> {
    let mut desired_network = None;
    for i in 0..networks.Size().map_err(|e| e.to_string())? {
        let network = networks.GetAt(i).map_err(|e| e.to_string())?;
        let ssid = network.Ssid().map_err(|e| e.to_string())?;
        if ssid == desired_ssid {
            desired_network = Some(network.clone()); // Clone the network before returning it
            break;
        }
    }
    Ok(desired_network)
}

async fn connect_to_network(
    window: &tauri::Window,
    adapter: WiFiAdapter,
    network: WiFiAvailableNetwork,
    password_credential: PasswordCredential,
) -> Result<(), String> {
    // emit to window
    window.emit("wifi-event", "Tratando de iniciar con una conexión con la red").unwrap();

    let kind = WiFiReconnectionKind::Manual;

    let operation: IAsyncOperation<WiFiConnectionResult> = adapter
        .ConnectWithPasswordCredentialAsync(
            &network,
            kind,
            &password_credential, // Pass a reference to the PasswordCredential
        )
        .map_err(|e| e.to_string())?;

    let con_result: WiFiConnectionResult = operation.await.map_err(|e| e.to_string())?;
    let con_status: WiFiConnectionStatus =
        con_result.ConnectionStatus().map_err(|e| e.to_string())?;

    match con_status.0 {
        1 => {
            Ok(())
        }
        2 => Err("Conexión a la red Revocada".to_string()),
        3 => Err("Credenciales invalidas".to_string()),
        4 => Err("Conexión fallo porque la red no esta disponible".to_string()),
        5 => Err("Conexión fallo porque se acabo el tiempo".to_string()),
        6 => Err("Conexión fallo porque el protocolo de autenticación no es valido".to_string()),
        0 => Err("Conexión fallo motivo sin especificar".to_string()),
        _ => Err("Valor desconocido".to_string()),
    }
}

async fn disconnect_from_network(adapter: WiFiAdapter) -> Result<(), String> {
    // println!("Desconectandose de la red");
    adapter.Disconnect().map_err(|e| e.to_string())?;
    Ok(())
}

async fn start_connection_procces(window: &tauri::Window, ssid: String, pass: String) -> Result<String, String> {
    let adapters: IVectorView<WiFiAdapter> = get_wifi_adapters().await?;
    let first_adapter = get_first_adapter(adapters)?;
    let networks = get_networks(first_adapter.clone()).await?;

    let desired_ssid = &ssid;
    let password_credential = PasswordCredential::new().map_err(|e| e.to_string())?;
    let pass = HSTRING::from(&pass);
    password_credential
        .SetPassword(&pass)
        .map_err(|e| e.to_string())?;

    match find_network(networks, desired_ssid) {
        Ok(Some(network)) => {
            // println!("Found network with SSID: {}", desired_ssid);
            window.emit("wifi-event", format!("Se encontro la red {}", desired_ssid)).unwrap();
            connect_to_network(&window, first_adapter.clone(), network, password_credential.clone()).await?;
            disconnect_from_network(first_adapter).await?;
            Ok("Se conecto y desconecto de la red de forma exitosa".to_string())
        }
        Ok(None) => Err(format!("No encontro la red objetivo {}", desired_ssid)),
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn test_connection(window: tauri::Window, ssid: String, pass: String) -> Result<String, String> {
    window.emit("wifi-event", "Iniciando prueba de WIFI").unwrap();
    // Call another async function and wait for it to finish
    match start_connection_procces(&window, ssid, pass).await {
        Ok(v) => Ok(format!("{v}")),
        Err(e) => Err(format!("{e}")),
    }
}
