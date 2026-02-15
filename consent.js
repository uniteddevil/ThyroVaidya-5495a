/**
 * ThyroVaidya Cookie Consent & GA4 Consent Mode v2
 */

(function () {
    // 1. Create and inject styles
    const styles = `
        #cookie-consent-banner {
            position: fixed;
            bottom: 24px;
            right: 24px;
            left: 24px;
            max-width: 400px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(6, 78, 59, 0.1);
            border-radius: 24px;
            padding: 24px;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            display: none;
            flex-direction: column;
            gap: 16px;
            animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (min-width: 768px) {
            #cookie-consent-banner {
                left: auto;
                bottom: 32px;
                right: 32px;
            }
        }

        @keyframes slideUp {
            from { transform: translateY(100%) opacity: 0; }
            to { transform: translateY(0) opacity: 1; }
        }

        .consent-title {
            font-weight: 700;
            color: #064e3b;
            font-size: 1.1rem;
        }

        .consent-text {
            font-size: 0.875rem;
            color: #475569;
            line-height: 1.5;
        }

        .consent-text a {
            color: #064e3b;
            text-decoration: underline;
            font-weight: 600;
        }

        .consent-buttons {
            display: flex;
            gap: 12px;
        }

        .consent-button {
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            flex: 1;
            text-align: center;
        }

        .btn-accept {
            background: #064e3b;
            color: white;
            border: none;
        }

        .btn-accept:hover {
            background: #065f46;
            transform: scale(1.02);
        }

        .btn-reject {
            background: transparent;
            color: #64748b;
            border: 1px solid #e2e8f0;
        }

        .btn-reject:hover {
            background: #f8fafc;
            color: #0f172a;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 2. Banner HTML
    const bannerHTML = `
        <div class="consent-title">Cookie Consent</div>
        <div class="consent-text">
            To provide the best Ayurvedic consultation experience, we use cookies for clinical analytics. 
            View our <a href="privacy.html">Privacy Policy</a> to learn more.
        </div>
        <div class="consent-buttons">
            <button class="consent-button btn-reject" id="reject-all">Reject All</button>
            <button class="consent-button btn-accept" id="accept-all">Accept All</button>
        </div>
    `;

    // 3. Initialize Banner
    function initBanner() {
        const consent = localStorage.getItem('thyrovaidya_consent');
        if (consent) {
            return;
        }

        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = bannerHTML;
        document.body.appendChild(banner);
        banner.style.display = 'flex';

        document.getElementById('accept-all').addEventListener('click', () => {
            handleAction('granted');
        });

        document.getElementById('reject-all').addEventListener('click', () => {
            handleAction('denied');
        });
    }

    function handleAction(status) {
        const consentObj = {
            'ad_storage': status,
            'ad_user_data': status,
            'ad_personalization': status,
            'analytics_storage': status
        };
        localStorage.setItem('thyrovaidya_consent', JSON.stringify(consentObj));
        updateConsent(consentObj);
        document.getElementById('cookie-consent-banner').style.display = 'none';
    }

    function updateConsent(consentObj) {
        if (window.gtag) {
            gtag('consent', 'update', consentObj);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBanner);
    } else {
        initBanner();
    }
})();
