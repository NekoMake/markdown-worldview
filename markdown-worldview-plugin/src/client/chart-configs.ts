/**
 * 图表配置构建器
 * 
 * 将 YAML 数据转换为 ECharts 配置对象，
 * 统一处理主题适配和样式。
 */

import type { EChartsOption } from 'echarts';

/**
 * Radar 图表数据接口
 */
export interface RadarData {
  title?: string;
  description?: string;
  data: Record<string, number>;
}

/**
 * Power 图表数据接口
 */
export interface PowerData {
  data: Record<string, number | [number, string]>;
}

/**
 * 获取 CSS 变量的计算值
 * 
 * @param varName - CSS 变量名（包括 --）
 * @param fallback - 如果获取失败使用的默认值
 * @returns CSS 变量的实际值
 */
function getCSSVariable(varName: string, fallback: string): string {
  if (typeof window === 'undefined') {
    return fallback;
  }
  
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  
  return value || fallback;
}

/**
 * 获取主题颜色
 */
function getThemeColors() {
  return {
    primary: getCSSVariable('--mw-primary-color', '#2563eb'),
    text: getCSSVariable('--mw-text-color', '#1f2937'),
    textMuted: getCSSVariable('--mw-text-muted', '#6b7280'),
    border: getCSSVariable('--mw-border-color', '#e5e7eb'),
    tooltipBg: getCSSVariable('--mw-tooltip-bg', 'rgba(255, 255, 255, 0.95)'),
    tooltipText: getCSSVariable('--mw-tooltip-text', '#1f2937'),
    tooltipBorder: getCSSVariable('--mw-tooltip-border', '#e5e7eb'),
  };
}

/**
 * 构建 Radar（雷达图）配置
 * 
 * @param data - Radar 组件的 YAML 数据
 * @returns ECharts 雷达图配置
 */
export function buildRadarConfig(data: RadarData): EChartsOption {
  const colors = getThemeColors();
  
  // 构建指标数组
  const indicators = Object.keys(data.data).map((name) => ({
    name,
    max: 100 // 默认最大值为 100
  }));

  // 提取数值数组
  const values = Object.values(data.data);

  return {
    // 标题和副标题 - 左对齐，字体增大
    title: data.title ? {
      text: data.title,
      subtext: data.description || '',
      left: 'left',
      textStyle: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 600,
        fontFamily: 'inherit'
      },
      subtextStyle: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'inherit'
      },
      padding: [8, 0, 16, 12], // 优化留白
      itemGap: 6 // 标题和副标题之间的间距
    } : undefined,

    // 提示框 - 增大字体
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { 
        color: colors.tooltipText,
        fontSize: 14
      },
      padding: [10, 14],
      borderRadius: 8,
      extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'
    },

    // 雷达图配置
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 5, // 增加层数以显示更详细的刻度
      center: ['50%', '55%'], // 向下微调，为标题留出空间
      radius: '65%', // 稍微缩小以留出更多边距
      axisName: {
        color: colors.textMuted,
        fontSize: 14, // 增大维度标签字体
        fontWeight: 500,
        fontFamily: 'inherit',
        padding: [3, 5]
      },
      axisLabel: {
        show: true, // 显示刻度标签
        color: colors.textMuted,
        fontSize: 6,
        formatter: '{value}' // 显示数值
      },
      splitLine: {
        lineStyle: {
          color: colors.border,
          width: 1.5,
          type: 'dashed'
        }
      },
      splitArea: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: colors.border,
          width: 1.5,
          type: 'solid' // 改为实线，增强视觉效果
        }
      }
    },

    // 系列数据 - 增强线条和节点，添加数据标签
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: data.title || '数据',
        symbol: 'circle',
        symbolSize: 8, // 增大节点
        itemStyle: {
          color: colors.primary,
          borderColor: '#fff',
          borderWidth: 2.5, // 增强节点描边
          shadowBlur: 4, // 添加阴影效果
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        },
        label: {
          show: false // 不显示数据点标签，只保留边缘刻度
        },
        areaStyle: {
          color: colors.primary,
          opacity: 0.18 // 稍微增加填充透明度
        },
        lineStyle: {
          color: colors.primary,
          width: 2.5, // 增粗线条
          type: 'solid'
        }
      }]
    }]
  };
}

/**
 * 构建 Power（势力面板）柱状图配置
 * 
 * @param data - Power 组件的数据部分
 * @returns ECharts 柱状图配置
 */
export function buildPowerConfig(data: PowerData): EChartsOption {
  const colors = getThemeColors();
  
  // 提取类目和数值
  const categories = Object.keys(data.data);
  const values = Object.values(data.data).map(v =>
    Array.isArray(v) ? v[0] : v
  );

  return {
    // 网格配置: 交给 ECharts 自动计算防止 Label 遮挡
    grid: {
      left: '3%',
      right: '8%',
      top: '5%',
      bottom: '3%',
      containLabel: true
    },

    // 提示框
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      textStyle: { color: colors.tooltipText },
      padding: [8, 12],
      borderRadius: 8
    },

    // X 轴（数值轴）
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        show: false // 隐藏刻线
      },
      axisTick: {
        show: false // 隐藏刻度小尾巴
      },
      axisLabel: {
        color: colors.textMuted,
        fontFamily: 'inherit'
      },
      splitLine: {
        lineStyle: {
          color: colors.border,
          type: 'dashed'
        }
      }
    },

    // Y 轴（类目轴）
    yAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        show: false // 左侧大粗线隐藏
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: colors.text,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'inherit',
        padding: [0, 8, 0, 0] // 增加与数据条距间的留白
      }
    },

    // 系列数据
    series: [{
      type: 'bar',
      data: values,
      barWidth: 16, // 固定柱子粗细，使得布局统一
      showBackground: true, // 显示柱槽背景
      backgroundStyle: {
        color: colors.border,
        opacity: 0.2,
        borderRadius: [0, 8, 8, 0] 
      },
      itemStyle: {
        color: colors.primary,
        borderRadius: [0, 8, 8, 0], // 拉高圆角
        shadowColor: 'rgba(0, 0, 0, 0.1)', // 微弱发光
        shadowBlur: 4,
        shadowOffsetY: 2
      },
      label: {
        show: true,
        position: 'right',
        color: colors.primary, // 标签文字跟随主题色
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'inherit',
        formatter: '{c}',
        distance: 8
      }
    }]
  };
}
