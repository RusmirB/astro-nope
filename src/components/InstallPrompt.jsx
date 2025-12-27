import { useState, useEffect } from 'react';
import './InstallPrompt.css';
import { trackInstallPrompt } from '../utils/analytics';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
        trackInstallPrompt('shown');
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      trackInstallPrompt('accepted');
    } else {
      trackInstallPrompt('dismissed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    trackInstallPrompt('dismissed');
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt || sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-icon">📱</div>
        <div className="install-prompt-text">
          <strong>Install AstroNope</strong>
          <p>Add to home screen for quick access!</p>
        </div>
        <div className="install-prompt-actions">
          <button 
            className="install-btn install-btn-primary"
            onClick={handleInstallClick}
          >
            Install
          </button>
          <button 
            className="install-btn install-btn-dismiss"
            onClick={handleDismiss}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;

