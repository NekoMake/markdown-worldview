/**
 * Numerical Component Tests
 */

import { describe, it, expect } from 'vitest';
import { renderNumerical } from '../../src/components/numerical';
import type { MarkdownWorldviewOptions } from '../../src/adapters/navigation';

describe('Numerical Component', () => {
  const defaultOptions: MarkdownWorldviewOptions = {
    debug: false,
    classPrefix: 'mw',
  };

  it('renders numerical with all fields', () => {
    const yaml = `
title: 当前状态
items:
  - label: 生命值
    value: 85
    max: 100
    icon: ❤️
  - label: 以太存量
    value: 420
    max: 2000
    icon: ✨
`;
    
    const html = renderNumerical(yaml, defaultOptions);
    
    expect(html).toContain('mw-numerical');
    expect(html).toContain('当前状态');
    expect(html).toContain('生命值');
    expect(html).toContain('85 / 100');
    expect(html).toContain('以太存量');
    expect(html).toContain('420 / 2000');
    expect(html).toContain('❤️');
    expect(html).toContain('✨');
  });

  it('renders numerical without title', () => {
    const yaml = `
items:
  - label: HP
    value: 50
    max: 100
`;
    
    const html = renderNumerical(yaml, defaultOptions);
    
    expect(html).toContain('mw-numerical');
    expect(html).toContain('HP');
    expect(html).toContain('50 / 100');
    expect(html).not.toContain('mw-numerical-title');
  });

  it('renders progress bar with correct percentage', () => {
    const yaml = `
items:
  - label: 进度
    value: 75
    max: 100
`;
    
    const html = renderNumerical(yaml, defaultOptions);
    
    expect(html).toContain('--progress: 75.00');
    expect(html).toContain('mw-numerical-bar');
  });

  it('renders value only when max is not provided', () => {
    const yaml = `
items:
  - label: 金币
    value: 9999
`;
    
    const html = renderNumerical(yaml, defaultOptions);
    
    expect(html).toContain('金币');
    expect(html).toContain('9999</span>');
    expect(html).not.toContain('mw-numerical-bar');
    // No "value / max" format, just the value
    expect(html).not.toMatch(/\d+\s*\/\s*\d+/);
  });

  it('renders without icon', () => {
    const yaml = `
items:
  - label: 经验值
    value: 1500
    max: 2000
`;
    
    const html = renderNumerical(yaml, defaultOptions);
    
    expect(html).toContain('经验值');
    expect(html).toContain('1500 / 2000');
    expect(html).not.toContain('mw-numerical-icon');
  });

  it('handles multiple items', () => {
    const yaml = `
items:
  - label: HP
    value: 100
    max: 100
  - label: MP
    value: 50
    max: 100
  - label: SP
    value: 75
    max: 100
`;
    
    const html = renderNumerical(yaml, defaultOptions);
    
    expect(html).toContain('HP');
    expect(html).toContain('MP');
    expect(html).toContain('SP');
    expect(html).toContain('100 / 100');
    expect(html).toContain('50 / 100');
    expect(html).toContain('75 / 100');
  });

  it('clamps progress percentage to 0-100 range', () => {
    const yaml = `
items:
  - label: 超出
    value: 150
    max: 100
  - label: 负值
    value: -10
    max: 100
`;
    
    const html = renderNumerical(yaml, defaultOptions);
    
    // 超出应该被限制为 100%
    expect(html).toContain('--progress: 100.00');
    // 负值应该被限制为 0%
    expect(html).toContain('--progress: 0.00');
  });

  it('throws error when items is missing', () => {
    const yaml = `
title: 无数据
`;
    
    const html = renderNumerical(yaml, { ...defaultOptions, debug: true });
    
    expect(html).toContain('mw-error');
  });

  it('throws error when items is empty', () => {
    const yaml = `
items: []
`;
    
    const html = renderNumerical(yaml, { ...defaultOptions, debug: true });
    
    expect(html).toContain('mw-error');
    expect(html).toContain('不能为空');
  });

  it('skips invalid items when item is missing required fields', () => {
    const yaml = `
items:
  - label: 有效项
    value: 100
  - label: 仅有标签
`;
    
    const html = renderNumerical(yaml, { ...defaultOptions, debug: true });
    
    // Should render the valid item
    expect(html).toContain('有效项');
    expect(html).toContain('100');
    // Invalid item should be skipped, not cause error
    expect(html).not.toContain('仅有标签');
  });

  it('returns empty string in production mode on error', () => {
    const yaml = `
items: []
`;
    
    const html = renderNumerical(defaultOptions, defaultOptions);
    
    expect(html).toBe('');
  });
});
