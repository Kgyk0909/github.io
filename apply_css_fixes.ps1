$cssPath = "c:\PROJ\pwa_test\assets\css\style.css"

# 1. smartphone-container に max-width と max-height を追加
$css = Get-Content $cssPath -Raw -Encoding UTF8
$css = $css -replace '(\.smartphone-container \{[^\}]*box-shadow:[^\;]+;)\s*\}', '$1  max-width: 100vw;  max-height: 100vh;}'
Set-Content $cssPath -Value $css -NoNewline -Encoding UTF8

# 2. z-index を 100 から 200 に変更 (settings-button のみ)
$css = Get-Content $cssPath -Raw -Encoding UTF8
$css = $css -replace '(\.settings-button \{[^\}]*)\s+z-index: 100;', '$1  z-index: 200;'
Set-Content $cssPath -Value $css -NoNewline -Encoding UTF8

# 3. ハンバーガーボタン定義の追加/修正して z-index: 200 を確保
$css = Get-Content $cssPath -Raw -Encoding UTF8
if ($css -match '\.hamburger-button \{') {
    # 既存のハンバーガーボタン定義があれば z-index を追加/変更
    if ($css -notmatch '\.hamburger-button \{[^\}]*z-index:') {
        $css = $css -replace '(\.chat-area \{[^\}]*\}\s*)', ('$1' + "`r`n" + '.hamburger-button {  position: absolute;  top: 20px;  left: 20px;  width: 50px;  height: 50px;  background: none;  border: none;  cursor: pointer;  display: flex;  flex-direction: column;  justify-content: center;  align-items: center;  gap: 5px;  padding: 8px;  border-radius: 12px;  transition: all 0.2s;  flex-shrink: 0;  z-index: 200;  pointer-events: auto;}' + "`r`n")
        Set-Content $cssPath -Value $css -NoNewline -Encoding UTF8
    }
}

# 4. message-input のパディングを変更して送信ボタンのスペースを確保
$css = Get-Content $cssPath -Raw -Encoding UTF8
$css = $css -replace '(\.message-input \{[^\}]*padding:\s*)8px 16px;', '$148px 8px 48px 16px;'
Set-Content $cssPath -Value $css -NoNewline -Encoding UTF8

# 5. send-button に position: absolute を追加
$css = Get-Content $cssPath -Raw -Encoding UTF8
$css = $css -replace '(\.send-button \{[^\}]*justify-content: center;)\s*\}', ('$1' + "`r`n" + '  position: absolute;' + "`r`n" + '  bottom: 2px;' + "`r`n" + '  right: 2px;' + "`r`n" + '}')
Set-Content $cssPath -Value $css -NoNewline -Encoding UTF8

# 6. send-button:hover から translateY を削除
$css = Get-Content $cssPath -Raw -Encoding UTF8
$css = $css -replace '(\.send-button:hover \{[^\}]*)\s+transform: translateY\(-2px\);', '$1'
Set-Content $cssPath -Value $css -NoNewline -Encoding UTF8

# 7. send-button:active を transform: scale(0.95) に変更
$css = Get-Content $cssPath -Raw -Encoding UTF8
$css = $css -replace '(\.send-button:active \{)\s+transform: translateY\(0\);', ('$1' + "`r`n" + '  transform: scale(0.95);')
Set-Content $cssPath -Value $css -NoNewline -Encoding UTF8

# 8. @media (max-height: 400px) の修正
$css = Get-Content $cssPath -Raw -Encoding UTF8
$css = $css -replace '(@media \(max-height: 400px\) \{[^\}]*\.chat-area \{[^\}]*max-height:\s*)80%', '$1100%; height: 100%; border-radius: 0'
$css = $css -replace '(@media \(max-height: 400px\) \{[^\}]*\}[^\}]*\})(\s*@view-transition)', ('$1' + "`r`n`r`n" + '.chat-app-wrapper {' + "`r`n" + '  min-height: 0;' + "`r`n" + '}' + '$2')
Set-Content $cssPath -Value $css -NoNewline -Encoding UTF8

Write-Host "CSS modifications completed!"
