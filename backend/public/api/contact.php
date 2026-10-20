<?php
/**
 * ATSense - Production Contact & Inquiry Email Handler
 * Hosted on LiteSpeed / Apache / cPanel / Nginx with PHP-FPM.
 * Relays inquiries, support requests, and subscriptions to support@atsense.online.
 */

// Set response headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed'
    ]);
    exit;
}

// Parse request payload (JSON or form-data)
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!is_array($input)) {
    $input = $_POST;
}

// 1. Honeypot check (botcheck)
if (!empty($input['botcheck'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Your inquiry has been received.'
    ]);
    exit;
}

// 2. Client IP detection
$clientIp = $_SERVER['HTTP_CF_CONNECTING_IP']
    ?? $_SERVER['HTTP_X_FORWARDED_FOR']
    ?? $_SERVER['REMOTE_ADDR']
    ?? 'unknown';
$clientIp = explode(',', $clientIp)[0];
$clientIp = trim($clientIp);

// 3. Basic IP rate limiting (max 10 requests per 10 minutes)
$rateLimitDir = sys_get_temp_dir() . '/atsense_ratelimits';
if (!is_dir($rateLimitDir)) {
    @mkdir($rateLimitDir, 0755, true);
}
$rateFile = $rateLimitDir . '/ip_' . md5($clientIp) . '.json';
$rateData = ['count' => 0, 'first_request' => time()];
if (file_exists($rateFile)) {
    $loaded = json_decode(@file_get_contents($rateFile), true);
    if (is_array($loaded)) {
        $rateData = $loaded;
    }
}

if (time() - $rateData['first_request'] > 600) {
    $rateData = ['count' => 1, 'first_request' => time()];
} else {
    $rateData['count']++;
}
@file_put_contents($rateFile, json_encode($rateData));

if ($rateData['count'] > 10) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Too many requests. Please wait a few minutes before submitting again.'
    ]);
    exit;
}

// 4. Validate & sanitize inputs
$name    = trim($input['name'] ?? '');
$email   = trim($input['email'] ?? '');
$message = trim($input['message'] ?? '');
$subject = trim($input['subject'] ?? '');
$phone   = trim($input['phone'] ?? '');
$type    = trim($input['type'] ?? 'general');

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide a valid email address.'
    ]);
    exit;
}

if ($type !== 'newsletter' && $message === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please include a message description.'
    ]);
    exit;
}

// Prevent header injection: strip newlines from header fields
$cleanName    = str_replace(["\r", "\n"], '', $name ?: 'ATSense Visitor');
$cleanEmail   = str_replace(["\r", "\n"], '', $email);
$cleanSubject = str_replace(["\r", "\n"], '', $subject);

// Destination and sender
$toEmail   = 'support@atsense.online';
$fromEmail = 'support@atsense.online';
$fromName  = 'ATSense Platform';

if ($type === 'newsletter') {
    $mailSubject = "New Newsletter Subscriber: {$cleanEmail}";
    $headline    = "New Newsletter Subscription";
} elseif ($cleanSubject !== '') {
    $mailSubject = "[ATSense Inquiry] {$cleanSubject} - {$cleanName}";
    $headline    = "New Inquiry: " . htmlspecialchars($cleanSubject, ENT_QUOTES, 'UTF-8');
} else {
    $mailSubject = "[ATSense Inquiry] Message from {$cleanName}";
    $headline    = "New Platform Inquiry";
}

$timestamp   = date('Y-m-d H:i:s \U\T\C');
$safeName    = htmlspecialchars($cleanName, ENT_QUOTES, 'UTF-8');
$safeEmail   = htmlspecialchars($cleanEmail, ENT_QUOTES, 'UTF-8');
$safePhone   = htmlspecialchars($phone ?: 'Not provided', ENT_QUOTES, 'UTF-8');
$safeType    = htmlspecialchars(ucfirst($type), ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message ?: '(No message content provided)', ENT_QUOTES, 'UTF-8'));

// 5. Responsive Branded HTML Email Template
$body = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{$headline}</title>
</head>
<body style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#0f172a; color:#f8fafc; margin:0; padding:32px 16px; line-height:1.6;">
  <div style="max-width:600px; margin:0 auto; background-color:#1e293b; border:1px solid #334155; border-radius:16px; overflow:hidden; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%); padding:28px 24px; text-align:left;">
      <h1 style="margin:0; font-size:22px; font-weight:800; color:#ffffff; letter-spacing:-0.5px;">
        ATSense &bull; {$headline}
      </h1>
      <p style="margin:6px 0 0; color:#e0e7ff; font-size:13px; font-weight:500;">
        Received at {$timestamp}
      </p>
    </div>

    <!-- Metadata Table -->
    <div style="padding:24px;">
      <table cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px;">
        <tr>
          <td style="padding:10px 12px; color:#94a3b8; font-weight:600; width:120px; border-bottom:1px solid #334155;">Sender</td>
          <td style="padding:10px 12px; color:#f8fafc; font-weight:700; border-bottom:1px solid #334155;">{$safeName}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px; color:#94a3b8; font-weight:600; border-bottom:1px solid #334155;">Email</td>
          <td style="padding:10px 12px; border-bottom:1px solid #334155;">
            <a href="mailto:{$safeEmail}" style="color:#38bdf8; text-decoration:none; font-weight:600;">{$safeEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; color:#94a3b8; font-weight:600; border-bottom:1px solid #334155;">Phone</td>
          <td style="padding:10px 12px; color:#f8fafc; border-bottom:1px solid #334155;">{$safePhone}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px; color:#94a3b8; font-weight:600; border-bottom:1px solid #334155;">Category</td>
          <td style="padding:10px 12px; color:#cbd5e1; border-bottom:1px solid #334155;">
            <span style="background-color:#312e81; color:#c7d2fe; padding:2px 8px; border-radius:6px; font-size:12px; font-weight:700; text-transform:uppercase;">{$safeType}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; color:#94a3b8; font-weight:600; border-bottom:1px solid #334155;">Client IP</td>
          <td style="padding:10px 12px; color:#94a3b8; font-family:monospace; font-size:12px; border-bottom:1px solid #334155;">{$clientIp}</td>
        </tr>
      </table>

      <!-- Message Content -->
      <div style="margin-top:20px;">
        <h2 style="font-size:13px; text-transform:uppercase; letter-spacing:0.05em; color:#94a3b8; margin:0 0 10px;">Message Description</h2>
        <div style="background-color:#0f172a; border:1px solid #334155; border-radius:12px; padding:18px; color:#f1f5f9; font-size:14px; line-height:1.7;">
          {$safeMessage}
        </div>
      </div>

      <!-- Quick Reply Action -->
      <div style="margin-top:24px; text-align:center;">
        <a href="mailto:{$safeEmail}?subject=Re:%20{$mailSubject}" style="display:inline-block; background:linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color:#ffffff; text-decoration:none; font-weight:700; font-size:13px; padding:12px 24px; border-radius:8px; box-shadow:0 4px 12px rgba(79,70,229,0.3);">
          Reply to {$safeName}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color:#0f172a; border-top:1px solid #334155; padding:16px 24px; text-align:center; font-size:12px; color:#64748b;">
      Sent securely via ATSense Platform &bull; <a href="https://atsense.online" style="color:#94a3b8; text-decoration:none;">atsense.online</a>
    </div>

  </div>
</body>
</html>
HTML;

// 6. Headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'From: ' . $fromName . ' <' . $fromEmail . '>';
$headers[] = 'Reply-To: ' . $cleanName . ' <' . $cleanEmail . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion() . ' (ATSense)';

// 7. Send email via PHP native mail() with envelope sender (-f)
$additionalParams = '-f ' . escapeshellarg($fromEmail);
$sent = @mail($toEmail, $mailSubject, $body, implode("\r\n", $headers), $additionalParams);

if (!$sent) {
    // Retry without additional parameter in case host restricts extra arguments
    $sent = @mail($toEmail, $mailSubject, $body, implode("\r\n", $headers));
}

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for reaching out! The ATSense team will respond within 24 hours.'
    ]);
} else {
    error_log("[ATSense Contact] mail() failed for inquiry from: " . $cleanName . " <" . $cleanEmail . ">");
    
    $isLocal = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'])
        || (isset($_SERVER['HTTP_HOST']) && str_contains($_SERVER['HTTP_HOST'], 'localhost'));

    if ($isLocal) {
        echo json_encode([
            'success' => true,
            'message' => '[Dev Mode] Inquiry simulated successfully. In production, this delivers via host mail().'
        ]);
    } else {
        http_response_code(502);
        echo json_encode([
            'success' => false,
            'message' => 'Unable to send message automatically. Please contact us directly at support@atsense.online.'
        ]);
    }
}
