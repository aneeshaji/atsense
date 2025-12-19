import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

function Preview() {
    const { id } = useParams();
    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const res = await api.get(`/preview/${id}`);
                setPreviewHtml(res.data);
            } catch (err) {
                console.error("Failed to load preview", err);
                setPreviewHtml('<div style="color:red; text-align:center; padding:20px;">Failed to load preview. Please try again.</div>');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPreview();
        }
    }, [id]);

    const handleDownload = async (format: 'pdf' | 'docx') => {
        try {
            const response = await api.get(`/export/${format}/${id}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume.${format}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error(`Failed to download ${format}`, error);
            alert(`Failed to download ${format.toUpperCase()}`);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Toolbar */}
            <div style={{
                padding: '10px 20px',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                backgroundColor: '#f8f9fa'
            }}>
                <h3 style={{ margin: 0, marginRight: 'auto' }}>Preview</h3>

                <button
                    onClick={() => handleDownload('pdf')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Download PDF
                </button>

                <button
                    onClick={() => handleDownload('docx')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#2980b9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Download DOCX
                </button>
            </div>

            {/* Preview Iframe */}
            <div style={{ flex: 1, backgroundColor: '#525659', padding: '20px' }}>
                {loading ? (
                    <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Loading preview...</div>
                ) : (
                    <iframe
                        srcDoc={previewHtml}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            backgroundColor: 'white',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                        }}
                        title="Resume Preview"
                    />
                )}
            </div>
        </div>
    );
}

export default Preview;
