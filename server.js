const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルを提供
app.use(express.static(path.join(__dirname)));

// ルートパスで index.html を提供
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ヘルスチェック用エンドポイント
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`アバター生成器サーバーがポート ${PORT} で起動しました`);
    console.log(`http://localhost:${PORT} でアクセスできます`);
});