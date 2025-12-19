function ATSScore({ score }) {
    const color =
        score >= 80 ? 'text-green-600' :
            score >= 60 ? 'text-yellow-500' :
                'text-red-600';

    return (
        <div className="p-4 border rounded">
            <p className="text-sm">ATS Score</p>
            <p className={`text-3xl font-bold ${color}`}>{score}%</p>
        </div>
    );
}

export default ATSScore;

