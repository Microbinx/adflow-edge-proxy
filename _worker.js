<?php
// Safe emergency-proof config-delivery.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$config_path = __DIR__ . '/../config.php';
if (!file_exists($config_path)) {
    echo json_encode(['consent_toggle' => 'off', 'placements' => []]);
    exit;
}

$config = require $config_path;

try {
    $host = $config['DB_HOST'] ?? 'localhost';
    $dbname = $config['DB_NAME'] ?? '';
    $user = $config['DB_USER'] ?? '';
    $pass = $config['DB_PASS'] ?? '';

    $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    $consent_setting = 'off';
    try {
        $stmt = $pdo->prepare("SELECT setting_value FROM adflow_settings WHERE setting_key = 'consent_toggle'");
        $stmt->execute();
        $consent_setting = $stmt->fetchColumn() ?: 'off';
    } catch (\Exception $e) {
        // Fallback if table doesn't exist
    }

    $manifest = [];
    try {
        $rows = $pdo->query("SELECT id, provider, ad_type, ad_slot, script_payload FROM adflow_inventory ORDER BY id DESC")->fetchAll();
        foreach ($rows as $row) {
            $rawPayload = stripslashes($row['script_payload'] ?? '');
            $rawPayload = str_replace(['&quot;', '&#039;', '&#39;'], ['"', "'", "'"], $rawPayload);
            
            $providerKey = strtolower(trim($row['provider'] ?? ''));
            $adType      = strtolower(trim($row['ad_type'] ?? ''));
            $cleanSlot   = strtolower(trim($row['ad_slot'] ?? ''));

            $manifest[] = [
                'name'            => ucfirst($providerKey) . ' - ' . ucfirst($adType),
                'proxyFolder'     => $providerKey, 
                'raw_payload'     => $rawPayload,
                'targetElementId' => in_array($adType, ['popunder', 'socialbar', 'video'], true) ? 'body' : 'ad-slot-' . $cleanSlot
            ];
        }
    } catch (\Exception $e) {
        // Fallback if inventory table doesn't exist
    }

    echo json_encode([
        'consent_toggle' => $consent_setting,
        'placements'     => $manifest
    ], JSON_UNESCAPED_SLASHES);

} catch (\Exception $e) {
    // Graceful fallback on database connection failure
    echo json_encode([
        'consent_toggle' => 'off', 
        'placements'     => []
    ]);
}
