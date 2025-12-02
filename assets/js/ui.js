// DOM要素の取得
const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Error: Element with ID '${id}' not found.`);
    } else {
        console.log(`Element with ID '${id}' found.`);
    }
    return element;
};

export const elements = {
    chatMessages: getElement('chat-messages'),
    messageForm: getElement('message-form'),
    messageInput: getElement('message-input'),
    sendButton: getElement('send-button'),
    sidebar: getElement('sidebar'),
    sidebarOverlay: getElement('sidebar-overlay'),
    hamburgerButton: getElement('hamburger-button'),
    closeSidebar: getElement('close-sidebar'),
    newChatButton: getElement('new-chat-button'),
    settingsButton: getElement('settings-button'),
    settingsScreen: getElement('settings-screen'),
    closeSettings: getElement('close-settings'),
    settingsForm: getElement('settings-form'),
    toast: getElement('toast')
};

// スワイプ関連の変数
let touchStartX = 0;
const SWIPE_THRESHOLD = 50; // スワイプと認識する最小距離（ピクセル）

// サイドバーオーバーレイにスワイプイベントを追加
elements.sidebarOverlay.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

elements.sidebarOverlay.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchEndX - touchStartX;

    // 左方向へのスワイプで、かつ閾値を超えている場合
    if (elements.sidebar.classList.contains('open') && distance < -SWIPE_THRESHOLD) {
        closeSidebar();
    }
});

// メッセージを格納する配列
export let messages = [];

// サイドバーを開く
export function openSidebar() {
    elements.sidebar.classList.add('open');
    elements.sidebarOverlay.classList.add('visible');
    elements.hamburgerButton.classList.add('active');
}

// サイドバーを閉じる
export function closeSidebar() {
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('visible');
    elements.hamburgerButton.classList.remove('active');
}

// 新しいチャットを開始する
export function startNewChat() {
    messages = [];
    elements.chatMessages.innerHTML = '';
    closeSidebar();
}

// 設定画面を開く
export function openSettings() {
    elements.settingsScreen.classList.add('open');
}

// 設定画面を閉じる
export function closeSettings() {
    elements.settingsScreen.classList.remove('open');
}

// 設定を保存する
export function saveSettings(e) {
    e.preventDefault();
    
    const userName = document.getElementById('user-name').value;
    const userGender = document.getElementById('user-gender').value;
    const userAge = document.getElementById('user-age').value;
    const userRelationship = document.getElementById('user-relationship').value;
    
    const settings = {
        name: userName,
        gender: userGender,
        age: userAge,
        relationship: userRelationship
    };
    
    // トーストを表示
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 1500);
}

// テキストエリアの高さを自動調整する
export function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
}

// メッセージを画面に追加する
export function addMessageToScreen(type, text) {
    const message = {
        type: type,
        text: text
    };
    messages.push(message);

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const textP = document.createElement('p');
    textP.className = 'message-text';
    textP.textContent = text;
    
    content.appendChild(textP);
    messageDiv.appendChild(content);
    
    elements.chatMessages.insertBefore(messageDiv, elements.chatMessages.firstChild);
    elements.chatMessages.scrollTop = 0;
}

// AIのタイピングインジケーターを表示する
export function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message ai';
    indicator.id = 'typing-indicator';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    content.appendChild(typingDiv);
    indicator.appendChild(content);
    
    elements.chatMessages.insertBefore(indicator, elements.chatMessages.firstChild);
    elements.chatMessages.scrollTop = 0;
}

// AIのタイピングインジケーターを非表示にする
export function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}
