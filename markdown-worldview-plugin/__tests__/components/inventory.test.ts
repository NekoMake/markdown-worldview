/**
 * Inventory Component Tests
 */

import { describe, it, expect } from 'vitest';
import { renderInventory } from '../../src/components/inventory';
import type { MarkdownWorldviewOptions } from '../../src/adapters/navigation';

describe('Inventory Component', () => {
  const defaultOptions: MarkdownWorldviewOptions = {
    debug: false,
    classPrefix: 'mw',
  };

  it('renders inventory with all fields', () => {
    const yaml = `
columns: 4
items:
  - name: 誓约之剑
    rarity: epic
    icon: /img/sword.png
    type: 武器
    desc: 传说中的名剑
    link: /wiki/sword
    amount: 1
  - name: 治愈药水
    rarity: common
    icon: /img/potion.png
    type: 消耗品
    amount: 12
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toContain('mw-inventory');
    expect(html).toContain('--columns: 4');
    expect(html).toContain('誓约之剑');
    expect(html).toContain('治愈药水');
    expect(html).toContain('data-rarity="epic"');
    expect(html).toContain('data-rarity="common"');
    expect(html).toContain('/img/sword.png');
    expect(html).toContain('/img/potion.png');
    expect(html).toContain('×12');
  });

  it('renders inventory with default columns', () => {
    const yaml = `
items:
  - name: 物品1
  - name: 物品2
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toContain('--columns: 4'); // 默认值
  });

  it('renders item with placeholder icon when icon is missing', () => {
    const yaml = `
items:
  - name: 无图标物品
    rarity: rare
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toContain('mw-inventory-icon-placeholder');
    expect(html).toContain('?');
  });

  it('applies rarity colors correctly', () => {
    const yaml = `
items:
  - name: 普通物品
    rarity: common
  - name: 稀有物品
    rarity: rare
  - name: 史诗物品
    rarity: epic
  - name: 传奇物品
    rarity: legendary
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toContain('data-rarity="common"');
    expect(html).toContain('data-rarity="rare"');
    expect(html).toContain('data-rarity="epic"');
    expect(html).toContain('data-rarity="legendary"');
  });

  it('defaults to common rarity when not specified', () => {
    const yaml = `
items:
  - name: 默认物品
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toContain('data-rarity="common"');
  });

  it('adds clickable class when link is present', () => {
    const yaml = `
items:
  - name: 可点击物品
    link: /wiki/item
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toContain('mw-clickable');
    expect(html).toContain('data-mw-link="/wiki/item"');
  });

  it('does not add clickable class without link', () => {
    const yaml = `
items:
  - name: 不可点击物品
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).not.toContain('mw-clickable');
    expect(html).not.toContain('data-mw-link');
  });

  it('renders amount badge only when amount > 1', () => {
    const yaml = `
items:
  - name: 单个物品
    amount: 1
  - name: 多个物品
    amount: 99
  - name: 无数量物品
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    // 单个物品不显示数量
    const singleItemMatch = html.indexOf('单个物品');
    const singleItemContext = html.substring(singleItemMatch, singleItemMatch + 200);
    expect(singleItemContext).not.toContain('×1');
    
    // 多个物品显示数量
    expect(html).toContain('×99');
    
    // 无数量物品不显示数量
    const noAmountMatch = html.indexOf('无数量物品');
    const noAmountContext = html.substring(noAmountMatch, noAmountMatch + 200);
    expect(noAmountContext).not.toContain('mw-inventory-amount');
  });

  it('creates tooltip with type and description', () => {
    const yaml = `
items:
  - name: 神秘宝箱
    type: 容器
    desc: 散发着神秘光芒的宝箱
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toContain('title="类型: 容器\n散发着神秘光芒的宝箱"');
  });

  it('creates tooltip with only description when type is missing', () => {
    const yaml = `
items:
  - name: 简单物品
    desc: 这是描述
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toContain('title="这是描述"');
  });

  it('creates tooltip with only name when desc and type are missing', () => {
    const yaml = `
items:
  - name: 极简物品
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toContain('title="极简物品"');
  });

  it('throws error when items is missing', () => {
    const yaml = `
columns: 4
`;
    
    const html = renderInventory(yaml, { ...defaultOptions, debug: true });
    
    expect(html).toContain('mw-error');
  });

  it('throws error when items is empty', () => {
    const yaml = `
items: []
`;
    
    const html = renderInventory(yaml, { ...defaultOptions, debug: true });
    
    expect(html).toContain('mw-error');
    expect(html).toContain('items 数组不能为空');
  });

  it('throws error when item is missing name', () => {
    const yaml = `
items:
  - rarity: epic
    desc: 缺少名称
`;
    
    const html = renderInventory(yaml, { ...defaultOptions, debug: true });
    
    expect(html).toContain('mw-error');
  });

  it('returns empty string in production mode on error', () => {
    const yaml = `
items: []
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).toBe('');
  });

  it('escapes HTML in name to prevent XSS', () => {
    const yaml = `
items:
  - name: "<script>alert('XSS')</script>"
`;
    
    const html = renderInventory(yaml, defaultOptions);
    
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
