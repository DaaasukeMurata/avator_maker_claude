class AvatarGenerator {
    constructor() {
        this.nameInput = document.getElementById('nameInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.avatarDisplay = document.getElementById('avatarDisplay');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.generateBtn.addEventListener('click', () => this.generateAvatar());
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.generateAvatar();
        });
        this.downloadBtn.addEventListener('click', () => this.downloadAvatar());
        
        this.currentSvg = null;
    }
    
    generateAvatar() {
        const name = this.nameInput.value.trim();
        if (!name) {
            alert('名前またはキーワードを入力してください');
            return;
        }
        
        this.showLoading();
        
        // 名前から疑似ランダムな値を生成
        const seed = this.stringToSeed(name);
        const avatar = this.createSVGAvatar(seed, name);
        
        setTimeout(() => {
            this.displayAvatar(avatar);
        }, 500);
    }
    
    stringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit整数に変換
        }
        return Math.abs(hash);
    }
    
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    createSVGAvatar(seed, name) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
            '#F7DC6F', '#BB8FCE', '#85C1E9', '#82E0AA', '#F8C471'
        ];
        
        const backgroundColors = [
            '#FFE4E1', '#E0F6F6', '#E1F5FE', '#FFF0E6', '#E8F8F5',
            '#FFFBEA', '#F4E4F7', '#E3F2FD', '#E8F5E8', '#FEF9E7'
        ];
        
        let currentSeed = seed;
        const random = () => {
            currentSeed++;
            return this.seededRandom(currentSeed);
        };
        
        const bgColor = backgroundColors[Math.floor(random() * backgroundColors.length)];
        const primaryColor = colors[Math.floor(random() * colors.length)];
        const secondaryColor = colors[Math.floor(random() * colors.length)];
        
        // 顔の形
        const faceType = Math.floor(random() * 3);
        let faceShape;
        
        if (faceType === 0) {
            // 円形
            faceShape = `<circle cx="100" cy="100" r="80" fill="${bgColor}" stroke="${primaryColor}" stroke-width="4"/>`;
        } else if (faceType === 1) {
            // 角丸四角形
            faceShape = `<rect x="20" y="20" width="160" height="160" rx="30" fill="${bgColor}" stroke="${primaryColor}" stroke-width="4"/>`;
        } else {
            // 楕円形
            faceShape = `<ellipse cx="100" cy="100" rx="80" ry="90" fill="${bgColor}" stroke="${primaryColor}" stroke-width="4"/>`;
        }
        
        // 目
        const eyeType = Math.floor(random() * 4);
        let eyes;
        
        if (eyeType === 0) {
            // 丸い目
            eyes = `
                <circle cx="70" cy="80" r="8" fill="${primaryColor}"/>
                <circle cx="130" cy="80" r="8" fill="${primaryColor}"/>
            `;
        } else if (eyeType === 1) {
            // ウィンク
            eyes = `
                <path d="M 62 80 Q 70 75 78 80" stroke="${primaryColor}" stroke-width="3" fill="none"/>
                <circle cx="130" cy="80" r="8" fill="${primaryColor}"/>
            `;
        } else if (eyeType === 2) {
            // 星の形の目
            eyes = `
                <path d="M70,70 L72,78 L80,78 L74,83 L76,91 L70,86 L64,91 L66,83 L60,78 L68,78 Z" fill="${primaryColor}"/>
                <path d="M130,70 L132,78 L140,78 L134,83 L136,91 L130,86 L124,91 L126,83 L120,78 L128,78 Z" fill="${primaryColor}"/>
            `;
        } else {
            // ハートの形の目
            eyes = `
                <path d="M70,75 C70,70 65,70 65,75 C65,70 60,70 60,75 C60,80 70,85 70,85 C70,85 80,80 80,75 C80,70 75,70 75,75 C75,70 70,70 70,75 Z" fill="${primaryColor}"/>
                <path d="M130,75 C130,70 125,70 125,75 C125,70 120,70 120,75 C120,80 130,85 130,85 C130,85 140,80 140,75 C140,70 135,70 135,75 C135,70 130,70 130,75 Z" fill="${primaryColor}"/>
            `;
        }
        
        // 口
        const mouthType = Math.floor(random() * 4);
        let mouth;
        
        if (mouthType === 0) {
            // 笑顔
            mouth = `<path d="M 70 120 Q 100 140 130 120" stroke="${primaryColor}" stroke-width="3" fill="none"/>`;
        } else if (mouthType === 1) {
            // 真っ直ぐな口
            mouth = `<line x1="80" y1="125" x2="120" y2="125" stroke="${primaryColor}" stroke-width="3"/>`;
        } else if (mouthType === 2) {
            // 小さな口
            mouth = `<circle cx="100" cy="125" r="5" fill="${primaryColor}"/>`;
        } else {
            // ハートの口
            mouth = `<path d="M100,120 C100,115 95,115 95,120 C95,115 90,115 90,120 C90,125 100,135 100,135 C100,135 110,125 110,120 C110,115 105,115 105,120 C105,115 100,115 100,120 Z" fill="${primaryColor}"/>`;
        }
        
        // アクセサリー（ランダムで追加）
        let accessories = '';
        if (random() > 0.5) {
            const accessoryType = Math.floor(random() * 3);
            if (accessoryType === 0) {
                // 帽子
                accessories = `<path d="M 40 40 Q 100 20 160 40 L 150 50 Q 100 30 50 50 Z" fill="${secondaryColor}"/>`;
            } else if (accessoryType === 1) {
                // 眼鏡
                accessories = `
                    <circle cx="70" cy="80" r="15" fill="none" stroke="${secondaryColor}" stroke-width="2"/>
                    <circle cx="130" cy="80" r="15" fill="none" stroke="${secondaryColor}" stroke-width="2"/>
                    <line x1="85" y1="80" x2="115" y2="80" stroke="${secondaryColor}" stroke-width="2"/>
                `;
            } else {
                // リボン
                accessories = `<path d="M 85 50 Q 100 40 115 50 Q 100 60 85 50" fill="${secondaryColor}"/>`;
            }
        }
        
        // 名前の最初の文字を装飾として追加
        const initial = name.charAt(0).toUpperCase();
        const initialDecoration = `<text x="100" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${primaryColor}">${initial}</text>`;
        
        const svg = `
            <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                ${faceShape}
                ${eyes}
                ${mouth}
                ${accessories}
                ${initialDecoration}
            </svg>
        `;
        
        return svg;
    }
    
    showLoading() {
        this.avatarDisplay.innerHTML = '<div class="loading">アバターを生成中...</div>';
        this.downloadBtn.style.display = 'none';
    }
    
    displayAvatar(svgString) {
        this.avatarDisplay.innerHTML = svgString;
        this.currentSvg = svgString;
        this.downloadBtn.style.display = 'block';
    }
    
    downloadAvatar() {
        if (!this.currentSvg) return;
        
        const blob = new Blob([this.currentSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `avatar-${this.nameInput.value.trim()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// アプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    new AvatarGenerator();
});