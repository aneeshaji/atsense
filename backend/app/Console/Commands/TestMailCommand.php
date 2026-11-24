<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PHPMailerService;

class TestMailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test {email? : The recipient email address} {--welcome : Send the actual welcome/nudge template}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email using PHPMailer to verify SMTP and email configurations';

    /**
     * Execute the console command.
     */
    public function handle(PHPMailerService $mailerService)
    {
        $recipient = $this->argument('email') ?: env('CONTACT_MAIL_TO', env('MAIL_FROM_ADDRESS', 'support@atsense.online'));

        $this->info("=========================================");
        $this->info(" ATSense PHPMailer Diagnostic & Test Tool ");
        $this->info("=========================================");
        $this->line("Mailer Driver  : " . env('MAIL_MAILER', 'smtp'));
        $this->line("SMTP Host      : " . (env('MAIL_HOST') ?: 'Not configured (using fallback)'));
        $this->line("SMTP Port      : " . env('MAIL_PORT', 587));
        $this->line("SMTP Encryption: " . (env('MAIL_ENCRYPTION') ?: 'none'));
        $this->line("SMTP Username  : " . (env('MAIL_USERNAME') ? substr(env('MAIL_USERNAME'), 0, 4) . '***' : 'None'));
        $this->line("From Address   : " . env('MAIL_FROM_ADDRESS', 'support@atsense.online'));
        $this->line("Target Recipient: {$recipient}");
        $this->newLine();

        if ($this->option('welcome')) {
            $this->info("Attempting to dispatch WELCOME & NUDGE template email...");
            $result = $mailerService->sendWelcomeAndNudgeEmail('Aneesh A', $recipient);
        } else {
            $this->info("Attempting to dispatch test email...");

            $subject = "[ATSense Test] PHPMailer Verification (" . date('Y-m-d H:i:s') . ")";
            $body = "
            <div style='font-family:sans-serif; padding:20px; color:#333;'>
                <h2 style='color:#4f46e5;'>PHPMailer Test Successful!</h2>
                <p>This is a verification email from your <strong>ATSense</strong> backend using <strong>PHPMailer</strong>.</p>
                <hr style='border:0; border-top:1px solid #eee; margin:20px 0;'>
                <p style='font-size:12px; color:#666;'>
                    Timestamp: " . date('r') . "<br>
                    PHP Version: " . phpversion() . "<br>
                    Host: " . (env('MAIL_HOST') ?: 'localhost') . "
                </p>
            </div>";

            $debug = $this->output->isVerbose() || $this->output->isVeryVerbose() || $this->output->isDebug();
            $result = $mailerService->send($recipient, $subject, $body, '', ['debug' => $debug]);
        }

        if ($result['success']) {
            $this->info("✓ SUCCESS: " . $result['message']);
            return Command::SUCCESS;
        } else {
            $this->error("✗ FAILURE: " . $result['message']);
            if (!empty($result['error'])) {
                $this->warn("Error Details: " . $result['error']);
            }
            return Command::FAILURE;
        }
    }
}
