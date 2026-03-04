const translations = {
    "en": {
        "title": "1024 Game",
        "score": "Score",
        "best": "Best",
        "retry": "Try Again",
        "explanation": "Use <strong>arrow keys</strong> or <strong>swipe</strong> to move the tiles. Tiles with the same number merge into one when they touch.",
        "404_title": "404 - Page Not Found",
        "404_heading": "Page Not Found",
        "404_desc": "Sorry, the page you are looking for does not exist. It might have been moved or removed.",
        "404_back": "Back to Home",
        "game_over": "Game Over!"
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
        "game_over": "游戏结束！"
    },
    "zh-TW": {
        "title": "1024",
        "score": "分數",
        "best": "最高分",
        "retry": "再試一次",
        "explanation": "使用 <strong>方向鍵</strong> 或 <strong>滑動</strong> 移動方塊。相同數字的方塊相撞時會合併成為它們的和。",
        "404_title": "404 - 頁面未找到",
        "404_heading": "頁面未找到",
        "404_desc": "抱歉，您嘗試訪問的頁面不存在。可能是地址錯誤或者頁面已被移除。",
        "404_back": "返回首頁",
        "game_over": "遊戲結束！"
    },
    "ja": {
        "title": "1024 ゲーム",
        "score": "スコア",
        "best": "ベスト",
        "retry": "リトライ",
        "explanation": "<strong>矢印キー</strong> または <strong>スワイプ</strong> でタイルを移動します。同じ数字のタイルがぶつかると、1つに合体します。",
        "404_title": "404 - ページが見つかりません",
        "404_heading": "ページが見つかりません",
        "404_desc": "申し訳ありませんが、お探しのページは存在しません。移動または削除された可能性があります。",
        "404_back": "ホームに戻る",
        "game_over": "ゲームオーバー！"
    },
    "fr": {
        "title": "Jeu 1024",
        "score": "Score",
        "best": "Meilleur",
        "retry": "Réessayer",
        "explanation": "Utilisez <strong>les flèches</strong> ou <strong>glissez</strong> pour déplacer les tuiles. Les tuiles portant le même numéro fusionnent lorsqu'elles se touchent.",
        "404_title": "404 - Page non trouvée",
        "404_heading": "Page non trouvée",
        "404_desc": "Désolé, la page que vous recherchez n'existe pas. Elle a peut-être été déplacée ou supprimée.",
        "404_back": "Retour à l'accueil",
        "game_over": "Fin du jeu !"
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
