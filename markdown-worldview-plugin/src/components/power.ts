/**
 * Power Component Renderer (服务端渲染器)
 * 
 * 渲染势力综测面板组件，包含：
 * - 头部信息（纯 CSS，服务端渲染）
 * - ECharts 柱状图容器（客户端渲染）
 * - 趋势指示器（纯 CSS，服务端渲染）
 */

import { parseYAML, validateRequiredFields, escapeHtml } from '../parser/yaml-parser';
import type { MarkdownWorldviewOptions } from '../adapters/navigation';

/**
 * Power 组件数据接口
 */
export interface PowerData {
  faction: string;                                   // 必填：势力名称
  leader?: string;                                   // 可选：领袖
  status?: string;                                   // 可选：状态（战争状态、和平时期等）
  meta?: Record<string, string>;                     // 可选：其他自定义信息键值对
  data: Record<string, number | [number, string]>;   // 必填：数值数据
  trend?: Record<string, 'rising' | 'stable' | 'falling'>;  // 可选：趋势
}

/**
 * 状态映射到 CSS 类
 */
const STATUS_MAP: Record<string, string> = {
  '战争状态': 'neg',
  '和平时期': 'pos',
  '中立': 'neu',
  '危机': 'neg',
  '繁荣': 'pos',
  '稳定': 'neu'
};

/**
 * 趋势图标映射
 */
const TREND_ICONS: Record<string, string> = {
  'rising': '↑',
  'stable': '→',
  'falling': '↓'
};

/**
 * 渲染 Power 组件
 * 
 * @param content - YAML 内容字符串
 * @param options - 插件选项
 * @returns HTML 字符串
 */
export function renderPower(content: string, options: MarkdownWorldviewOptions): string {
  try {
    // 解析 YAML
    const data = parseYAML<PowerData>(content, 'power');
    
    // 验证必填字段
    validateRequiredFields(data as unknown as Record<string, unknown>, ['faction', 'data'], 'power');
    
    // 验证 data 是否为对象
    if (typeof data.data !== 'object' || data.data === null || Array.isArray(data.data)) {
      throw new Error('Power component: "data" must be an object');
    }
    
    // 安全处理文本
    const faction = escapeHtml(data.faction);
    const leader = data.leader ? escapeHtml(data.leader) : null;
    const status = data.status ? escapeHtml(data.status) : null;
    
    // 确定状态对应的 CSS 类
    let statusClass = 'mw-status-neu'; // 默认中立
    if (status) {
      for (const [keyword, type] of Object.entries(STATUS_MAP)) {
        if (status.includes(keyword)) {
          statusClass = `mw-status-${type}`;
          break;
        }
      }
    }
    
    // 处理数值数据（提取纯数字用于图表）
    const chartData: Record<string, number> = {};
    for (const [key, value] of Object.entries(data.data)) {
      if (Array.isArray(value)) {
        chartData[key] = value[0];
      } else if (typeof value === 'number') {
        chartData[key] = value;
      } else {
        throw new Error(`Power component: value for "${key}" must be a number or [number, string]`);
      }
      
      // 验证范围
      if (chartData[key] < 0 || chartData[key] > 100) {
        throw new Error(`Power component: value for "${key}" must be between 0 and 100`);
      }
    }
    
    // 序列化图表配置
    const configJson = JSON.stringify({ data: chartData });
    const configJsonEscaped = configJson
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;');
    
    // 构建 HTML
    let html = '<div class="mw-power">';
    
    // === 头部信息（纯 CSS） ===
    html += '<div class="mw-power-header">';
    
    // 左侧：名称与状态
    html += '<div class="mw-power-title-group">';
    html += `<h3 class="mw-power-faction">${faction}</h3>`;
    
    // 状态标签
    if (status) {
      html += `<div class="mw-power-status ${statusClass}">${status}</div>`;
    }
    html += '</div>'; // end .mw-power-title-group
    
    // 右侧：领袖等附加数据
    html += '<div class="mw-power-meta-group">';
    if (leader) {
      html += `<span class="mw-power-leader">领袖：${leader}</span>`;
    }
    
    // 自定义其他信息键值对
    if (data.meta && typeof data.meta === 'object' && !Array.isArray(data.meta)) {
      for (const [key, val] of Object.entries(data.meta)) {
        html += `<span class="mw-power-extra">${escapeHtml(key)}：${escapeHtml(String(val))}</span>`;
      }
    }
    
    html += '</div>'; // end .mw-power-meta-group
    
    html += '</div>'; // end .mw-power-header
    
    // === ECharts 柱状图容器 ===
    html += `
<div 
  class="mw-chart mw-chart-power"
  data-mw-chart-type="power"
  data-mw-chart-config="${configJsonEscaped}"
  style="height: 300px;"
>
  <div class="mw-chart-loading">加载中...</div>
</div>`;
    
    // === 趋势指示器（纯 CSS） ===
    if (data.trend && Object.keys(data.trend).length > 0) {
      html += '<div class="mw-power-trend">';
      
      for (const [label, trend] of Object.entries(data.trend)) {
        const icon = TREND_ICONS[trend] || '?';
        const trendClass = `mw-trend-${trend}`;
        
        html += `
<span class="mw-trend-item">
  <span class="mw-trend-label">${escapeHtml(label)}</span>
  <span class="mw-trend-icon ${trendClass}">${icon}</span>
</span>`;
      }
      
      html += '</div>'; // end .mw-power-trend
    }
    
    html += '</div>'; // end .mw-power
    
    return html.trim();
    
  } catch (error) {
    // 错误处理
    if (options.debug) {
      const message = error instanceof Error ? error.message : String(error);
      return `
<div class="mw-error">
  <strong>Power 组件渲染错误</strong>
  <pre>${escapeHtml(message)}</pre>
</div>`.trim();
    }
    
    // 生产模式静默失败
    return '';
  }
}
