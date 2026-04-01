<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ $resume->personal_info['fullName'] ?? 'Resume' }}</title>
  <style>
    @page {
      margin: 0.5in 0.6in;
      size: letter;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Times New Roman', 'Georgia', Times, serif;
      font-size: 10.5pt;
      line-height: 1.35;
      color: #000000;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    /* ── HEADER ── */
    .header {
      text-align: center;
      margin-bottom: 14px;
    }
    .name {
      font-size: 20pt;
      font-weight: bold;
      letter-spacing: 0.02em;
      color: #000000;
      margin-bottom: 4px;
    }
    .contact-line {
      font-size: 10pt;
      color: #000000;
    }

    /* ── SECTION TITLE (bold small-caps + rule underneath) ── */
    .section-title {
      font-size: 10.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #000000;
      margin-top: 10px;
      margin-bottom: 1px;
    }
    .section-rule {
      border: none;
      border-top: 0.5pt solid #000000;
      margin: 0 0 6px 0;
    }

    /* ── TWO-COLUMN ROW (title left, date right) ── */
    .row-flex {
      width: 100%;
    }
    .row-flex td {
      padding: 0;
      vertical-align: baseline;
    }
    .row-left {
      font-weight: bold;
      color: #000000;
      text-align: left;
    }
    .row-right {
      font-weight: bold;
      color: #000000;
      text-align: right;
      white-space: nowrap;
    }

    /* ── EXPERIENCE / EDUCATION ITEMS ── */
    .exp-item, .edu-item {
      margin-bottom: 8px;
    }
    .exp-company, .edu-school {
      font-style: italic;
      color: #000000;
      margin-bottom: 3px;
    }

    /* ── BULLET LIST (en-dash style) ── */
    .bullet-list {
      list-style: none;
      margin: 3px 0 0 0;
      padding: 0;
    }
    .bullet-list li {
      color: #000000;
      margin-bottom: 2px;
      padding-left: 1.5em;
      text-indent: -1.5em;
    }

    /* ── SKILLS (grouped bold-label rows) ── */
    .skill-row {
      margin-bottom: 3px;
      color: #000000;
    }
    .skill-label {
      font-weight: bold;
      color: #000000;
    }

    /* ── CERTIFICATION ROW ── */
    .cert-row {
      width: 100%;
      margin-bottom: 4px;
    }
    .cert-row td {
      padding: 0;
      vertical-align: baseline;
      color: #000000;
    }

    .para {
      text-align: justify;
      color: #000000;
      margin: 0 0 4px 0;
    }
  </style>
</head>
<body>

  {{-- ── HEADER ── --}}
  <div class="header">
    <div class="name">{{ $resume->personal_info['fullName'] ?? 'Your Name' }}</div>
    <div class="contact-line">
      @php
        $contactParts = array_filter([
          $resume->personal_info['location'] ?? '',
          $resume->personal_info['phone']    ?? '',
          $resume->personal_info['email']    ?? '',
          $resume->personal_info['linkedin'] ?? '',
          $resume->personal_info['portfolio'] ?? '',
        ]);
      @endphp
      {{ implode(' | ', $contactParts) }}
    </div>
  </div>

  {{-- ── PROFESSIONAL SUMMARY ── --}}
  @if(!empty($resume->summary))
    <div class="section-title">Professional Summary</div>
    <hr class="section-rule">
    <p class="para">{{ $resume->summary }}</p>
  @endif

  {{-- ── TECHNICAL SKILLS ── --}}
  @if(!empty($resume->skills) && count($resume->skills) > 0)
    <div class="section-title">Technical Skills</div>
    <hr class="section-rule">
    @foreach($resume->skills as $skillLine)
      @if(trim($skillLine))
        @php
          $colonPos = strpos($skillLine, ':');
        @endphp
        @if($colonPos !== false)
          <div class="skill-row">
            <span class="skill-label">{{ substr($skillLine, 0, $colonPos) }}:</span>
            {{ trim(substr($skillLine, $colonPos + 1)) }}
          </div>
        @else
          <div class="skill-row">{{ $skillLine }}</div>
        @endif
      @endif
    @endforeach
  @endif

  {{-- ── PROFESSIONAL EXPERIENCE ── --}}
  @if(!empty($resume->experience) && count($resume->experience) > 0)
    <div class="section-title">Professional Experience</div>
    <hr class="section-rule">
    @foreach($resume->experience as $exp)
      <div class="exp-item">
        {{-- Title ··············· Dates --}}
        <table class="row-flex" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td class="row-left">{{ $exp['title'] ?? ($exp['jobTitle'] ?? 'Position') }}</td>
            <td class="row-right">
              {{ $exp['startDate'] ?? '' }}
              @if(!empty($exp['startDate']) && !empty($exp['endDate'])) &ndash; @endif
              {{ $exp['endDate'] ?? '' }}
            </td>
          </tr>
        </table>
        {{-- Company — Location --}}
        <div class="exp-company">
          @php
            $companyParts = array_filter([$exp['company'] ?? '', $exp['location'] ?? '']);
          @endphp
          {{ implode(' — ', $companyParts) }}
        </div>
        {{-- Bullet points --}}
        @php
          $desc = $exp['description'] ?? '';
          // Fallback for old 'responsibilities' array format
          if (empty($desc) && isset($exp['responsibilities']) && is_array($exp['responsibilities'])) {
            $desc = implode("\n", $exp['responsibilities']);
          }
          $bullets = array_filter(explode("\n", $desc));
        @endphp
        @if(!empty($bullets))
          <ul class="bullet-list">
            @foreach($bullets as $bullet)
              @php $clean = ltrim(ltrim($bullet, '•-*'), ' '); @endphp
              @if(trim($clean))
                <li>&ndash;&ensp;{{ $clean }}</li>
              @endif
            @endforeach
          </ul>
        @endif
      </div>
    @endforeach
  @endif

  {{-- ── EDUCATION ── --}}
  @if(!empty($resume->education) && count($resume->education) > 0)
    <div class="section-title">Education</div>
    <hr class="section-rule">
    @foreach($resume->education as $edu)
      <div class="edu-item">
        @php
          $degree = trim(($edu['degree'] ?? '') . ' ' . ($edu['fieldOfStudy'] ?? ''));
          $degree = trim($degree, ' –');
          if (!empty($edu['fieldOfStudy'])) {
            $degree = ($edu['degree'] ?? '') . ' – ' . $edu['fieldOfStudy'];
          }
          $dateStr = '';
          if (!empty($edu['startDate']) && !empty($edu['endDate'])) {
            $dateStr = $edu['startDate'] . ' – ' . $edu['endDate'];
          } elseif (!empty($edu['endDate'])) {
            $dateStr = $edu['endDate'];
          } elseif (!empty($edu['year'])) {
            $dateStr = $edu['year'];
          }
          $school = array_filter([$edu['institution'] ?? '', $edu['location'] ?? '']);
        @endphp
        <table class="row-flex" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td class="row-left">{{ $degree ?: 'Degree' }}</td>
            <td class="row-right">{{ $dateStr }}</td>
          </tr>
        </table>
        <div class="edu-school">{{ implode(', ', $school) }}</div>
      </div>
    @endforeach
  @endif

  {{-- ── CERTIFICATIONS & TRAINING ── --}}
  @if(!empty($resume->certifications) && count($resume->certifications) > 0)
    <div class="section-title">Certifications &amp; Training</div>
    <hr class="section-rule">
    @foreach($resume->certifications as $cert)
      <table class="cert-row" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="text-align:left; color:#000;">
            <strong>{{ $cert['name'] ?? $cert['title'] ?? '' }}</strong>
            @if(!empty($cert['issuer'])) &ndash; {{ $cert['issuer'] }} @endif
          </td>
          <td style="text-align:right; color:#000; white-space:nowrap;">
            {{ $cert['date'] ?? $cert['year'] ?? '' }}
          </td>
        </tr>
      </table>
    @endforeach
  @endif

  {{-- ── LANGUAGES ── --}}
  @if(!empty($resume->languages) && count($resume->languages) > 0)
    <div class="section-title">Languages</div>
    <hr class="section-rule">
    <p class="para">
      @php
        $langList = array_filter(array_map(function($l) {
          if (is_string($l)) return $l;
          $name = $l['name'] ?? $l['language'] ?? '';
          $level = $l['level'] ?? $l['proficiency'] ?? '';
          return $level ? "$name ($level)" : $name;
        }, $resume->languages));
      @endphp
      {{ implode(', ', $langList) }}
    </p>
  @endif

</body>
</html>
