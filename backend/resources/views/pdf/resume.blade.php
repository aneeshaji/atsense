<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ $resume->personal_info['fullName'] ?? 'Resume' }}</title>
  <style>
    @page { margin: 0.5in 0.75in; }
    body {
      font-family: 'Bitstream Charter', 'Georgia', 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      margin: 0;
      padding: 0;
    }

    a { text-decoration: none; color: #000; }

    /* Colors */
    .google-blue { color: rgb(66, 133, 244); }
    .google-red { color: rgb(219, 68, 55); }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .name {
      font-size: 22pt;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .contact-info {
      font-size: 10pt;
      color: #333;
    }
    .contact-item {
      display: inline-block;
      margin: 0 8px;
    }

    /* Sections */
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #000;
      margin-top: 15px;
      margin-bottom: 8px;
      padding-bottom: 2px;
    }

    .content {
      text-align: justify;
      margin-bottom: 10px;
    }

    /* Experience Item */
    .exp-item {
      margin-bottom: 12px;
    }
    .exp-header {
      width: 100%;
    }
    .exp-role {
      font-size: 10pt;
      font-weight: bold;
      float: left;
    }
    .exp-date {
      color: rgb(66, 133, 244);
      float: right;
    }
    .clearfix::after {
      content: "";
      clear: both;
      display: table;
    }
    .exp-company {
      font-weight: bold;
      font-size: 10pt;
      margin-bottom: 4px;
      clear: both;
    }

    /* Education Item */
    .edu-item {
      margin-bottom: 8px;
    }
    .edu-degree { font-weight: bold; float: left; }
    .edu-year { color: rgb(219, 68, 55); float: right; }
    .edu-school { font-weight: bold; clear: both; }

    /* Lists */
    ul {
      margin: 2px 0 10px 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 2px;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="name">{{ $resume->personal_info['fullName'] ?? 'Your Name' }}</div>
    <div class="contact-info">
      @if(!empty($resume->personal_info['email']))
        <span class="contact-item">{{ $resume->personal_info['email'] }}</span>
      @endif
      @if(!empty($resume->personal_info['phone']))
        <span class="contact-item">{{ $resume->personal_info['phone'] }}</span>
      @endif
      @if(!empty($resume->personal_info['location']))
        <span class="contact-item">{{ $resume->personal_info['location'] }}</span>
      @endif
      
      @if(!empty($resume->personal_info['linkedin']))
        <br/><span class="contact-item">LinkedIn: {{ $resume->personal_info['linkedin'] }}</span>
      @endif
      @if(!empty($resume->personal_info['github']))
        <span class="contact-item">GitHub: {{ $resume->personal_info['github'] }}</span>
      @endif
    </div>
  </div>

  <!-- SUMMARY -->
  @if(!empty($resume->summary))
  <div class="section-title">Professional Summary</div>
  <div class="content">
    {{ $resume->summary }}
  </div>
  @endif

  <!-- SKILLS -->
  @if(!empty($resume->skills) && count($resume->skills) > 0)
  <div class="section-title">Technical Skills</div>
  <div class="content">
    <ul>
      <li><strong>Skills:</strong> {{ implode(', ', $resume->skills) }}</li>
    </ul>
  </div>
  @endif

  <!-- EXPERIENCE -->
  @if(!empty($resume->experience) && count($resume->experience) > 0)
  <div class="section-title">Professional Experience</div>
  <div>
    @foreach($resume->experience as $exp)
      <div class="exp-item">
        <div class="exp-header clearfix">
          <span class="exp-role">{{ $exp['jobTitle'] ?? '' }}</span>
          <span class="exp-date">{{ $exp['startDate'] ?? '' }} – {{ $exp['endDate'] ?? '' }}</span>
        </div>
        <div class="exp-company">
          {{ $exp['company'] ?? '' }}
        </div>
        <ul>
          @if(isset($exp['responsibilities']) && is_array($exp['responsibilities']))
            @foreach($exp['responsibilities'] as $resp)
              <li>{{ $resp }}</li>
            @endforeach
          @endif
        </ul>
      </div>
    @endforeach
  </div>
  @endif

  <!-- EDUCATION -->
  @if(!empty($resume->education) && count($resume->education) > 0)
  <div class="section-title">Education</div>
  <div>
    @foreach($resume->education as $edu)
      <div class="edu-item">
        <div class="clearfix">
            <span class="edu-degree">{{ $edu['degree'] ?? '' }}</span>
            <span class="edu-year">{{ $edu['year'] ?? '' }}</span>
        </div>
        <div class="edu-school">{{ $edu['institution'] ?? '' }}</div>
      </div>
    @endforeach
  </div>
  @endif

</body>
</html>
