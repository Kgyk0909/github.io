import {
    elements,
    openSidebar,
    closeSidebar,
    startNewChat,
    openSettings,
    closeSettings,
    saveSettings,
    autoResizeTextarea,
    addMessageToScreen,
    showTypingIndicator,
    hideTypingIndicator
} from './ui.js';

// ビューポートの高さを正確に設定するための処理
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 初期ロード時とウィンドウのリサイズ時に実行
window.addEventListener('load', setViewportHeight);
window.addEventListener('resize', setViewportHeight);

// PWAとしてインストールされた後のアドレスバーの表示/非表示に対応するため、orientationchange時にも実行
window.addEventListener('orientationchange', setViewportHeight);


// --- イベントリスナーの設定 ---

// サイドバー関連
elements.hamburgerButton.addEventListener('click', () => {
    if (elements.sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
});
elements.closeSidebar.addEventListener('click', closeSidebar);
elements.sidebarOverlay.addEventListener('click', closeSidebar);
elements.newChatButton.addEventListener('click', startNewChat);

// 設定画面関連
elements.settingsButton.addEventListener('click', openSettings);
elements.closeSettings.addEventListener('click', closeSettings);
elements.settingsForm.addEventListener('submit', saveSettings);

// メッセージ入力フォーム関連
elements.messageInput.addEventListener('input', autoResizeTextarea);
elements.messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = elements.messageInput.value.trim();
    if (!text) return;

    addMessageToScreen('user', text);
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';

    // ダミーのAI応答
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const responses = [
                "こんにちは！何かお手伝いできることはありますか？",
                "それは興味深いですね。詳しく教えていただけますか？",
                "なるほど、理解しました。他に質問はありますか？",
                "ありがとうございます。それについてもっと知りたいです。",
                "素晴らしい質問ですね！一緒に考えてみましょう。"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToScreen('ai', randomResponse);
        }, 1500);
    }, 500);
});

// --- Service Workerの登録 ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js') // ルートパスを指定
            .then(registration => {
                console.log('Service Worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed: ', error);
            });
    });
}
