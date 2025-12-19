import { useState, useEffect } from 'react';
import Joyride, { STATUS, type CallBackProps, type Step } from 'react-joyride';
import { useLocation } from 'react-router-dom';

const OnboardingTour = () => {
    const [run, setRun] = useState(false);
    const location = useLocation();

    const steps: Step[] = [
        {
            target: 'body',
            content: 'Welcome to ATSense! Let\'s take a quick tour to help you get started.',
            placement: 'center',
        },
        {
            target: '.create-resume-btn',
            content: 'Click here to create your first ATS-optimized resume.',
            spotlightPadding: 20,
        },
        {
            target: '.import-resume-btn',
            content: 'Or import an existing PDF/DOCX resume to see how it scores.',
        },
        {
            target: '.dashboard-title',
            content: 'This is your dashboard where you can manage all your resumes.',
        }
    ];

    useEffect(() => {
        // Only run on dashboard
        if (location.pathname !== '/') {
            setRun(false);
            return;
        }

        // Check if user has already seen the tour
        const tourSeen = localStorage.getItem('onboarding_tour_seen');
        if (!tourSeen) {
            setRun(true);
        }
    }, [location.pathname]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('onboarding_tour_seen', 'true');
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#4f46e5', // Indigo-600
                    zIndex: 10000,
                },
            }}
        />
    );
};

export default OnboardingTour;
