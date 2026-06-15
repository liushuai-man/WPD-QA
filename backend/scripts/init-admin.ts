import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDefaultAdmin() {
  try {
    console.log('🔍 检查是否已存在管理员...');
    
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      console.log('✅ 管理员已存在，无需创建');
      process.exit(0);
    }

    console.log('📝 创建默认管理员...');
    
    // 创建默认管理员（明文密码用于测试，生产环境应使用 bcrypt）
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        passwordHash: 'admin123', // 明文密码，用于测试
        role: 'admin',
      },
    });

    console.log(`🎉 默认管理员创建成功！`);
    console.log(`   - ID: ${admin.id}`);
    console.log(`   - 用户名: ${admin.username}`);
    console.log(`   - 角色: ${admin.role}`);
    console.log('');
    console.log('⚠️  注意：生产环境请修改默认密码！');

    process.exit(0);
  } catch (error) {
    console.error('❌ 创建管理员失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultAdmin();
