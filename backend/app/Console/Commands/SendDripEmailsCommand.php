<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ResumeLead;
use App\Models\ActivityLog;
use App\Models\SiteSetting;
use App\Services\PHPMailerService;
use Carbon\Carbon;

class SendDripEmailsCommand extends Command
{
    protected $signature = 'drip:send {--dry-run : Preview without sending} {--test= : Send all drip templates to test email}';
    protected $description = 'Dispatch automated 3-step nurture drip emails to resume leads';

    public function handle(PHPMailerService $mailer)
    {
        $testEmail = $this->option('test');
        $dryRun    = $this->option('dry-run');

        if ($testEmail) {
            $this->info("Sending all 3 drip test emails to: {$testEmail}");
            $res1 = $mailer->sendCoverLetterNudgeEmail('Test Candidate', $testEmail);
            $this->line("1. Cover Letter (Day 2): " . ($res1['success'] ? '✓ SENT' : '✗ FAILED'));

            $res2 = $mailer->sendInterviewPrepNudgeEmail('Test Candidate', $testEmail);
            $this->line("2. Interview Prep (Day 5): " . ($res2['success'] ? '✓ SENT' : '✗ FAILED'));

            $res3 = $mailer->sendLinkedInNudgeEmail('Test Candidate', $testEmail);
            $this->line("3. LinkedIn Optimizer (Day 7): " . ($res3['success'] ? '✓ SENT' : '✗ FAILED'));

            return Command::SUCCESS;
        }

        $now = Carbon::now();
        $newsletterMode = SiteSetting::where('setting_key', 'newsletter_mode')->value('setting_value') ?: 'both';
        $includeNewsletter = in_array($newsletterMode, ['drip', 'both'], true);
        $this->info("Starting Drip Sequence at {$now->toDateTimeString()} (Dry Run: " . ($dryRun ? 'YES' : 'NO') . ", Newsletter Drip: " . ($includeNewsletter ? 'ON' : 'OFF') . ")");

        // Step 1: Day 2 (48h - 120h after lead capture) -> Cover Letter
        $day2Query = ResumeLead::whereNotNull('welcome_email_sent_at')
            ->whereNull('drip_day2_sent_at')
            ->where('created_at', '<=', $now->copy()->subHours(48))
            ->where('created_at', '>=', $now->copy()->subHours(120))
            ->whereNotNull('email');
        if (!$includeNewsletter) {
            $day2Query->where('source', '!=', 'newsletter_subscriber');
        }
        $day2Candidates = $day2Query->orderByDesc('created_at')
            ->get()
            ->unique(fn ($l) => strtolower(trim($l->email)));

        $day2Sent = 0;
        $this->info("Found {$day2Candidates->count()} leads eligible for Day 2 Cover Letter drip.");
        foreach ($day2Candidates as $lead) {
            if (!$dryRun) {
                $result = $mailer->sendCoverLetterNudgeEmail($lead->name ?: 'there', $lead->email);
                if ($result['success']) {
                    $lead->update(['drip_day2_sent_at' => now()]);
                    $day2Sent++;
                    $this->info("  ✓ Day 2 sent to: {$lead->email}");
                } else {
                    $this->warn("  ✗ Day 2 failed for: {$lead->email}");
                }
            } else {
                $this->line("  [DRY-RUN] Would send Day 2 to: {$lead->email}");
            }
        }

        // Step 2: Day 5 (120h - 168h after lead capture) -> Interview Prep
        $day5Query = ResumeLead::whereNotNull('drip_day2_sent_at')
            ->whereNull('drip_day5_sent_at')
            ->where('created_at', '<=', $now->copy()->subHours(120))
            ->where('created_at', '>=', $now->copy()->subHours(168))
            ->whereNotNull('email');
        if (!$includeNewsletter) {
            $day5Query->where('source', '!=', 'newsletter_subscriber');
        }
        $day5Candidates = $day5Query->orderByDesc('created_at')
            ->get()
            ->unique(fn ($l) => strtolower(trim($l->email)));

        $day5Sent = 0;
        $this->info("Found {$day5Candidates->count()} leads eligible for Day 5 Interview Prep drip.");
        foreach ($day5Candidates as $lead) {
            if (!$dryRun) {
                $result = $mailer->sendInterviewPrepNudgeEmail($lead->name ?: 'there', $lead->email);
                if ($result['success']) {
                    $lead->update(['drip_day5_sent_at' => now()]);
                    $day5Sent++;
                    $this->info("  ✓ Day 5 sent to: {$lead->email}");
                } else {
                    $this->warn("  ✗ Day 5 failed for: {$lead->email}");
                }
            } else {
                $this->line("  [DRY-RUN] Would send Day 5 to: {$lead->email}");
            }
        }

        // Step 3: Day 7 (> 168h after lead capture) -> LinkedIn Optimizer
        $day7Query = ResumeLead::whereNotNull('drip_day5_sent_at')
            ->whereNull('drip_day7_sent_at')
            ->where('created_at', '<=', $now->copy()->subHours(168))
            ->whereNotNull('email');
        if (!$includeNewsletter) {
            $day7Query->where('source', '!=', 'newsletter_subscriber');
        }
        $day7Candidates = $day7Query->orderByDesc('created_at')
            ->get()
            ->unique(fn ($l) => strtolower(trim($l->email)));

        $day7Sent = 0;
        $this->info("Found {$day7Candidates->count()} leads eligible for Day 7 LinkedIn drip.");
        foreach ($day7Candidates as $lead) {
            if (!$dryRun) {
                $result = $mailer->sendLinkedInNudgeEmail($lead->name ?: 'there', $lead->email);
                if ($result['success']) {
                    $lead->update(['drip_day7_sent_at' => now()]);
                    $day7Sent++;
                    $this->info("  ✓ Day 7 sent to: {$lead->email}");
                } else {
                    $this->warn("  ✗ Day 7 failed for: {$lead->email}");
                }
            } else {
                $this->line("  [DRY-RUN] Would send Day 7 to: {$lead->email}");
            }
        }

        if (!$dryRun) {
            ActivityLog::record(
                'DRIP_CRON_RUN',
                "Drip sequence completed: Day2={$day2Sent}, Day5={$day5Sent}, Day7={$day7Sent}.",
                'info',
                ['day2_sent' => $day2Sent, 'day5_sent' => $day5Sent, 'day7_sent' => $day7Sent]
            );
        }

        $this->info("Drip email run completed.");
        return Command::SUCCESS;
    }
}
