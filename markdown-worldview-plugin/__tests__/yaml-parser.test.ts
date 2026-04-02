import { describe, it, expect } from 'vitest';
import { parseYAML, validateRequiredFields, validateFieldType, YAMLParseError } from '../src/parser/yaml-parser';

describe('YAML 解析器', () => {
  describe('parseYAML', () => {
    it('应该解析有效的 YAML', () => {
      const yaml = `
title: Test Component
data:
  field1: value1
  field2: value2
`;
      const result = parseYAML(yaml, 'test');
      expect(result).toEqual({
        title: 'Test Component',
        data: {
          field1: 'value1',
          field2: 'value2',
        },
      });
    });

    it('应该为空内容抛出错误', () => {
      expect(() => parseYAML('', 'test')).toThrow(YAMLParseError);
      expect(() => parseYAML('   ', 'test')).toThrow(YAMLParseError);
    });

    it('应该为无效 YAML 抛出错误', () => {
      const invalidYaml = 'invalid: yaml: content:';
      expect(() => parseYAML(invalidYaml, 'test')).toThrow(YAMLParseError);
    });

    it('应该为非对象结果抛出错误', () => {
      expect(() => parseYAML('just a string', 'test')).toThrow(YAMLParseError);
      expect(() => parseYAML('123', 'test')).toThrow(YAMLParseError);
    });
  });

  describe('validateRequiredFields', () => {
    it('应该通过所有必填字段存在的验证', () => {
      const data = { name: 'John', age: 30, city: 'NYC' };
      expect(() => validateRequiredFields(data, ['name', 'age'], 'test')).not.toThrow();
    });

    it('应该为缺少必填字段抛出错误', () => {
      const data = { name: 'John' };
      expect(() => validateRequiredFields(data, ['name', 'age'], 'test')).toThrow(YAMLParseError);
    });
  });

  describe('validateFieldType', () => {
    const data: Record<string, unknown> = {
      name: 'John',
      age: 30,
      tags: ['tag1', 'tag2'],
      metadata: { key: 'value' },
    };

    it('应该验证 string 类型', () => {
      expect(() => validateFieldType(data, 'name', 'string', 'test')).not.toThrow();
    });

    it('应该验证 number 类型', () => {
      expect(() => validateFieldType(data, 'age', 'number', 'test')).not.toThrow();
    });

    it('应该验证 array 类型', () => {
      expect(() => validateFieldType(data, 'tags', 'array', 'test')).not.toThrow();
    });

    it('应该验证 object 类型', () => {
      expect(() => validateFieldType(data, 'metadata', 'object', 'test')).not.toThrow();
    });

    it('应该为错误类型抛出错误', () => {
      expect(() => validateFieldType(data, 'name', 'number', 'test')).toThrow(YAMLParseError);
      expect(() => validateFieldType(data, 'age', 'string', 'test')).toThrow(YAMLParseError);
    });

    it('应该跳过不存在的字段的验证', () => {
      expect(() => validateFieldType(data, 'nonexistent', 'string', 'test')).not.toThrow();
    });
  });
});
