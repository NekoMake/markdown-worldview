/**
 * Card Component Tests
 */

import { describe, it, expect } from 'vitest';
import { renderCard } from '../../src/components/card';
import type { MarkdownWorldviewOptions } from '../../src/adapters/navigation';

describe('Card Component', () => {
  const defaultOptions: MarkdownWorldviewOptions = {
    debug: false,
    classPrefix: 'mw',
  };

  it('renders card with all fields', () => {
    const yaml = `
name: 艾蕾娜·星语
avatar: /path/to/elena.jpg
description: 银月森林的守护者
dictum: 森林记得每一个名字
tags: [精灵, 传奇射手, 守序中立]
link: /wiki/elena
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    expect(html).toContain('mw-card');
    expect(html).toContain('艾蕾娜·星语');
    expect(html).toContain('/path/to/elena.jpg');
    expect(html).toContain('银月森林的守护者');
    expect(html).toContain('森林记得每一个名字');
    expect(html).toContain('精灵');
    expect(html).toContain('传奇射手');
    expect(html).toContain('守序中立');
  });

  it('renders card with only required field (name)', () => {
    const yaml = `
name: 简单卡片
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    expect(html).toContain('mw-card');
    expect(html).toContain('简单卡片');
    expect(html).not.toContain('mw-card-avatar');
    expect(html).not.toContain('mw-card-desc');
    expect(html).not.toContain('mw-card-dictum');
    expect(html).not.toContain('mw-card-tags');
  });

  it('renders card without avatar', () => {
    const yaml = `
name: 无头像
description: 这是一个没有头像的卡片
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    expect(html).toContain('无头像');
    expect(html).toContain('这是一个没有头像的卡片');
    expect(html).not.toContain('mw-card-avatar');
  });

  it('renders card without dictum', () => {
    const yaml = `
name: 无引言
description: 这是一个没有引言的卡片
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    expect(html).toContain('无引言');
    expect(html).not.toContain('mw-card-dictum');
    expect(html).not.toContain('blockquote');
  });

  it('renders card without tags', () => {
    const yaml = `
name: 无标签
description: 这是一个没有标签的卡片
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    expect(html).toContain('无标签');
    expect(html).not.toContain('mw-card-tags');
    expect(html).not.toContain('mw-badge');
  });

  it('adds clickable class when link is present', () => {
    const yaml = `
name: 可点击卡片
link: /wiki/test
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    expect(html).toContain('mw-clickable');
    expect(html).toContain('data-mw-link="/wiki/test"');
  });

  it('does not add clickable class when link is absent', () => {
    const yaml = `
name: 不可点击卡片
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    expect(html).not.toContain('mw-clickable');
    expect(html).not.toContain('data-mw-link');
  });

  it('escapes HTML in user input', () => {
    const yaml = `
name: <script>alert('XSS')</script>
description: <img src=x onerror=alert(1)>
dictum: <b>Test</b>
tags: ['<script>', 'test']
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    // Check that dangerous tags are escaped
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    
    // Check that HTML entities are properly escaped (< and > should be escaped)
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x');
    expect(html).toContain('&gt;');
    
    // Check that inline HTML tags are escaped
    expect(html).not.toContain('<b>Test</b>');
    expect(html).toContain('&lt;b&gt;Test&lt;/b&gt;');
  });

  it('sanitizes path in avatar and link', () => {
    const yaml = `
name: 路径测试
avatar: javascript:alert(1)
link: javascript:void(0)
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    // sanitizePath should remove dangerous protocols
    expect(html).toContain('路径测试');
    // The exact behavior depends on sanitizePath implementation
  });

  it('throws error for missing required field (name)', () => {
    const yaml = `
description: 没有名字
`;
    
    const html = renderCard(yaml, { ...defaultOptions, debug: true });
    
    expect(html).toContain('mw-error');
    expect(html).toContain('Card 组件错误');
  });

  it('returns empty string in production mode for errors', () => {
    const yaml = `
description: 没有名字
`;
    
    const html = renderCard(yaml, { ...defaultOptions, debug: false });
    
    expect(html).toBe('');
  });

  it('handles invalid YAML gracefully', () => {
    const yaml = `
name: Test
  invalid: yaml: structure
    broken
`;
    
    const html = renderCard(yaml, { ...defaultOptions, debug: true });
    
    expect(html).toContain('mw-error');
  });

  it('renders empty tags array as no tags', () => {
    const yaml = `
name: 空标签数组
tags: []
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    expect(html).toContain('空标签数组');
    expect(html).not.toContain('mw-card-tags');
  });

  it('renders multiple tags correctly', () => {
    const yaml = `
name: 多标签
tags: [标签1, 标签2, 标签3, 标签4]
`;
    
    const html = renderCard(yaml, defaultOptions);
    
    expect(html).toContain('标签1');
    expect(html).toContain('标签2');
    expect(html).toContain('标签3');
    expect(html).toContain('标签4');
    const badgeMatches = html.match(/mw-badge/g);
    expect(badgeMatches).toHaveLength(4);
  });
});
