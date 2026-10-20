<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\ResumeLead;
use App\Models\ActivityLog;

class ContactController extends Controller
{
    /**
     * Send contact/inquiry email.
     * Uses PHP mail() with envelope sender for cPanel/LiteSpeed hosting,
     * with fallback to Laravel Mail facade and optional lead recording.
     */
    public function send(Request $request)
    {
        // 1. Honeypot spam check (botcheck)
        if (!empty($request->input('botcheck'))) {
            // Silently return success to fool spam bots
            return response()->json([
                'success' => true,
                'message' => 'Your inquiry has been received.'
            ], 200);
        }

        // 2. Validate input
        $validated = $request->validate([
            'name'     => 'nullable|string|max:120',
            'email'    => 'required|email|max:160',
            'message'  => 'nullable|string|max:8000',
            'subject'  => 'nullable|string|max:200',
            'phone'    => 'nullable|string|max:50',
            'type'     => 'nullable|string|max:50', // 'general', 'newsletter', 'partnership', 'support'
        ]);

        $name    = trim($validated['name'] ?? 'ATSense Visitor');
        $email   = trim($validated['email']);
        $message = trim($validated['message'] ?? '');
        $subject = trim($validated['subject'] ?? '');
        $phone   = trim($validated['phone'] ?? '');
        $type    = trim($validated['type'] ?? 'general');

        // Prevent header injection: strip newlines from header fields
        $cleanName    = str_replace(["\r", "\n"], '', $name);
        $cleanEmail   = str_replace(["\r", "\n"], '', $email);
        $cleanSubject = str_replace(["\r", "\n"], '', $subject);

        // Determine destination and sender email addresses
        $toEmail   = env('CONTACT_MAIL_TO', env('MAIL_FROM_ADDRESS', 'support@atsense.online'));
        $fromEmail = env('MAIL_FROM_ADDRESS', 'support@atsense.online');
        $fromName  = env('MAIL_FROM_NAME', 'ATSense Platform');

        if ($type === 'newsletter') {
            $mailSubject = "New Newsletter Subscriber: {$cleanEmail}";
            $headline    = "New Newsletter Subscription";
        } elseif ($cleanSubject) {
            $mailSubject = "[ATSense Inquiry] {$cleanSubject} - {$cleanName}";
            $headline    = "New Inquiry: " . htmlspecialchars($cleanSubject, ENT_QUOTES, 'UTF-8');
        } else {
            $mailSubject = "[ATSense Inquiry] Message from {$cleanName}";
            $headline    = "New Platform Inquiry";
        }

        // Client IP & timestamp
        $clientIp = $request->header('CF-Connecting-IP')
            ?: $request->header('X-Forwarded-For')
            ?: $request->ip()
            ?: 'unknown';
        $clientIp = trim(explode(',', $clientIp)[0]);
        $timestamp = date('Y-m-d H:i:s \U\T\C');

        // Safe HTML-escaped content
        $safeName    = htmlspecialchars($cleanName, ENT_QUOTES, 'UTF-8');
        $safeEmail   = htmlspecialchars($cleanEmail, ENT_QUOTES, 'UTF-8');
        $safePhone   = htmlspecialchars($phone ?: 'Not provided', ENT_QUOTES, 'UTF-8');
        $safeType    = htmlspecialchars(ucfirst($type), ENT_QUOTES, 'UTF-8');
        $safeMessage = nl2br(htmlspecialchars($message ?: '(No message content provided)', ENT_QUOTES, 'UTF-8'));

        // 3. Build ATSense Branded Responsive HTML Email
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

        // 4. Construct Headers
        $headers = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: text/html; charset=UTF-8';
        $headers[] = 'From: ' . $fromName . ' <' . $fromEmail . '>';
        $headers[] = 'Reply-To: ' . $cleanName . ' <' . $cleanEmail . '>';
        $headers[] = 'X-Mailer: PHP/' . phpversion() . ' (ATSense)';

        $sent = false;

        // 5. Primary Sending Mechanism: PHP native mail() function with envelope sender
        // This is the fastest, most reliable method on LiteSpeed / cPanel Exim
        try {
            $additionalParams = '-f ' . escapeshellarg($fromEmail);
            $sent = @mail($toEmail, $mailSubject, $body, implode("\r\n", $headers), $additionalParams);

            if (!$sent) {
                // Retry without additional parameter if host restricts extra arguments
                $sent = @mail($toEmail, $mailSubject, $body, implode("\r\n", $headers));
            }
        } catch (\Throwable $e) {
            Log::warning('Native mail() dispatch threw exception: ' . $e->getMessage());
        }

        // Fallback: If native mail returned false and Laravel mailer is configured (e.g. SMTP)
        if (!$sent && config('mail.default') !== 'log') {
            try {
                Mail::html($body, function ($msg) use ($toEmail, $mailSubject, $fromEmail, $fromName, $cleanEmail, $cleanName) {
                    $msg->to($toEmail)
                        ->from($fromEmail, $fromName)
                        ->replyTo($cleanEmail, $cleanName)
                        ->subject($mailSubject);
                });
                $sent = true;
            } catch (\Throwable $e) {
                Log::error('Laravel Mail fallback failed: ' . $e->getMessage());
            }
        }

        // 6. Record inquiry into Database (ResumeLead + ActivityLog)
        try {
            ResumeLead::create([
                'name'    => $cleanName,
                'email'   => $cleanEmail,
                'phone'   => $phone,
                'source'  => $type === 'newsletter' ? 'newsletter_subscriber' : 'contact_inquiry',
                'notes'   => ($subject ? "[Subject: {$subject}] " : "") . $message,
                'status'  => 'new',
            ]);

            ActivityLog::record(
                'CONTACT_INQUIRY',
                "Inquiry received from '{$cleanName}' ({$cleanEmail}) [Type: {$type}].",
                'info',
                ['email' => $cleanEmail, 'type' => $type, 'sent_email' => $sent],
                $request
            );
        } catch (\Throwable $e) {
            // Non-blocking: DB downtime should never crash email inquiry
            Log::info('Lead record skipped: ' . $e->getMessage());
        }

        // 7. Response
        if ($sent) {
            return response()->json([
                'success' => true,
                'message' => 'Thank you for contacting us! The ATSense team will respond within 24 hours.'
            ], 200);
        }

        // In local development or environments without sendmail/exim configured,
        // we still log the success since the message was recorded safely.
        if (app()->environment('local', 'testing')) {
            Log::info("[Local Contact Inquiry Captured] To: {$toEmail}, Subject: {$mailSubject}, From: {$cleanEmail}");
            return response()->json([
                'success' => true,
                'message' => 'Thank you for contacting us! The ATSense team will respond within 24 hours.'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unable to send your message right now. Please email us directly at support@atsense.online.'
        ], 502);
    }
}
