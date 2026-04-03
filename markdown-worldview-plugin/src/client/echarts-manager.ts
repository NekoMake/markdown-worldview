/**
 * ECharts 实例管理器
 * 
 * 负责：
 * - 懒加载 ECharts 库（按需导入，只在首次需要时加载）
 * - 管理页面上所有图表实例的生命周期
 * - 自动处理响应式调整（ResizeObserver）
 * - 提供统一的销毁/清理接口
 */

import type * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { buildRadarConfig, buildPowerConfig, type RadarData, type PowerData } from './chart-configs';

/**
 * 图表数据接口
 */
export interface ChartData {
  type: string;
  [key: string]: unknown;
}

/**
 * ECharts 管理器类
 */
class EChartsManager {
  /** ECharts 库加载 Promise（缓存，避免重复加载） */
  private echartsPromise: Promise<typeof echarts> | null = null;

  /** 页面上所有图表实例的 Map */
  private instances = new Map<HTMLElement, echarts.ECharts>();

  /** ResizeObserver 实例（监听容器尺寸变化） */
  private resizeObserver: ResizeObserver | null = null;

  /**
   * 获取 ECharts 库（首次调用时动态加载）
   * 
   * 使用按需导入策略，只加载需要的组件：
   * - RadarChart（雷达图）
   * - BarChart（柱状图）
   * - GridComponent（坐标系）
   * - TooltipComponent（提示框）
   * - CanvasRenderer（Canvas 渲染器）
   */
  async getECharts(): Promise<typeof echarts> {
    if (!this.echartsPromise) {
      this.echartsPromise = this.loadECharts();
    }
    return this.echartsPromise;
  }

  /**
   * 动态加载 ECharts 库和组件
   */
  private async loadECharts(): Promise<typeof echarts> {
    console.log('[MarkdownWorldview] 开始加载 ECharts...');
    try {
      // 动态导入 ECharts 核心
      console.log('[MarkdownWorldview] 导入 echarts/core...');
      const { use } = await import('echarts/core');

      // 按需导入图表组件
      console.log('[MarkdownWorldview] 导入图表组件...');
      const { RadarChart, BarChart } = await import('echarts/charts');

      // 导入坐标系和其他组件
      console.log('[MarkdownWorldview] 导入其他组件...');
      const { GridComponent, TooltipComponent, TitleComponent } = await import('echarts/components');

      // 导入渲染器
      console.log('[MarkdownWorldview] 导入渲染器...');
      const { CanvasRenderer } = await import('echarts/renderers');

      // 注册组件
      console.log('[MarkdownWorldview] 注册 ECharts 组件...');
      use([
        RadarChart,
        BarChart,
        GridComponent,
        TooltipComponent,
        TitleComponent,
        CanvasRenderer
      ]);

      // 返回 echarts 对象
      console.log('[MarkdownWorldview] 导入 echarts 主模块...');
      const echartsModule = await import('echarts');
      console.log('[MarkdownWorldview] ✅ ECharts 加载成功');
      return echartsModule;
    } catch (error) {
      console.error('[MarkdownWorldview] Failed to load ECharts:', error);
      throw new Error('Failed to load ECharts library. Make sure echarts is installed.');
    }
  }

  /**
   * 初始化单个图表
   * 
   * @param container - 图表容器 DOM 元素
   * @param config - ECharts 配置对象
   */
  async initChart(container: HTMLElement, config: EChartsOption): Promise<void> {
    console.log('[MarkdownWorldview] 初始化图表容器:', container);
    try {
      console.log('[MarkdownWorldview] 获取 ECharts 实例...');
      const echarts = await this.getECharts();

      // 清空加载占位符
      console.log('[MarkdownWorldview] 清空加载占位符...');
      container.innerHTML = '';

      // 初始化图表实例
      console.log('[MarkdownWorldview] 初始化图表...', config);
      const chart = echarts.init(container);
      chart.setOption(config);
      console.log('[MarkdownWorldview] ✅ 图表初始化成功');

      // 保存实例引用
      this.instances.set(container, chart);

      // 监听容器尺寸变化
      if (!this.resizeObserver) {
        this.resizeObserver = new ResizeObserver(() => this.resizeAll());
      }
      this.resizeObserver.observe(container);
    } catch (error) {
      console.error('[MarkdownWorldview] Failed to initialize chart:', error);
      // 显示错误消息（仅在容器内）
      container.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #dc2626;
          font-size: 0.875rem;
        ">
          图表加载失败
        </div>
      `;
    }
  }

  /**
   * 扫描页面并初始化所有图表
   * 
   * 查找所有带 [data-mw-chart-type] 属性的容器，
   * 读取其 [data-mw-chart-config] 数据并初始化图表
   */
  async initializePageCharts(): Promise<void> {
    console.log('[MarkdownWorldview] 扫描页面图表容器...');
    const containers = document.querySelectorAll<HTMLElement>('[data-mw-chart-type]');
    console.log(`[MarkdownWorldview] 找到 ${containers.length} 个图表容器`);

    for (const container of containers) {
      console.log('[MarkdownWorldview] 处理容器:', container);
      // 跳过已初始化的图表
      if (this.instances.has(container)) {
        continue;
      }

      const type = container.dataset.mwChartType;
      const configJson = container.dataset.mwChartConfig;
      console.log(`[MarkdownWorldview] 图表类型: ${type}`);
      console.log(`[MarkdownWorldview] 配置数据: ${configJson?.substring(0, 100)}...`);

      if (!type || !configJson) {
        console.warn('[MarkdownWorldview] ⚠️ Chart container missing type or config:', container);
        continue;
      }

      try {
        // 解析 JSON 配置
        console.log('[MarkdownWorldview] 解析 JSON 配置...');
        const data = JSON.parse(configJson);
        console.log('[MarkdownWorldview] 解析后的数据:', data);

        // 根据类型构建 ECharts 配置
        console.log(`[MarkdownWorldview] 构建 ${type} 图表配置...`);
        const config = this.buildChartConfig(type, data);

        // 初始化图表
        console.log('[MarkdownWorldview] 开始初始化图表...');
        await this.initChart(container, config);
      } catch (error) {
        console.error('[MarkdownWorldview] ❌ 图表配置解析或初始化失败:', error);
        console.error('[MarkdownWorldview] 错误堆栈:', error instanceof Error ? error.stack : error);
      }
    }
    console.log('[MarkdownWorldview] 所有图表处理完成');
  }

  /**
   * 调整所有图表尺寸
   */
  resizeAll(): void {
    this.instances.forEach(chart => {
      chart.resize();
    });
  }

  /**
   * 销毁所有图表实例并清理资源
   */
  destroyAll(): void {
    // 销毁所有图表实例
    this.instances.forEach(chart => {
      chart.dispose();
    });

    // 清空实例 Map
    this.instances.clear();

    // 断开 ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  /**
   * 根据类型构建 ECharts 配置
   * 
   * @param type - 图表类型（'radar' 或 'power'）
   * @param data - YAML 解析后的数据
   * @returns ECharts 配置对象
   */
  private buildChartConfig(type: string, data: ChartData): EChartsOption {
    switch (type) {
      case 'radar':
        return buildRadarConfig(data as unknown as RadarData);
      case 'power':
        return buildPowerConfig(data as unknown as PowerData);
      default:
        throw new Error(`Unknown chart type: ${type}`);
    }
  }
}

// 导出单例
export const echartsManager = new EChartsManager();
