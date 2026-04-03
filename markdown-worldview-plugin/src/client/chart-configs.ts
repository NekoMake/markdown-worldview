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
        fontWeight: 600,
        fontFamily: 'inherit'
      },
      padding: [0, 0, 20, 0] // 增加下方留白
    } : undefined,

    // 提示框 (增加现代感阴影与圆角)
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: colors.border,
      textStyle: { color: colors.text },
      padding: [8, 12],
      borderRadius: 8,
      extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'
    },

    // 雷达图配置
    radar: {
      indicator: indicators,
      shape: 'polygon', // 多边形
      splitNumber: 4, // 减少同心圈层数，更加干净
      axisName: {
        color: colors.textMuted,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'inherit', // 继承外部系统字体
        padding: [3, 5]
      },
      splitLine: {
        lineStyle: {
          color: colors.border,
          width: 1,
          type: 'dashed' // 改为虚线
        }
      },
      splitArea: {
        show: false // 关闭背景交替填充色，追求极简
      },
      axisLine: {
        lineStyle: {
          color: colors.border,
          width: 1,
          type: 'dashed' // 轴心连线也改用轻量虚线
        }
      }
    },

    // 系列数据
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: data.title || '数据',
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: colors.primary,
          borderColor: '#fff', // 节点呈现外围描边，内部空白的高级感
          borderWidth: 2
        },
        areaStyle: {
          color: colors.primary,
          opacity: 0.15 // 动态透明度面填充，无需硬编码 RGBA
        },
        lineStyle: {
          color: colors.primary,
          width: 2,
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
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: colors.border,
      textStyle: { color: colors.text },
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
