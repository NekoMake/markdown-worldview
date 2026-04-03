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
    // 标题
    title: data.title ? {
      text: data.title,
      left: 'center',
      textStyle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 600
      }
    } : undefined,

    // 提示框
    tooltip: {
      trigger: 'item'
    },

    // 雷达图配置
    radar: {
      indicator: indicators,
      shape: 'polygon', // 多边形
      splitNumber: 5, // 分割段数
      axisName: {
        color: colors.text,
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: colors.border
        }
      },
      splitArea: {
        areaStyle: {
          color: [
            'rgba(37, 99, 235, 0.05)',
            'rgba(37, 99, 235, 0.1)'
          ]
        }
      },
      axisLine: {
        lineStyle: {
          color: colors.border
        }
      }
    },

    // 系列数据
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: data.title || '数据',
        areaStyle: {
          color: 'rgba(37, 99, 235, 0.2)'
        },
        lineStyle: {
          color: colors.primary,
          width: 2
        },
        itemStyle: {
          color: colors.primary
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
    // 网格配置
    grid: {
      left: '20%',
      right: '10%',
      top: '10%',
      bottom: '10%'
    },

    // 提示框
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },

    // X 轴（数值轴）
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        lineStyle: {
          color: colors.border
        }
      },
      axisLabel: {
        color: colors.textMuted
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
        lineStyle: {
          color: colors.border
        }
      },
      axisLabel: {
        color: colors.text,
        fontSize: 13
      }
    },

    // 系列数据
    series: [{
      type: 'bar',
      data: values,
      barWidth: '50%',
      itemStyle: {
        color: colors.primary,
        borderRadius: [0, 4, 4, 0] // 右侧圆角
      },
      label: {
        show: true,
        position: 'right',
        color: colors.textMuted,
        fontSize: 12,
        formatter: '{c}'
      }
    }]
  };
}
