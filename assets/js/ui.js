// DOM要素の取得
export const elements = {
    chatMessages: document.getElementById('chat-messages'),
    messageForm: document.getElementById('message-form'),
    messageInput: document.getElementById('message-input'),
    sendButton: document.getElementById('send-button'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    hamburgerButton: document.getElementById('hamburger-button'),
    closeSidebar: document.getElementById('close-sidebar'),
    newChatButton: document.getElementById('new-chat-button'),
    settingsButton: document.getElementById('settings-button'),
    settingsScreen: document.getElementById('settings-screen'),
    closeSettings: document.getElementById('close-settings'),
    settingsForm: document.getElementById('settings-form'),
    toast: document.getElementById('toast')
};

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
    console.log('openSettings called');
    elements.settingsScreen.classList.add('open');
    loadSettings();
}

// 設定画面を閉じる
export function closeSettings() {
    console.log('closeSettings called');
    elements.settingsScreen.classList.remove('open');
}

// 設定を読み込む
function loadSettings() {
    console.log('loadSettings called');
    const rawSettings = localStorage.getItem('chatAppSettings');
    console.log('Raw settings from localStorage:', rawSettings);

    let settings = {};
    try {
        settings = JSON.parse(rawSettings) || {};
    } catch (e) {
        console.error('Error parsing settings:', e);
    }

    console.log('Parsed settings:', settings);

    const setFieldValue = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`Setting ${id} to:`, value);
            element.value = value || '';
        } else {
            console.error(`Element ${id} not found`);
        }
    };

    setFieldValue('gemini-api-key', settings.apiKey);
    setFieldValue('user-name', settings.name);
    setFieldValue('user-gender', settings.gender);
    setFieldValue('user-age', settings.age);
    setFieldValue('user-relationship', settings.relationship);
}

// 設定を保存する
export function saveSettings(e) {
    e.preventDefault();
    console.log('saveSettings called');

    const apiKey = document.getElementById('gemini-api-key').value;
    const userName = document.getElementById('user-name').value;
    const userGender = document.getElementById('user-gender').value;
    const userAge = document.getElementById('user-age').value;
    const userRelationship = document.getElementById('user-relationship').value;

    const settings = {
        apiKey: apiKey,
        name: userName,
        gender: userGender,
        age: userAge,
        relationship: userRelationship
    };

    console.log('Saving settings:', settings);
    localStorage.setItem('chatAppSettings', JSON.stringify(settings));

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
