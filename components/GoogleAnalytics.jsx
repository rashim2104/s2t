'use client'

/**
 * Google Analytics component for tracking website traffic
 * @returns {JSX.Element} Script tags for Google Analytics implementation
 */
import Script from 'next/script'

export default function GoogleAnalytics() {
    return (
        <>
            <Script
                async
                src="https://www.googletagmanager.com/gtag/js?id=GA-SAMPLE-ID"
            />
            <Script id="google-analytics">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'GA-SAMPLE-ID');
                `}
            </Script>
        </>
    )
}
