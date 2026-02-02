<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Dompdf\Dompdf;
use Dompdf\Options;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Shared\Html;
use PhpOffice\PhpWord\IOFactory;

class ExportController extends Controller
{
    public function pdf(Request $request, string $id)
    {
        $resume = $request->user()->resumes()->find($id);

        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        $html = view('pdf.resume', ['resume' => $resume])->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'Helvetica');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response()->streamDownload(function () use ($dompdf) {
            echo $dompdf->output();
        }, 'resume.pdf');
    }

    public function docx(Request $request, string $id)
    {
        $resume = $request->user()->resumes()->find($id);

        if (!$resume) {
            return response()->json(['message' => 'Resume not found'], 404);
        }

        // Generate HTML view (reuse PDF view or create simplified one)
        $html = view('pdf.resume', ['resume' => $resume])->render();

        $phpWord = new PhpWord();
        $section = $phpWord->addSection();
        
        // Convert HTML to simple safe HTML for PHPWord
        // PHPWord's HTML support is limited, we might need to strip some complex CSS
        // For now, attempting direct adding
        Html::addHtml($section, $html, false, false);

        $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
        
        $fileName = 'resume_' . $resume->id . '.docx';
        $tempFile = tempnam(sys_get_temp_dir(), $fileName);
        
        $objWriter->save($tempFile);

        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }
}
