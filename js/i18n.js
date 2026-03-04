const translations = {
    "en": {
        "title": "1024 Game",
        "score": "Score",
        "best": "Best",
        "retry": "Play Again",
        "explanation": "Use <strong>arrow keys</strong> or <strong>swipe</strong> to move the tiles. When two tiles with the same number touch, they merge into one!",
        "404_title": "404 - Page Not Found",
        "404_heading": "Oops! Page Not Found",
        "404_desc": "The page you're looking for doesn't exist or has been moved.",
        "404_back": "Back to Homepage",
        "game_over": "Game Over!",
        "share": "Share Score",
        "share_msg": "I just scored {score} in 1024! Can you beat me?"
    },
    "zh-CN": {
        "title": "1024",
        "score": "分数",
        "best": "最高分",
        "retry": "再试一次",
        "explanation": "使用 <strong>方向键</strong> 或 <strong>滑动</strong> 移动方块。相同数字的方块相撞时会合并成为它们的和。",
        "404_title": "404 - 页面未找到",
        "404_heading": "页面未找到",
        "404_desc": "抱歉，您尝试访问的页面不存在。可能是地址错误或者页面已被移除。",
        "404_back": "返回首页",
        "game_over": "游戏结束！",
        "share": "分享成绩",
        "share_msg": "我刚才在 1024 游戏中拿到了 {score} 分！你能超过我吗？"
    },
    "zh-TW": {
        "title": "1024",
        "score": "分數",
        "best": "最高分",
        "retry": "重玩一次",
        "explanation": "使用 <strong>方向鍵</strong> 或 <strong>滑動</strong> 來移動方塊。當兩個相同數字的方塊相撞時，就會合併成一個！",
        "404_title": "404 - 找不到網頁",
        "404_heading": "找不到網頁",
        "404_desc": "抱歉，您想訪問的頁面不存在，或是已經被移除了。",
        "404_back": "回到首頁",
        "game_over": "遊戲結束！",
        "share": "分享成績",
        "share_msg": "我剛才在 1024 遊戲中拿到了 {score} 分！你能超過我嗎？"
    },
    "ja": {
        "title": "1024 ゲーム",
        "score": "スコア",
        "best": "ベスト",
        "retry": "もう一度",
        "explanation": "<strong>方向キー</strong> または <strong>スワイプ</strong> でタイルを動かします。同じ数字のタイルがぶつかると、1つに合体します！",
        "404_title": "404 - ページが見つかりません",
        "404_heading": "お探しのページは見つかりません",
        "404_desc": "申し訳ありませんが、アクセスされたページは存在しないか、移動した可能性があります。",
        "404_back": "トップページへ戻る",
        "game_over": "ゲームオーバー！",
        "share": "スコアをシェア",
        "share_msg": "1024ゲームで {score} 点を達成しました！私を超えられますか？"
    },
    "fr": {
        "title": "Jeu 1024",
        "score": "Score",
        "best": "Meilleur",
        "retry": "Rejouer",
        "explanation": "Utilisez les <strong>flèches</strong> ou <strong>glissez</strong> pour déplacer les tuiles. Deux tuiles portant le même numéro fusionnent lorsqu'elles se touchent !",
        "404_title": "404 - Page Introuvable",
        "404_heading": "Oups ! Page Introuvable",
        "404_desc": "Désolé, la page que vous recherchez n'existe pas ou a été déplacée.",
        "404_back": "Retour à l'accueil",
        "game_over": "Fin du jeu !",
        "share": "Partager",
        "share_msg": "Je viens de marquer {score} à 1024 ! Peux-tu me battre ?"
    }
};

(function () {
    function detectLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith("zh-TW") || lang.startsWith("zh-HK") || lang.startsWith("zh-MO")) {
            return "zh-TW";
        }
        if (lang.startsWith("zh")) {
            return "zh-CN";
        }
        if (lang.startsWith("ja")) {
            return "ja";
        }
        if (lang.startsWith("fr")) {
            return "fr";
        }
        return "en"; // Default fallback
    }

    const currentLang = detectLanguage();
    document.documentElement.lang = currentLang;

    window.i18nTranslate = function (key) {
        const dict = translations[currentLang] || translations["en"];
        return dict[key] || key;
    };

    document.addEventListener("DOMContentLoaded", function () {
        // Update document title if needed
        const titleElement = document.querySelector("title[data-i18n]");
        if (titleElement) {
            titleElement.textContent = window.i18nTranslate(titleElement.getAttribute("data-i18n"));
        }

        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll("[data-i18n]");
        elements.forEach(el => {
            const key = el.getAttribute("data-i18n");
            // Allow HTML for the explanation
            if (key === "explanation") {
                el.innerHTML = window.i18nTranslate(key);
            } else {
                el.textContent = window.i18nTranslate(key);
            }
        });
    });
})();
