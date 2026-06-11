import Joi from 'joi';

export const emailSchema = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'cn', 'net', 'org'] } })
  .required()
  .messages({
    'string.email': '请输入有效的邮箱地址',
    'any.required': '请输入邮箱',
  });

export const passwordSchema = Joi.string().min(6).max(32).required().messages({
  'string.min': '密码长度至少6位',
  'string.max': '密码长度不能超过32位',
  'any.required': '请输入密码',
});

export const codeSchema = Joi.string()
  .length(6)
  .pattern(/^[0-9]+$/)
  .required()
  .messages({
    'string.length': '验证码必须是6位数字',
    'string.pattern.base': '验证码只能包含数字',
    'any.required': '请输入验证码',
  });

export const nicknameSchema = Joi.string().min(2).max(20).required().messages({
  'string.min': '昵称长度至少2个字符',
  'string.max': '昵称长度不能超过20个字符',
  'any.required': '请输入昵称',
});

export const validate = async <T>(
  schema: Joi.Schema,
  data: T
): Promise<{ error?: string; value?: T }> => {
  try {
    const result = await schema.validateAsync(data);
    return { value: result };
  } catch (err: any) {
    return { error: err.details[0].message };
  }
};

export const validateEmail = async (email: string) => {
  return validate(emailSchema, email);
};

export const validatePassword = async (password: string) => {
  return validate(passwordSchema, password);
};

export const validateCode = async (code: string) => {
  return validate(codeSchema, code);
};

export const validateNickname = async (nickname: string) => {
  return validate(nicknameSchema, nickname);
};
