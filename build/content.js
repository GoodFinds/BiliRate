'use strict';

/**
 * B站三连率计算器 - Chrome扩展版
 * 智能计算并展示B站视频的三连率（点赞、投币、收藏）数据
 * 
 * @author Your Name
 * @version 1.0.0
 * @license MIT
 */
(function() {
    // 配置常量
    const CONFIG = {
        UPDATE_INTERVAL: 3000, // 数据更新间隔(ms)
        DEBOUNCE_DELAY: 500,   // 防抖延迟(ms)
        PANEL_ID: 'bili-triple-rate-panel',
        CONTENT_ID: 'bili-triple-rate-content',
        STORAGE_KEY: 'panelVisible'
    };

    // 评级配置
    const RATING_CONFIG = [
        { threshold: 30, name: '爆款', color: '#FF0000' },
        { threshold: 20, name: '破圈', color: '#FF6600' },
        { threshold: 15, name: '很好', color: '#8A2BE2' },
        { threshold: 10, name: '还不错', color: '#0099FF' },
        { threshold: 5, name: '一般', color: '#333333' },
        { threshold: 0, name: '较差', color: '#999999' }
    ];

    // DOM选择器配置
    const SELECTORS = {
        likes: [
            '.video-like-info.video-toolbar-item-text',
            '.like span',
            '.like-info'
        ],
        coins: [
            '.video-coin-info.video-toolbar-item-text',
            '.coin span', 
            '.coin-info'
        ],
        favorites: [
            '.video-fav-info.video-toolbar-item-text',
            '.collect span',
            '.collect-info'
        ],
        views: [
            '.view-text',
            '.view-count',
            '.play-text', 
            '.view span'
        ]
    };

    // 全局状态
    let panelVisible = true;
    let lastUpdateTime = 0;
    let updateInterval = null;
    let urlObserver = null;

    /**
     * 解析包含中文单位的数字（万、亿等）
     * @param {string} text - 包含数字的文本
     * @returns {number} 解析后的数字
     */
    function parseNumberWithUnit(text) {
        if (!text || typeof text !== 'string') {
            return 0;
        }
        
        text = text.trim();
        
        try {
            // 处理亿级数字
            if (text.includes('亿')) {
                return parseFloat(text.replace('亿', '')) * 100000000;
            }
            
            // 处理万级数字
            if (text.includes('万')) {
                return parseFloat(text.replace('万', '')) * 10000;
            }
            
            // 直接转换数字
            return parseFloat(text) || 0;
        } catch (error) {
            console.warn('[三连率计算器] 数字解析失败:', text, error);
            return 0;
        }
    }

    /**
     * 尝试多种方式获取评论数
     * @returns {number} 评论数量，-1表示获取失败
     */
    function getCommentsCount() {
        try {
            // 方法1: 通过shadowRoot获取
            const commentElement = document.querySelector("#commentapp > bili-comments")
                ?.shadowRoot?.querySelector("#header > bili-comments-header-renderer")
                ?.shadowRoot?.querySelector("#count");
                
            if (commentElement) {
                return parseNumberWithUnit(commentElement.textContent);
            }
            
            // 方法2: 尝试获取常规DOM元素
            const regularSelectors = ['.total-reply', '.comment-total'];
            for (const selector of regularSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    return parseNumberWithUnit(element.textContent);
                }
            }
            
            // 方法3: 页面文本搜索（备用方案）
            const pageText = document.body.innerText;
            const commentMatch = pageText.match(/评论\s*(\d+[\.\d]*[万亿]?)/);
            if (commentMatch && commentMatch[1]) {
                return parseNumberWithUnit(commentMatch[1]);
            }
        } catch (error) {
            console.warn('[三连率计算器] 获取评论数量失败:', error);
        }
        
        return -1; // 获取失败
    }

    /**
     * 安全地获取元素文本
     * @param {string[]} selectors - 选择器数组
     * @returns {string} 元素文本内容
     */
    function getElementText(selectors) {
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.textContent.trim();
            }
        }
        return '';
    }

    /**
     * 根据三连率计算评级
     * @param {number} tripleRate - 三连率
     * @returns {object} 包含评级名称和颜色的对象
     */
    function calculateRating(tripleRate) {
        for (const config of RATING_CONFIG) {
            if (tripleRate > config.threshold) {
                return {
                    name: config.name,
                    color: config.color
                };
            }
        }
        return {
            name: '未知',
            color: '#333333'
        };
    }

    /**
     * 格式化数字显示
     * @param {number} num - 要格式化的数字
     * @returns {string} 格式化后的字符串
     */
    function formatNumber(num) {
        if (num === -1) return '加载中';
        if (num === 0) return '0';
        
        if (num >= 100000000) {
            return (num / 100000000).toFixed(1) + '亿';
        }
        
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        
        return num.toLocaleString();
    }

    /**
     * 计算三连率并显示
     */
    function calculateTripleRate() {
        try {
            // 防抖处理
            const currentTime = Date.now();
            if (currentTime - lastUpdateTime < CONFIG.DEBOUNCE_DELAY) {
                return;
            }
            lastUpdateTime = currentTime;
            
            // 获取互动数据
            const likesText = getElementText(SELECTORS.likes);
            const coinsText = getElementText(SELECTORS.coins);
            const favoritesText = getElementText(SELECTORS.favorites);
            const viewText = getElementText(SELECTORS.views);
            
            // 解析数字
            const likes = parseNumberWithUnit(likesText);
            const coins = parseNumberWithUnit(coinsText);
            const favorites = parseNumberWithUnit(favoritesText);
            const views = parseNumberWithUnit(viewText);
            const commentsCount = getCommentsCount();
            
            // 检查播放量是否获取成功
            if (!views) {
                console.log('[三连率计算器] 播放量数据无法获取，稍后重试');
                return;
            }
            
            // 计算三连率
            const tripleRate = ((likes + coins + favorites) / views * 100).toFixed(2);
            
            // 计算互动率
            const interactionRate = commentsCount > 0 ? 
                ((commentsCount / views) * 100).toFixed(2) : "无法计算";
            
            // 获取评级
            const rating = calculateRating(parseFloat(tripleRate));
            
            // 更新或创建面板
            updateOrCreatePanel({
                likes,
                coins,
                favorites,
                views,
                commentsCount,
                tripleRate,
                interactionRate,
                rating: rating.name,
                color: rating.color
            });
            
        } catch (error) {
            console.error('[三连率计算器] 计算三连率时出错:', error);
        }
    }

    /**
     * 创建或更新显示面板
     * @param {object} data - 要显示的数据
     */
    function updateOrCreatePanel(data) {
        let panel = document.getElementById(CONFIG.PANEL_ID);
        
        if (!panel) {
            panel = createPanel();
        }
        
        // 更新面板内容
        const content = document.getElementById(CONFIG.CONTENT_ID);
        if (content) {
            content.innerHTML = generatePanelHTML(data);
        }
    }

    /**
     * 创建面板元素
     * @returns {HTMLElement} 创建的面板元素
     */
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = CONFIG.PANEL_ID;
        panel.style.cssText = `
            position: fixed;
            top: 180px;
            right: 20px;
            background-color: rgba(255, 255, 255, 0.95);
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 1px solid #e1e8ed;
            z-index: 10000;
            font-family: "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
            line-height: 1.4;
            color: #333;
            min-width: 200px;
            backdrop-filter: blur(10px);
        `;
        
        // 创建标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-weight: bold;
            color: #fb7299;
        `;
        
        const title = document.createElement('span');
        title.textContent = "三连率数据";
        
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '—';
        toggleBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #fb7299;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        toggleBtn.onclick = togglePanel;
        
        const helpBtn = document.createElement("button");
        helpBtn.textContent = "?";
        helpBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 12px;
            color: #fb7299;
            padding: 0;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 4px;
            opacity: 0.7;
        `;
        helpBtn.onclick = showHelpTooltip;
        helpBtn.title = "点击查看计算公式";

        header.appendChild(title);
        header.appendChild(helpBtn);
        header.appendChild(toggleBtn);
        
        // 创建内容区域
        const content = document.createElement('div');
        content.id = CONFIG.CONTENT_ID;
        
        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);
        
        return panel;
    }

    function generatePanelHTML(data) {
        return `
            <div style="margin-bottom: 12px;">
                <!-- 核心数据区域 -->
                <div style="background: linear-gradient(135deg, #fff8f8 0%, #fff5f5 100%); padding: 8px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #ffe7e7;">
                    <div style="text-align: center; margin-bottom: 6px;">
                        <div style="font-size: 18px; font-weight: bold; color: ${data.color}; margin-bottom: 2px;">
                            ${data.tripleRate}%
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            📊 三连率
                        </div>
                    </div>
                    <div style="text-align: center; padding: 4px 0; ">
                        <span style="font-size: 14px; font-weight: bold; color: ${data.color};">
                            🏆 ${data.rating}
                        </span>
                    </div>
                </div>
                
                <!-- 详细数据区域 -->
                <div style="font-size: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px; padding: 2px 0;">
                        <span style="color: #666;">👍 点赞</span>
                        <span style="font-weight: 500;">${formatNumber(data.likes)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px; padding: 2px 0;">
                        <span style="color: #666;">🪙 投币</span>
                        <span style="font-weight: 500;">${formatNumber(data.coins)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px; padding: 2px 0;">
                        <span style="color: #666;">⭐ 收藏</span>
                        <span style="font-weight: 500;">${formatNumber(data.favorites)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px; padding: 2px 0; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px;">
                        <span style="color: #666;">📺 播放</span>
                        <span style="font-weight: 500;">${formatNumber(data.views)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px; padding: 2px 0;">
                        <span style="color: #666;">💬 评论</span>
                        <span style="font-weight: 500;">${formatNumber(data.commentsCount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span style="color: #666;">💭 互动率</span>
                        <span style="font-weight: 500;">${data.interactionRate}${typeof data.interactionRate === 'string' ? '' : '%'}</span>
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * 显示帮助提示
     */
    function showHelpTooltip() {
        // 移除已存在的提示
        const existingTooltip = document.getElementById("bili-rate-help-tooltip");
        if (existingTooltip) {
            existingTooltip.remove();
            return;
        }
        
        const tooltip = document.createElement("div");
        tooltip.id = "bili-rate-help-tooltip";
        tooltip.style.cssText = `
            position: fixed;
            top: 220px;
            right: 240px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            line-height: 1.4;
            z-index: 10001;
            max-width: 250px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        tooltip.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px; color: #fb7299;">📊 计算公式</div>
            <div style="margin-bottom: 6px;">
                <strong>三连率</strong> = (点赞 + 投币 + 收藏) ÷ 播放量 × 100%
            </div>
            <div style="margin-bottom: 6px;">
                <strong>互动率</strong> = 评论数 ÷ 播放量 × 100%
            </div>
            <div style="font-size: 11px; color: #ccc; margin-top: 8px; border-top: 1px solid #555; padding-top: 6px;">
                💡 三连率越高说明视频质量越好
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (tooltip && tooltip.parentNode) {
                tooltip.remove();
            }
        }, 5000);
    }

    function togglePanel() {
        const panel = document.getElementById(CONFIG.PANEL_ID);
        const content = document.getElementById(CONFIG.CONTENT_ID);
        const toggleBtn = panel?.querySelector('button');
        
        if (panelVisible) {
            content.style.display = 'none';
            toggleBtn.textContent = '+';
            panel.style.padding = '8px 12px';
        } else {
            content.style.display = 'block';
            toggleBtn.textContent = '—';
            panel.style.padding = '12px';
        }
        
        panelVisible = !panelVisible;
        
        // 保存用户设置
        chrome.storage.local.set({ [CONFIG.STORAGE_KEY]: panelVisible });
    }

    /**
     * 清理资源
     */
    function cleanup() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
        
        if (urlObserver) {
            urlObserver.disconnect();
            urlObserver = null;
        }
        
        const oldPanel = document.getElementById(CONFIG.PANEL_ID);
        if (oldPanel) {
            oldPanel.remove();
        }
    }

    /**
     * 初始化扩展
     */
    function initialize() {
        console.log('[三连率计算器] 开始初始化...');
        
        // 从存储中恢复设置
        chrome.storage.local.get(CONFIG.STORAGE_KEY, function(result) {
            if (result.hasOwnProperty(CONFIG.STORAGE_KEY)) {
                panelVisible = result[CONFIG.STORAGE_KEY];
                
                // 如果设置为隐藏，在初始化后应用
                if (!panelVisible) {
                    setTimeout(() => {
                        const content = document.getElementById(CONFIG.CONTENT_ID);
                        const panel = document.getElementById(CONFIG.PANEL_ID);
                        const toggleBtn = panel?.querySelector('button');
                        
                        if (content) content.style.display = 'none';
                        if (toggleBtn) toggleBtn.textContent = '+';
                        if (panel) panel.style.padding = '8px 12px';
                    }, 1000);
                }
            }
        });
        
        // 延迟启动，确保页面元素加载完成
        setTimeout(() => {
            calculateTripleRate();
            
            // 设置定时更新
            updateInterval = setInterval(calculateTripleRate, CONFIG.UPDATE_INTERVAL);
            
            // 监听URL变化（B站单页应用）
            let lastUrl = location.href;
            urlObserver = new MutationObserver(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    console.log('[三连率计算器] 检测到页面切换，重新初始化...');
                    
                    cleanup();
                    
                    // 重新初始化
                    setTimeout(() => {
                        calculateTripleRate();
                        updateInterval = setInterval(calculateTripleRate, CONFIG.UPDATE_INTERVAL);
                    }, 1500);
                }
            });
            
            urlObserver.observe(document, { subtree: true, childList: true });
            
        }, 2000);
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', cleanup);
    
    // 启动扩展
    initialize();
    
})();
