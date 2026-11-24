<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
use Illuminate\Support\Facades\Log;

class PHPMailerService
{
    /**
     * Create and configure a new PHPMailer instance.
     */
    public function createMailer(bool $exceptions = true): PHPMailer
    {
        $mail = new PHPMailer($exceptions);
        $mail->CharSet = 'UTF-8';

        $driver = env('MAIL_MAILER', 'smtp');
        $host   = env('MAIL_HOST', '');
        $user   = env('MAIL_USERNAME', '');
        $pass   = env('MAIL_PASSWORD', '');
        $port   = (int) env('MAIL_PORT', 465);
        $enc    = strtolower((string) env('MAIL_ENCRYPTION', 'ssl'));

        if ($driver === 'smtp' && !empty($host)) {
            $mail->isSMTP();

            // Resolve host to IPv4 to prevent IPv6 connection timeouts
            $resolvedHost     = filter_var($host, FILTER_VALIDATE_IP) ? $host : gethostbyname($host);
            $mail->Host       = $resolvedHost ?: $host;
            $mail->Port       = $port;
            $mail->Timeout    = (int) env('MAIL_TIMEOUT', 15);

            $mail->SMTPOptions = [
                'ssl' => [
                    'verify_peer'       => false,
                    'verify_peer_name'  => false,
                    'allow_self_signed' => true,
                    'peer_name'         => $host,
                ],
            ];

            if (!empty($user) || !empty($pass)) {
                $mail->SMTPAuth = true;
                $mail->Username = $user;
                $mail->Password = $pass;
            } else {
                $mail->SMTPAuth = false;
            }

            if ($enc === 'ssl' || $port === 465) {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } elseif ($enc === 'tls' || $port === 587) {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            } else {
                $mail->SMTPSecure = '';
                $mail->SMTPAutoTLS = false;
            }
        } elseif ($driver === 'sendmail') {
            $mail->isSendmail();
        } else {
            $mail->isMail();
        }

        $fromAddress = env('MAIL_FROM_ADDRESS', 'support@atsense.online');
        $fromName    = env('MAIL_FROM_NAME', 'ATSense Platform');

        try {
            $mail->setFrom($fromAddress, $fromName);
        } catch (\Throwable $e) {
            Log::warning('PHPMailer setFrom error: ' . $e->getMessage());
        }

        return $mail;
    }

    /**
     * Send an email with HTML and plain-text fallback.
     */
    public function send($to, string $subject, string $htmlBody, string $altBody = '', array $options = []): array
    {
        $mail = $this->createMailer();

        try {
            if (!empty($options['debug'])) {
                $mail->SMTPDebug   = SMTP::DEBUG_SERVER;
                $mail->Debugoutput = function ($str, $level) {
                    Log::debug('[PHPMailer] ' . trim($str));
                };
            }

            if (!empty($options['fromEmail'])) {
                $fromName = $options['fromName'] ?? env('MAIL_FROM_NAME', 'ATSense');
                $mail->setFrom($options['fromEmail'], $fromName);
            }

            if (is_array($to)) {
                if (isset($to['email']) && filter_var($to['email'], FILTER_VALIDATE_EMAIL)) {
                    $mail->addAddress($to['email'], $to['name'] ?? '');
                } else {
                    foreach ($to as $recipient) {
                        if (is_array($recipient) && !empty($recipient['email'])) {
                            $mail->addAddress($recipient['email'], $recipient['name'] ?? '');
                        } elseif (is_string($recipient) && filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
                            $mail->addAddress($recipient);
                        }
                    }
                }
            } elseif (is_string($to) && filter_var($to, FILTER_VALIDATE_EMAIL)) {
                $mail->addAddress($to);
            } else {
                return ['success' => false, 'message' => 'No valid recipients specified.'];
            }

            if (!empty($options['replyTo']) && filter_var($options['replyTo'], FILTER_VALIDATE_EMAIL)) {
                $mail->addReplyTo($options['replyTo'], $options['replyToName'] ?? '');
            }

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            $mail->AltBody = $altBody ?: strip_tags($htmlBody);

            $mail->send();
            return ['success' => true, 'message' => 'Email sent successfully.'];

        } catch (Exception $e) {
            Log::error('PHPMailer Error: ' . $mail->ErrorInfo . ' | Exception: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Failed to send email.', 'error' => $mail->ErrorInfo];
        }
    }

    /**
     * Send Welcome & Nudge Email highlighting Deep Tailor as the primary feature.
     */
    public function sendWelcomeAndNudgeEmail(string $name, string $email): array
    {
        $safeName    = htmlspecialchars($name ?: 'there', ENT_QUOTES, 'UTF-8');
        $builderUrl  = 'https://atsense.online/builder';
        $graderUrl   = 'https://atsense.online/grader';
        $linkedinUrl = 'https://atsense.online/linkedin';

        $html = <<<HTML
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your resume is ready &mdash; Deep Tailor it to get hired faster</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#e2e8f0;line-height:1.6;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0f19;">
    <tr>
      <td align="center" style="padding:10px 0 30px;">

        <!-- Main Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#111827;border:1px solid #1f293d;border-radius:16px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.5);">

          <!-- Hero Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);padding:36px 32px 32px;text-align:left;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display:inline-block;background:rgba(0,0,0,0.25);color:#e0e7ff;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 10px;border-radius:20px;margin-bottom:12px;">
                      ATSENSE CAREER PLATFORM
                    </span>
                    <h1 style="margin:8px 0 6px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.02em;line-height:1.2;">
                      Your resume is ready! &#127881;
                    </h1>
                    <p style="margin:0;color:rgba(255,255,255,0.9);font-size:15px;line-height:1.4;">
                      Next Step: Use <strong>Deep Tailor</strong> to beat applicant tracking bots.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:32px 28px 24px;">

              <p style="margin:0 0 16px;color:#f1f5f9;font-size:16px;font-weight:600;">
                Hi {$safeName},
              </p>

              <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.65;">
                We have successfully parsed your resume into ATSense Career Studio. But here is the reality: <strong style="color:#ffffff;">over 75% of resumes are rejected by ATS bots</strong> before a recruiter ever reads them.
                <br /><br />
                Use our 3 free AI tools below to guarantee your resume passes every screener:
              </p>

              <!-- ============================================== -->
              <!-- FEATURE 1: DEEP TAILOR (FLAGSHIP CORE FEATURE) -->
              <!-- ============================================== -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border:2px solid #8b5cf6;border-radius:14px;margin-bottom:20px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Icon Column -->
                        <td width="48" valign="top" style="vertical-align:top;padding-right:16px;">
                          <table width="44" height="44" cellpadding="0" cellspacing="0" border="0" style="width:44px;height:44px;background:#7c3aed;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:10px;text-align:center;">
                            <tr>
                              <td align="center" valign="middle" style="font-size:22px;line-height:44px;text-align:center;vertical-align:middle;">
                                &#9889;
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- Text & Button Column -->
                        <td valign="top" style="vertical-align:top;">
                          <div style="margin:0 0 4px;">
                            <span style="display:inline-block;background:#8b5cf6;color:#ffffff;font-size:10px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;padding:2px 7px;border-radius:4px;margin-right:6px;vertical-align:middle;">
                              OUR MAIN FEATURE
                            </span>
                            <span style="color:#ffffff;font-size:17px;font-weight:800;vertical-align:middle;">
                              1. Deep Tailor to Any Job
                            </span>
                          </div>
                          <p style="margin:8px 0 16px;color:#cbd5e1;font-size:13.5px;line-height:1.6;">
                            Our flagship AI technology: paste any job description, and <strong>Deep Tailor</strong> rewrites your experience bullet points, injects exact role keywords, and mirrors qualification phrases to maximize your match score in one click.
                          </p>
                          <!-- Action Button -->
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background:#7c3aed;border-radius:8px;">
                                <a href="{$builderUrl}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-size:13.5px;font-weight:800;border-radius:8px;background:#7c3aed;background:linear-gradient(135deg,#7c3aed,#6366f1);letter-spacing:0.02em;">
                                  Launch Deep Tailor Now &rarr;
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ============================================== -->
              <!-- FEATURE 2: ATS SCORE GRADER                    -->
              <!-- ============================================== -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;margin-bottom:16px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Icon Column -->
                        <td width="48" valign="top" style="vertical-align:top;padding-right:16px;">
                          <table width="44" height="44" cellpadding="0" cellspacing="0" border="0" style="width:44px;height:44px;background:#059669;background:linear-gradient(135deg,#059669,#10b981);border-radius:10px;text-align:center;">
                            <tr>
                              <td align="center" valign="middle" style="font-size:22px;line-height:44px;text-align:center;vertical-align:middle;">
                                &#128202;
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- Text & Button Column -->
                        <td valign="top" style="vertical-align:top;">
                          <p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">
                            2. Check Your ATS Match Score
                          </p>
                          <p style="margin:0 0 14px;color:#94a3b8;font-size:13px;line-height:1.55;">
                            Get an instant breakdown showing exactly where your resume loses points: missing skill keywords, formatting risks, and readability score.
                          </p>
                          <!-- Action Button -->
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background:#059669;border-radius:8px;">
                                <a href="{$graderUrl}" style="display:inline-block;padding:9px 20px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;border-radius:8px;background:#059669;background:linear-gradient(135deg,#059669,#10b981);">
                                  Grade My Resume &rarr;
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ============================================== -->
              <!-- FEATURE 3: LINKEDIN PROFILE OPTIMIZER         -->
              <!-- ============================================== -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;margin-bottom:22px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Icon Column -->
                        <td width="48" valign="top" style="vertical-align:top;padding-right:16px;">
                          <table width="44" height="44" cellpadding="0" cellspacing="0" border="0" style="width:44px;height:44px;background:#2563eb;background:linear-gradient(135deg,#2563eb,#38bdf8);border-radius:10px;text-align:center;">
                            <tr>
                              <td align="center" valign="middle" style="font-size:22px;line-height:44px;text-align:center;vertical-align:middle;">
                                &#128188;
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- Text & Button Column -->
                        <td valign="top" style="vertical-align:top;">
                          <p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">
                            3. Optimize Your LinkedIn Profile
                          </p>
                          <p style="margin:0 0 14px;color:#94a3b8;font-size:13px;line-height:1.55;">
                            Headhunters search LinkedIn daily. Let AI rewrite your headline, about section, and experience to rank at the top of recruiter searches.
                          </p>
                          <!-- Action Button -->
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background:#2563eb;border-radius:8px;">
                                <a href="{$linkedinUrl}" style="display:inline-block;padding:9px 20px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;border-radius:8px;background:#2563eb;background:linear-gradient(135deg,#2563eb,#38bdf8);">
                                  Optimize LinkedIn &rarr;
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Pro Tip Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(139,92,246,0.08);border:1px dashed #8b5cf6;border-radius:10px;margin-bottom:20px;">
                <tr>
                  <td style="padding:14px 18px;color:#cbd5e1;font-size:13px;line-height:1.55;">
                    &#128161; <strong style="color:#ffffff;">Pro Tip:</strong> Tailor your resume separately for each role you apply to. Candidates who use <strong>Deep Tailor</strong> per job receive up to <strong style="color:#a78bfa;">3x more interviews</strong>.
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#64748b;margin:0;line-height:1.5;">
                All tools are 100% free &mdash; no credit card required. We want to see you land your dream role.
              </p>

            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="background-color:#0b0f19;border-top:1px solid #1e293b;padding:22px 28px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#64748b;">
                <a href="https://atsense.online" style="color:#818cf8;text-decoration:none;font-weight:700;">ATSense.online</a>
                &nbsp;&middot;&nbsp; The Intelligent Career Platform
              </p>
              <p style="margin:0;font-size:11px;color:#475569;line-height:1.5;">
                You received this email because you imported your resume on ATSense.<br />
                No spam or unsolicited promotional campaigns will ever be sent to this email.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Card Container -->

      </td>
    </tr>
  </table>

</body>
</html>
HTML;

        $altBody = "Hi {$safeName},\n\n"
            . "Your resume is parsed & ready in ATSense Career Studio!\n\n"
            . "Next Step: Use Deep Tailor to beat applicant tracking bots.\n\n"
            . "1. Deep Tailor to Any Job (OUR MAIN FEATURE):\n"
            . "Paste any job description and let AI tailor your resume, keywords, and bullet points to match the role:\n"
            . "{$builderUrl}\n\n"
            . "2. Check Your ATS Match Score:\n"
            . "Audit your resume for missing keywords and formatting traps:\n"
            . "{$graderUrl}\n\n"
            . "3. Optimize Your LinkedIn Profile:\n"
            . "Rewrite your headline and summary to attract recruiters:\n"
            . "{$linkedinUrl}\n\n"
            . "These tools are 100% free — no account required.\n\n"
            . "– The ATSense Team\nhttps://atsense.online";

        return $this->send(
            ['email' => $email, 'name' => $name],
            "Your resume is ready — Deep Tailor it to get hired faster 🚀",
            $html,
            $altBody
        );
    }

    /**
     * Drip Step 2 (Day 2): Pair your resume with an ATS-friendly Cover Letter.
     */
    public function sendCoverLetterNudgeEmail(string $name, string $email): array
    {
        $safeName = htmlspecialchars($name ?: 'there', ENT_QUOTES, 'UTF-8');
        $url      = 'https://atsense.online/cover-letters';

        $html = <<<HTML
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pair your resume with an AI Cover Letter</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0f19;">
    <tr>
      <td align="center" style="padding:10px 0 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#111827;border:1px solid #1f293d;border-radius:16px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.5);">
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:32px 28px;text-align:left;">
              <span style="display:inline-block;background:rgba(0,0,0,0.25);color:#e0e7ff;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 10px;border-radius:20px;margin-bottom:10px;">
                ATSENSE CAREER ACCELERATOR
              </span>
              <h1 style="margin:6px 0 0;color:#ffffff;font-size:24px;font-weight:800;line-height:1.2;">
                Applying today? Don't send a bare resume &#128196;
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 26px;">
              <p style="margin:0 0 14px;color:#f1f5f9;font-size:15px;font-weight:600;">
                Hi {$safeName},
              </p>
              <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;line-height:1.65;">
                Did you know that candidates who attach a <strong style="color:#ffffff;">tailored cover letter</strong> have a <strong style="color:#a78bfa;">40% higher callback rate</strong> with hiring managers?
                <br /><br />
                We built the <strong>ATSense AI Cover Letter Generator</strong> to take your parsed CV and job description and draft an executive-ready letter in 10 seconds flat &mdash; zero writer's block.
              </p>

              <!-- Action Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border:1px solid #312e81;border-radius:12px;margin-bottom:22px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">
                      Generate Your Targeted Cover Letter
                    </p>
                    <p style="margin:0 0 14px;color:#94a3b8;font-size:13px;line-height:1.5;">
                      Pulls your career achievements and weaves them into the job requirements seamlessly.
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#6366f1;border-radius:8px;">
                          <a href="{$url}" style="display:inline-block;padding:11px 24px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;border-radius:8px;background:#6366f1;background:linear-gradient(135deg,#6366f1,#8b5cf6);">
                            Create Free Cover Letter &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size:12px;color:#64748b;margin:0;">
                100% Free · No credit card required.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0b0f19;border-top:1px solid #1e293b;padding:18px 24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#475569;">
                <a href="https://atsense.online" style="color:#818cf8;text-decoration:none;">ATSense.online</a> &middot; The Intelligent Career Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

        $altBody = "Hi {$safeName},\n\n"
            . "Candidates who attach a tailored cover letter get up to 40% more interview callbacks.\n\n"
            . "Generate your targeted cover letter in 10 seconds based on your parsed CV:\n"
            . "{$url}\n\n"
            . "– The ATSense Team";

        return $this->send(
            ['email' => $email, 'name' => $name],
            "Pair your resume with an ATS-friendly cover letter in 10 seconds 📄",
            $html,
            $altBody
        );
    }

    /**
     * Drip Step 3 (Day 5): Practice with the AI Interview Simulator.
     */
    public function sendInterviewPrepNudgeEmail(string $name, string $email): array
    {
        $safeName = htmlspecialchars($name ?: 'there', ENT_QUOTES, 'UTF-8');
        $url      = 'https://atsense.online/interview-prep';

        $html = <<<HTML
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Practice with ATSense AI Interview Prep</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0f19;">
    <tr>
      <td align="center" style="padding:10px 0 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#111827;border:1px solid #1f293d;border-radius:16px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.5);">
          <tr>
            <td style="background:linear-gradient(135deg,#059669 0%,#0284c7 100%);padding:32px 28px;text-align:left;">
              <span style="display:inline-block;background:rgba(0,0,0,0.25);color:#d1fae5;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 10px;border-radius:20px;margin-bottom:10px;">
                INTERVIEW READINESS
              </span>
              <h1 style="margin:6px 0 0;color:#ffffff;font-size:24px;font-weight:800;line-height:1.2;">
                Got an interview invite? Be prepared &#127908;
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 26px;">
              <p style="margin:0 0 14px;color:#f1f5f9;font-size:15px;font-weight:600;">
                Hi {$safeName},
              </p>
              <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;line-height:1.65;">
                Passing the ATS screener is step one. The next hurdle is the recruiter phone screen and behavioral interview.
                <br /><br />
                Our <strong>AI Interview Simulator</strong> generates real interview questions tailored to your specific role and provides instant feedback on your STAR-method responses.
              </p>

              <!-- Action Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border:1px solid #065f46;border-radius:12px;margin-bottom:22px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">
                      Simulate Your Real Job Interview
                    </p>
                    <p style="margin:0 0 14px;color:#94a3b8;font-size:13px;line-height:1.5;">
                      Practice tough behavioral and technical questions in a zero-stakes simulator.
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#059669;border-radius:8px;">
                          <a href="{$url}" style="display:inline-block;padding:11px 24px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;border-radius:8px;background:#059669;background:linear-gradient(135deg,#059669,#10b981);">
                            Launch Interview Simulator &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size:12px;color:#64748b;margin:0;">
                Free tool · Helps you ace the phone screen and final rounds.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0b0f19;border-top:1px solid #1e293b;padding:18px 24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#475569;">
                <a href="https://atsense.online" style="color:#818cf8;text-decoration:none;">ATSense.online</a> &middot; The Intelligent Career Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

        $altBody = "Hi {$safeName},\n\n"
            . "Passing the ATS bot is step one. Next is acing the real interview.\n\n"
            . "Practice behavioral and role-specific questions with the ATSense AI Interview Simulator:\n"
            . "{$url}\n\n"
            . "– The ATSense Team";

        return $this->send(
            ['email' => $email, 'name' => $name],
            "Interview invite? Practice with ATSense AI Interview Prep 🎙️",
            $html,
            $altBody
        );
    }

    /**
     * Drip Step 4 (Day 7): Optimize LinkedIn Profile.
     */
    public function sendLinkedInNudgeEmail(string $name, string $email): array
    {
        $safeName = htmlspecialchars($name ?: 'there', ENT_QUOTES, 'UTF-8');
        $url      = 'https://atsense.online/linkedin-optimizer';

        $html = <<<HTML
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Optimize your LinkedIn Profile</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0f19;">
    <tr>
      <td align="center" style="padding:10px 0 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#111827;border:1px solid #1f293d;border-radius:16px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.5);">
          <tr>
            <td style="background:linear-gradient(135deg,#0284c7 0%,#2563eb 100%);padding:32px 28px;text-align:left;">
              <span style="display:inline-block;background:rgba(0,0,0,0.25);color:#e0f2fe;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 10px;border-radius:20px;margin-bottom:10px;">
                RECRUITER VISIBILITY
              </span>
              <h1 style="margin:6px 0 0;color:#ffffff;font-size:24px;font-weight:800;line-height:1.2;">
                Recruiters are searching LinkedIn &mdash; is your headline ready? &#128188;
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 26px;">
              <p style="margin:0 0 14px;color:#f1f5f9;font-size:15px;font-weight:600;">
                Hi {$safeName},
              </p>
              <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;line-height:1.65;">
                Over 87% of headhunters search LinkedIn daily to source candidates. If your headline and summary don't match exact recruiter search algorithms, your profile stays hidden.
                <br /><br />
                Let our AI rewrite your LinkedIn headline, About section, and experience bullets to rank at the top of recruiter searches.
              </p>

              <!-- Action Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border:1px solid #1e40af;border-radius:12px;margin-bottom:22px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;color:#ffffff;font-size:15px;font-weight:700;">
                      Optimize Your LinkedIn Profile
                    </p>
                    <p style="margin:0 0 14px;color:#94a3b8;font-size:13px;line-height:1.5;">
                      Boost your recruiter inmail rate and profile impressions in 1 click.
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#2563eb;border-radius:8px;">
                          <a href="{$url}" style="display:inline-block;padding:11px 24px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;border-radius:8px;background:#2563eb;background:linear-gradient(135deg,#2563eb,#38bdf8);">
                            Optimize My LinkedIn &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size:12px;color:#64748b;margin:0;">
                100% Free · ATSense Career Platform.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0b0f19;border-top:1px solid #1e293b;padding:18px 24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#475569;">
                <a href="https://atsense.online" style="color:#818cf8;text-decoration:none;">ATSense.online</a> &middot; The Intelligent Career Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

        $altBody = "Hi {$safeName},\n\n"
            . "Over 87% of headhunters search LinkedIn daily.\n\n"
            . "Rewrite your headline and About section to rank higher in recruiter searches:\n"
            . "{$url}\n\n"
            . "– The ATSense Team";

        return $this->send(
            ['email' => $email, 'name' => $name],
            "Recruiters are searching LinkedIn — is your headline ready? 💼",
            $html,
            $altBody
        );
    }
}
