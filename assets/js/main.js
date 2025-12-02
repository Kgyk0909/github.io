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
import { callChatFunction } from './api.js'; // 追加

let currentChatId = null; // 追加

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
elements.newChatButton.addEventListener('click', () => { // 無名関数でラップしてchatIdをリセット
    startNewChat();
    currentChatId = null;
});

// 設定画面関連
elements.settingsButton.addEventListener('click', openSettings);
elements.closeSettings.addEventListener('click', closeSettings);
elements.settingsForm.addEventListener('submit', saveSettings);

// メッセージ入力フォーム関連
elements.messageInput.addEventListener('input', autoResizeTextarea);
elements.messageForm.addEventListener('submit', async (e) => { // async を追加
    e.preventDefault();
    
    const text = elements.messageInput.value.trim();
    if (!text) return;

    addMessageToScreen('user', text);
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';

    showTypingIndicator(); // Functions 呼び出し前に表示

    try {
        const response = await callChatFunction(text, currentChatId); // Functions を呼び出す
        hideTypingIndicator(); // Functions 応答後に非表示
        addMessageToScreen('ai', response.aiResponse); // AI応答を画面に表示
        currentChatId = response.chatId; // 会話IDを更新
    } catch (error) {
        console.error("Error getting AI response:", error);
        hideTypingIndicator(); // エラー時も非表示
        addMessageToScreen('ai', "AIからの応答が取得できませんでした。"); // エラーメッセージを表示
    }
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
