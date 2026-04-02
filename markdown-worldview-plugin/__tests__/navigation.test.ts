import { describe, it, expect } from 'vitest';
import { mergeOptions, createNavigationHandler } from '../src/adapters/navigation';

describe('导航适配器', () => {
  describe('mergeOptions', () => {
    it('未提供用户选项时应使用默认选项', () => {
      const options = mergeOptions();
      expect(options.debug).toBe(false);
      expect(options.classPrefix).toBe('mw');
      expect(typeof options.onNavigate).toBe('function');
    });

    it('应该将用户选项与默认选项合并', () => {
      const userNavigate = () => {};
      const options = mergeOptions({
        debug: true,
        onNavigate: userNavigate,
      });
      expect(options.debug).toBe(true);
      expect(options.onNavigate).toBe(userNavigate);
      expect(options.classPrefix).toBe('mw'); // 默认值
    });

    it('应该覆盖所有选项', () => {
      const userNavigate = () => {};
      const options = mergeOptions({
        debug: true,
        onNavigate: userNavigate,
        classPrefix: 'custom',
      });
      expect(options.debug).toBe(true);
      expect(options.onNavigate).toBe(userNavigate);
      expect(options.classPrefix).toBe('custom');
    });
  });

  describe('createNavigationHandler', () => {
    it('应该创建调用 onNavigate 的点击处理器', () => {
      let capturedPath = '';
      const onNavigate = (event: { path: string }) => {
        capturedPath = event.path;
      };

      const handler = createNavigationHandler('/wiki/test', onNavigate);
      const mockEvent = {
        preventDefault: () => {},
        currentTarget: document.createElement('div'),
      } as unknown as MouseEvent;

      handler(mockEvent);
      expect(capturedPath).toBe('/wiki/test');
    });
  });
});
