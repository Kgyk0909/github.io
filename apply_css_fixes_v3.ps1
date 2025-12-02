$cssPath = "c:\PROJ\pwa_test\assets\css\style.css"

# バックアップ作成
Copy-Item $cssPath "$cssPath.backup_v3" -Force

# CSSを読み込み
$css = Get-Content $cssPath -Raw -Encoding UTF8

# 1. smartphone-container に max-width と max-height を追加
$css = $css -replace '(\.smartphone-container \{[^\}]*box-shadow: 0 0 40px rgba\(255, 255, 255, 0\.1\);)\s*\}', '$1  max-width: 100vw;  max-height: 100vh;}'

# 2. settings-button の z-index を 200 に変更
$css = $css -replace '(\.settings-button \{[^\}]*color: #ff6b35;)\s+z-index: 100;', '$1  z-index: 200;'

# 3. ハンバーガーボタンの完全な定義を追加（z-index: 200）
# まず、.chat-area の後に追加
$hamburgerButton = @'

.hamburger-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.2s;
  flex-shrink: 0;
  z-index: 200;
  pointer-events: auto;
}
'@

# .chat-area の定義の後に挿入
$css = $css -replace '(\.chat-area \{[^\}]*\}\s*)', ('$1' + $hamburgerButton)

# 4. input-formの構造を変更（flexを削除、wrapperをrelativeに）
$css = $css -replace '(\.input-form \{)\s+display: flex;\s+gap: 12px;\s+align-items: center;', '$1  position: relative;'

# 5. input-wrapper に pointer-events: auto を追加
$css = $css -replace '(\.input-wrapper \{)\s+flex: 1;', '$1  flex: 1;  pointer-events: auto;'

# 6. message-input のパディングを変更
$css = $css -replace '(\.message-input \{[^\}]*padding:)\s*8px 16px;', '$1 8px 48px 8px 16px;'

# 7. send-button のサイズ変更と absoluteプロパティ追加
# サイズ変更: 36px -> 32px, 18px -> 16px, 8px -> 6px
$css = $css -replace '(\.send-button \{[^\}]*padding:)\s*8px;', '$1 6px;'
$css = $css -replace '(\.send-button \{[^\}]*font-size:)\s*18px;', '$1 16px;'
$css = $css -replace '(\.send-button \{[^\}]*width:)\s*36px;', '$1 32px;'
$css = $css -replace '(\.send-button \{[^\}]*height:)\s*36px;', '$1 32px;'

$sendButtonProps = @'
  position: absolute;
  bottom: 6px;
  right: 6px;
'@
$css = $css -replace '(\.send-button \{[^\}]*justify-content: center;)\s*\}', ('$1' + $sendButtonProps + '}')

# 8. send-button:hoverから translateY を削除
$css = $css -replace '(\.send-button:hover \{[^\}]*)\s+transform: translateY\(-2px\);', '$1'

# 9. send-button:active を transform: scale(0.95) に変更
$css = $css -replace '(\.send-button:active \{)\s+transform: translateY\(0\);', '$1  transform: scale(0.95);'

# 10. @media (max-height: 400px) の修正
# チャット全域表示 + ハンバーガーボタンと設定ボタンに縁取り追加
$mediaQuery400 = @'
@media (max-height: 400px) {
  .chat-area {
    max-height: 100%;
    height: 100%;
    top: 0;
    border-radius: 0;
  }
  
  .chat-app-wrapper {
    min-height: 0;
  }
  
  .hamburger-button,
  .settings-button {
    background: rgba(10, 10, 10, 0.8);
    border: 2px solid #ff6b35;
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.6);
  }
}
'@

$css = $css -replace '@media \(max-height: 400px\) \{[^\}]*\.chat-area \{[^\}]*\}[^\}]*\.character-area \{[^\}]*\}[^\}]*\}', $mediaQuery400

# 保存
Set-Content $cssPath -Value $css -NoNewline -Encoding UTF8

Write-Host "CSS modifications completed successfully!"
Write-Host "Backup saved to: $cssPath.backup_v3"
