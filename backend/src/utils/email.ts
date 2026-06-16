import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailFrom = process.env.EMAIL_FROM;
const emailService = process.env.EMAIL_SERVICE || 'qq';

if (!emailUser || !emailPass || !emailFrom) {
  console.error('邮件服务配置不完整，请检查以下环境变量：');
  console.error('- EMAIL_USER: ', emailUser || '未设置');
  console.error('- EMAIL_PASS: ', emailPass ? '已设置' : '未设置');
  console.error('- EMAIL_FROM: ', emailFrom || '未设置');
}

const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export const sendVerificationEmail = async (email: string, code: string) => {
  if (!emailUser || !emailPass || !emailFrom) {
    throw new Error('邮件服务配置不完整');
  }

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: '【小麦病虫害智能问答平台】验证码',
    html: `
      <div style="max-width: 400px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <div style="background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">小麦病虫害智能问答平台</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">您好，您正在进行身份验证，请在 5 分钟内使用以下验证码完成操作：</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">如非本人操作，请忽略此邮件</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error('发送邮件失败:', error.message);
    throw new Error('发送邮件失败，请稍后重试');
  }
};

export const sendPasswordResetEmail = async (email: string, code: string) => {
  if (!emailUser || !emailPass || !emailFrom) {
    throw new Error('邮件服务配置不完整');
  }

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: '【小麦病虫害智能问答平台】密码重置',
    html: `
      <div style="max-width: 400px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <div style="background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">小麦病虫害智能问答平台</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">您好，您正在重置密码，请在 5 分钟内使用以下验证码完成操作：</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">如非本人操作，请忽略此邮件</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error('发送邮件失败:', error.message);
    throw new Error('发送邮件失败，请稍后重试');
  }
};