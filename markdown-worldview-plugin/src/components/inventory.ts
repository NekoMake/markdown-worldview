/**
 * Inventory Component Renderer
 * 
 * 渲染物品/装备网格
 */

import { parseYAML, validateRequiredFields, escapeHtml, sanitizePath, validateFieldType } from '../parser/yaml-parser';
import type { MarkdownWorldviewOptions } from '../adapters/navigation';

/**
 * 物品数据接口
 */
export interface InventoryItem {
  name: string;          // 物品名称
  rarity?: string;       // 稀有度（common/rare/epic/legendary）
  icon?: string;         // 图标 URL
  type?: string;         // 物品类型（如"武器"、"消耗品"）
  desc?: string;         // 描述
  link?: string;         // 点击跳转链接
  amount?: number;       // 数量
}

/**
 * Inventory 组件数据接口
 */
export interface InventoryData {
  columns?: number;              // 列数（默认 4）
  items: InventoryItem[];       // 必填：物品列表
}

/**
 * 渲染 Inventory 组件
 * 
 * @param content - YAML 内容字符串
 * @param options - 插件选项
 * @returns HTML 字符串
 */
export function renderInventory(content: string, options: MarkdownWorldviewOptions): string {
  try {
    // 解析 YAML
    const data = parseYAML<InventoryData>(content, 'inventory');
    
    // 验证必填字段
    validateRequiredFields(data as unknown as Record<string, unknown>, ['items'], 'inventory');
    validateFieldType(data as unknown as Record<string, unknown>, 'items', 'array', 'inventory');
    
    // 安全处理数据
    const columns = data.columns || 4;
    const items = data.items || [];
    
    if (items.length === 0) {
      throw new Error('items 数组不能为空');
    }
    
    // 构建 HTML
    let html = `<div class="mw-inventory" style="--columns: ${columns}">`;
    
    // 渲染每个物品
    for (const item of items) {
      // 验证必填字段
      if (!item.name) {
        throw new Error('items 中的每一项必须包含 name');
      }
      
      const name = escapeHtml(item.name);
      const rarity = item.rarity ? escapeHtml(item.rarity) : 'common';
      const icon = item.icon ? sanitizePath(item.icon) : null;
      const type = item.type ? escapeHtml(item.type) : null;
      const desc = item.desc ? escapeHtml(item.desc) : null;
      const link = item.link ? sanitizePath(item.link) : null;
      const amount = item.amount !== undefined ? Number(item.amount) : null;
      
      // 构建物品容器类名
      const itemClasses = ['mw-inventory-item'];
      if (link) {
        itemClasses.push('mw-clickable');
      }
      
      // 构建 tooltip
      const tooltipParts: string[] = [];
      if (type) tooltipParts.push(`类型: ${type}`);
      if (desc) tooltipParts.push(desc);
      const tooltip = tooltipParts.length > 0 ? tooltipParts.join('\n') : name;
      
      // 渲染物品卡片
      html += `<div class="${itemClasses.join(' ')}" data-rarity="${rarity}"`;
      
      if (link) {
        html += ` data-mw-link="${link}"`;
      }
      
      html += ` title="${tooltip}">`;
      
      // 图标（如果有）
      if (icon) {
        html += `<img class="mw-inventory-icon" src="${icon}" alt="${name}" />`;
      } else {
        // 无图标时显示占位符
        html += '<div class="mw-inventory-icon-placeholder">?</div>';
      }
      
      // 物品名称
      html += `<span class="mw-inventory-name">${name}</span>`;
      
      // 数量徽章（如果有）
      if (amount !== null && amount > 1) {
        html += `<span class="mw-inventory-amount">×${amount}</span>`;
      }
      
      html += '</div>'; // .mw-inventory-item
    }
    
    html += '</div>'; // .mw-inventory
    
    return html;
  } catch (error) {
    // 错误处理
    if (options.debug) {
      return `
<div class="mw-inventory mw-error">
  <p><strong>Inventory 组件错误:</strong> ${escapeHtml(String(error))}</p>
  <pre>${escapeHtml(content)}</pre>
</div>`;
    }
    return ''; // 生产模式下静默失败
  }
}
