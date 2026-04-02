/**
 * YAML 解析工具
 * 
 * 为组件数据提供安全的 YAML 解析和验证功能。
 */

import { load as yamlLoad } from 'js-yaml';

/**
 * 解析错误类
 */
export class YAMLParseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'YAMLParseError';
  }
}

/**
 * 安全解析 YAML 内容
 * 
 * @param content - 要解析的 YAML 字符串
 * @param componentType - 组件类型名称（用于错误消息）
 * @returns 解析后的数据对象
 * @throws {YAMLParseError} 如果解析失败
 */
export function parseYAML<T = Record<string, unknown>>(
  content: string,
  componentType: string
): T {
  if (!content || content.trim() === '') {
    throw new YAMLParseError(
      `[${componentType}] Empty YAML content`
    );
  }

  try {
    const data = yamlLoad(content) as T;
    
    if (!data || typeof data !== 'object') {
      throw new YAMLParseError(
        `[${componentType}] YAML must be an object, got: ${typeof data}`
      );
    }

    return data;
  } catch (error) {
    if (error instanceof YAMLParseError) {
      throw error;
    }
    
    throw new YAMLParseError(
      `[${componentType}] Failed to parse YAML: ${(error as Error).message}`,
      error as Error
    );
  }
}

/**
 * 验证组件数据中的必填字段
 * 
 * @param data - 解析后的数据对象
 * @param requiredFields - 必填字段名称数组
 * @param componentType - 组件类型名称（用于错误消息）
 * @throws {YAMLParseError} 如果验证失败
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[],
  componentType: string
): void {
  const missingFields = requiredFields.filter(field => !(field in data));
  
  if (missingFields.length > 0) {
    throw new YAMLParseError(
      `[${componentType}] Missing required fields: ${missingFields.join(', ')}`
    );
  }
}

/**
 * 验证字段类型
 * 
 * @param data - 数据对象
 * @param field - 字段名称
 * @param expectedType - 预期类型（'string', 'number', 'object', 'array'）
 * @param componentType - 组件类型名称
 * @throws {YAMLParseError} 如果类型验证失败
 */
export function validateFieldType(
  data: Record<string, unknown>,
  field: string,
  expectedType: 'string' | 'number' | 'object' | 'array',
  componentType: string
): void {
  if (!(field in data)) {
    return; // 如果字段不存在则跳过（使用 validateRequiredFields 验证必填字段）
  }

  const value = data[field];
  let isValid = false;

  switch (expectedType) {
    case 'string':
      isValid = typeof value === 'string';
      break;
    case 'number':
      isValid = typeof value === 'number';
      break;
    case 'object':
      isValid = typeof value === 'object' && value !== null && !Array.isArray(value);
      break;
    case 'array':
      isValid = Array.isArray(value);
      break;
  }

  if (!isValid) {
    throw new YAMLParseError(
      `[${componentType}] Field "${field}" must be of type ${expectedType}, got: ${typeof value}`
    );
  }
}

/**
 * 转义 HTML 以防止 XSS 攻击
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 清理链接路径以防止 XSS 攻击
 */
export function sanitizePath(path: string): string {
  // 移除危险协议
  if (path.match(/^(javascript|data|vbscript):/i)) {
    return '#';
  }
  return path;
}
