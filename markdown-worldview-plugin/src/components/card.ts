/**
 * Card Component Renderer
 * 
 * 渲染人物、组织或地点的介绍卡片
 */

import { parseYAML, validateRequiredFields, escapeHtml, sanitizePath } from '../parser/yaml-parser';
import type { PluginOptions } from '../adapters/navigation';

/**
 * Card 组件数据接口
 */
export interface CardData {
  name: string;              // 必填：名称
  avatar?: string;           // 可选：头像 URL
  description?: string;      // 可选：描述
  dictum?: string;           // 可选：引言/格言
  tags?: string[];           // 可选：标签列表
  link?: string;             // 可选：点击跳转链接
}

/**
 * 渲染 Card 组件
 * 
 * @param content - YAML 内容字符串
 * @param options - 插件选项
 * @returns HTML 字符串
 */
export function renderCard(content: string, options: PluginOptions): string {
  try {
    // 解析 YAML
    const data = parseYAML<CardData>(content, 'card');
    
    // 验证必填字段
    validateRequiredFields(data as unknown as Record<string, unknown>, ['name'], 'card');
    
    // 安全处理数据
    const name = escapeHtml(data.name);
    const description = data.description ? escapeHtml(data.description) : null;
    const dictum = data.dictum ? escapeHtml(data.dictum) : null;
    const avatar = data.avatar ? sanitizePath(data.avatar) : null;
    const link = data.link ? sanitizePath(data.link) : null;
    const tags = data.tags || [];
    
    // 构建 CSS 类名
    const hasLink = !!link;
    const cardClasses = ['mw-card'];
    if (hasLink) {
      cardClasses.push('mw-clickable');
    }
    
    // 构建 HTML
    let html = `<div class="${cardClasses.join(' ')}"`;
    
    // 如果有链接，添加 data 属性（客户端可以监听点击事件）
    if (hasLink) {
      html += ` data-mw-link="${link}"`;
    }
    
    html += '>';
    
    // 头像（如果有）
    if (avatar) {
      html += `<img class="mw-card-avatar" src="${avatar}" alt="${name}" />`;
    }
    
    // 卡片主体
    html += '<div class="mw-card-body">';
    
    // 名称（标题）
    html += `<h3 class="mw-card-name">${name}</h3>`;
    
    // 描述（如果有）
    if (description) {
      html += `<p class="mw-card-desc">${description}</p>`;
    }
    
    // 引言（如果有）
    if (dictum) {
      html += `<blockquote class="mw-card-dictum">"${dictum}"</blockquote>`;
    }
    
    // 标签（如果有）
    if (tags.length > 0) {
      html += '<div class="mw-card-tags">';
      for (const tag of tags) {
        const safeTag = escapeHtml(tag);
        html += `<span class="mw-badge">${safeTag}</span>`;
      }
      html += '</div>';
    }
    
    html += '</div>'; // .mw-card-body
    html += '</div>'; // .mw-card
    
    return html;
  } catch (error) {
    // 错误处理
    if (options.debug) {
      return `
<div class="mw-card mw-error">
  <p><strong>Card 组件错误:</strong> ${escapeHtml(String(error))}</p>
  <pre>${escapeHtml(content)}</pre>
</div>`;
    }
    return ''; // 生产模式下静默失败
  }
}
