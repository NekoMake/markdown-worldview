import { describe, it, expect, beforeEach } from 'vitest';
import MarkdownIt from 'markdown-it';
import { markdownWorldviewPlugin } from '../src/index';

describe('Markdown-Worldview 插件', () => {
  let md: MarkdownIt;

  beforeEach(() => {
    md = new MarkdownIt();
    md.use(markdownWorldviewPlugin, {
      debug: false,
    });
  });

  it('应该注册插件', () => {
    expect(md.renderer.rules.fence).toBeDefined();
  });

  it('应该渲染 card 组件', () => {
    const markdown = `
\`\`\`card
name: Test Character
description: A test character
\`\`\`
`;
    const html = md.render(markdown);
    expect(html).toContain('mw-card');
    expect(html).toContain('Test Character');
    expect(html).toContain('A test character');
  });

  it('应该渲染 radar 组件占位符', () => {
    const markdown = `
\`\`\`radar
title: Test Radar
data:
  Strength: 80
  Speed: 60
\`\`\`
`;
    const html = md.render(markdown);
    expect(html).toContain('mw-radar');
    expect(html).toContain('data-mw-chart-type="radar"');
    expect(html).toContain('Test Radar');  // title 应该在配置中
  });

  it('应该渲染所有已实现的组件类型', () => {
    const testCases = {
      card: 'name: Test Card\ndescription: Test Description',
      numerical: 'items:\n  - label: Test\n    value: 100',
      inventory: 'items:\n  - name: Item1\n    quantity: 5',
      radar: 'data:\n  攻击力: 80\n  防御力: 90',
      power: 'faction: 测试势力\ndata:\n  军事: 85\n  经济: 70'
    };

    Object.entries(testCases).forEach(([component, data]) => {
      const markdown = `
\`\`\`${component}
${data}
\`\`\`
`;
      const html = md.render(markdown);
      console.log(`\n=== ${component} 组件输出 ===`);
      console.log(html);
      console.log(`包含 mw-${component}? ${html.includes(`mw-${component}`)}`);
      expect(html).toContain(`mw-${component}`);
    });
  });

  it('不应干扰普通代码块', () => {
    const markdown = `
\`\`\`javascript
console.log('test');
\`\`\`
`;
    const html = md.render(markdown);
    expect(html).toContain('<code');
    expect(html).toContain('console.log');
    expect(html).not.toContain('mw-');
  });

  it('在调试模式应优雅地处理无效 YAML', () => {
    md = new MarkdownIt();
    md.use(markdownWorldviewPlugin, { debug: true });

    const markdown = `
\`\`\`card
invalid yaml content: : :
\`\`\`
`;
    const html = md.render(markdown);
    expect(html).toContain('mw-error');
  });

  it('在生产模式应隐藏错误', () => {
    md = new MarkdownIt();
    md.use(markdownWorldviewPlugin, { debug: false });

    const markdown = `
\`\`\`card
invalid yaml content: : :
\`\`\`
`;
    const html = md.render(markdown);
    expect(html.trim()).toBe('');
  });
});
