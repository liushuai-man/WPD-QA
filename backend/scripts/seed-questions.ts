import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  {
    title: '小麦赤霉病主要危害小麦的哪个部位？',
    options: ['根部', '茎部', '叶片', '穗部'],
    answer: 'D',
    analysis: '小麦赤霉病主要危害小麦的穗部，导致穗腐。发病初期，在小穗和颖片上出现水渍状淡褐色病斑，后期产生粉红色霉层。',
    difficulty: 1,
  },
  {
    title: '小麦白粉病的病原菌属于哪一类真菌？',
    options: ['担子菌', '子囊菌', '半知菌', '接合菌'],
    answer: 'B',
    analysis: '小麦白粉病的病原菌是禾本科布氏白粉菌，属于子囊菌亚门真菌。主要危害叶片，严重时也危害茎秆和穗部。',
    difficulty: 2,
  },
  {
    title: '小麦纹枯病主要发生在小麦的哪个生育期？',
    options: ['苗期', '拔节期', '抽穗期', '灌浆期'],
    answer: 'B',
    analysis: '小麦纹枯病主要发生在拔节期，病菌从基部叶鞘侵入，逐渐向上扩展，形成云纹状病斑，严重时导致茎秆折断。',
    difficulty: 1,
  },
  {
    title: '以下哪种药剂是防治小麦锈病的常用药剂？',
    options: ['多菌灵', '三唑酮', '百菌清', '代森锰锌'],
    answer: 'B',
    analysis: '三唑酮是防治小麦锈病的常用药剂，属于三唑类杀菌剂，具有内吸性，对锈病有较好的防治效果。',
    difficulty: 1,
  },
  {
    title: '小麦蚜虫属于哪种口器类型？',
    options: ['咀嚼式口器', '刺吸式口器', '虹吸式口器', '锉吸式口器'],
    answer: 'B',
    analysis: '小麦蚜虫属于刺吸式口器，通过吸食小麦汁液造成危害，导致叶片发黄、植株衰弱，还能传播病毒病。',
    difficulty: 2,
  },
  {
    title: '小麦红蜘蛛的最佳防治时期是？',
    options: ['出苗期', '越冬前', '返青期', '拔节期'],
    answer: 'B',
    analysis: '小麦红蜘蛛的最佳防治时期是越冬前，此时虫口密度较低，防治效果好，能有效减少来年虫源基数。',
    difficulty: 2,
  },
  {
    title: '小麦吸浆虫主要危害小麦的哪个部位？',
    options: ['叶片', '茎秆', '麦穗', '根部'],
    answer: 'C',
    analysis: '小麦吸浆虫主要危害小麦的麦穗，幼虫吸食麦粒汁液，导致麦粒瘪小、空壳，严重影响产量。',
    difficulty: 1,
  },
  {
    title: '以下哪种害虫属于地下害虫？',
    options: ['蚜虫', '红蜘蛛', '蛴螬', '吸浆虫'],
    answer: 'C',
    analysis: '蛴螬是金龟子的幼虫，属于地下害虫，主要危害小麦根部，导致植株生长衰弱甚至死亡。',
    difficulty: 1,
  },
  {
    title: '小麦黄矮病是由什么传播的？',
    options: ['真菌', '细菌', '病毒', '线虫'],
    answer: 'C',
    analysis: '小麦黄矮病是由大麦黄矮病毒引起的，主要通过蚜虫传播，病株表现为叶片黄化、植株矮化。',
    difficulty: 2,
  },
  {
    title: '小麦丛矮病的症状特点是？',
    options: ['叶片发黄', '植株矮化丛生', '穗部畸形', '根部腐烂'],
    answer: 'B',
    analysis: '小麦丛矮病由病毒引起，症状特点是植株明显矮化，分蘖增多呈丛生状，叶片黄绿相间条纹。',
    difficulty: 2,
  },
  {
    title: '小麦全蚀病主要危害小麦的哪个部位？',
    options: ['叶片', '茎秆', '根部', '穗部'],
    answer: 'C',
    analysis: '小麦全蚀病主要危害小麦根部和茎基部，导致根系腐烂，植株早衰，形成"白穗"，严重影响产量。',
    difficulty: 2,
  },
  {
    title: '防治小麦全蚀病的最佳措施是？',
    options: ['药剂喷雾', '轮作倒茬', '增施氮肥', '浇水灌溉'],
    answer: 'B',
    analysis: '轮作倒茬是防治小麦全蚀病最有效的措施，与非禾本科作物轮作可显著降低土壤中病菌数量。',
    difficulty: 2,
  },
  {
    title: '小麦腥黑穗病的传播途径主要是？',
    options: ['种子传播', '土壤传播', '气流传播', '雨水传播'],
    answer: 'A',
    analysis: '小麦腥黑穗病主要通过种子传播，病菌以厚垣孢子附着在种子表面或混入种子中进行传播。',
    difficulty: 1,
  },
  {
    title: '小麦秆黑粉病的症状主要表现在？',
    options: ['叶片', '茎秆', '穗部', '根部'],
    answer: 'B',
    analysis: '小麦秆黑粉病主要危害茎秆和叶鞘，形成银灰色隆起条斑，内有黑粉孢子，导致茎秆弯曲、折断。',
    difficulty: 2,
  },
  {
    title: '小麦叶枯病的病原菌属于？',
    options: ['真菌', '细菌', '病毒', '线虫'],
    answer: 'A',
    analysis: '小麦叶枯病由真菌引起，主要危害叶片，形成椭圆形或不规则形病斑，严重时叶片枯死。',
    difficulty: 1,
  },
  {
    title: '以下哪种是小麦蚜虫的天敌？',
    options: ['瓢虫', '蜘蛛', '草蛉', '以上都是'],
    answer: 'D',
    analysis: '瓢虫、蜘蛛、草蛉都是小麦蚜虫的天敌，它们能有效控制蚜虫种群数量，是生物防治的重要力量。',
    difficulty: 1,
  },
  {
    title: '小麦黏虫属于哪种害虫？',
    options: ['咀嚼式害虫', '刺吸式害虫', '钻蛀性害虫', '地下害虫'],
    answer: 'A',
    analysis: '小麦黏虫属于咀嚼式害虫，幼虫取食小麦叶片，严重时可将叶片吃光，造成严重减产。',
    difficulty: 1,
  },
  {
    title: '小麦棉铃虫主要危害小麦的哪个部位？',
    options: ['叶片', '茎秆', '麦穗', '根部'],
    answer: 'C',
    analysis: '小麦棉铃虫主要危害小麦麦穗，幼虫蛀入麦穗取食麦粒，造成麦粒缺损、空壳，影响产量和品质。',
    difficulty: 2,
  },
  {
    title: '小麦病毒病的主要传播媒介是？',
    options: ['蚜虫', '红蜘蛛', '飞虱', '线虫'],
    answer: 'A',
    analysis: '蚜虫是小麦病毒病的主要传播媒介，许多病毒病如黄矮病、丛矮病等都通过蚜虫传播。',
    difficulty: 1,
  },
  {
    title: '小麦根腐病的主要症状是？',
    options: ['叶片发黄', '根部腐烂', '穗部畸形', '茎秆折断'],
    answer: 'B',
    analysis: '小麦根腐病主要危害根部，导致根系腐烂变黑，植株生长衰弱，后期可能形成白穗。',
    difficulty: 1,
  },
  {
    title: '小麦霜霉病的病原菌属于？',
    options: ['真菌', '细菌', '卵菌', '病毒'],
    answer: 'C',
    analysis: '小麦霜霉病由卵菌引起，属于鞭毛菌亚门，主要危害叶片，形成黄色条纹，潮湿时产生白色霉层。',
    difficulty: 2,
  },
  {
    title: '以下哪种药剂可用于防治小麦细菌性条斑病？',
    options: ['多菌灵', '链霉素', '三唑酮', '百菌清'],
    answer: 'B',
    analysis: '链霉素是抗生素类杀菌剂，可用于防治小麦细菌性条斑病，对细菌有较好的抑制作用。',
    difficulty: 2,
  },
  {
    title: '小麦颖枯病主要危害小麦的哪个部位？',
    options: ['叶片', '茎秆', '颖壳', '根部'],
    answer: 'C',
    analysis: '小麦颖枯病主要危害小麦颖壳，形成褐色病斑，严重时导致籽粒发育不良，影响产量和品质。',
    difficulty: 2,
  },
  {
    title: '小麦秆锈病的夏孢子堆特点是？',
    options: ['小而密集', '大而稀疏', '椭圆形', '圆形'],
    answer: 'B',
    analysis: '小麦秆锈病的夏孢子堆较大且稀疏，颜色为橙红色，主要发生在茎秆和叶鞘上。',
    difficulty: 2,
  },
  {
    title: '小麦条锈病的夏孢子堆特点是？',
    options: ['条形排列', '圆形散生', '椭圆形', '不规则形'],
    answer: 'A',
    analysis: '小麦条锈病的夏孢子堆呈条形排列，颜色为鲜黄色，主要发生在叶片上，呈虚线状排列。',
    difficulty: 2,
  },
  {
    title: '小麦叶锈病的夏孢子堆特点是？',
    options: ['条形', '圆形', '椭圆形', '不规则形'],
    answer: 'B',
    analysis: '小麦叶锈病的夏孢子堆呈圆形或近圆形，颜色为橘红色，主要发生在叶片上，散生分布。',
    difficulty: 2,
  },
  {
    title: '小麦白粉病的发生条件是？',
    options: ['高温高湿', '低温高湿', '高温干燥', '低温干燥'],
    answer: 'B',
    analysis: '小麦白粉病在低温高湿条件下易发生，适宜温度为15-20℃，相对湿度在70%以上时病害发展迅速。',
    difficulty: 1,
  },
  {
    title: '小麦赤霉病的发生条件是？',
    options: ['高温高湿', '低温高湿', '高温干燥', '低温干燥'],
    answer: 'A',
    analysis: '小麦赤霉病在高温高湿条件下易发生，尤其是在小麦抽穗扬花期，连续阴雨天气有利于病害流行。',
    difficulty: 1,
  },
  {
    title: '小麦蚜虫的发生高峰期通常在？',
    options: ['苗期', '返青期', '拔节期', '灌浆期'],
    answer: 'D',
    analysis: '小麦蚜虫的发生高峰期通常在小麦灌浆期，此时小麦营养丰富，有利于蚜虫繁殖。',
    difficulty: 1,
  },
  {
    title: '小麦红蜘蛛的发生条件是？',
    options: ['高温高湿', '低温干旱', '高温干燥', '低温高湿'],
    answer: 'B',
    analysis: '小麦红蜘蛛在低温干旱条件下易发生，适宜温度为8-15℃，相对湿度低于60%时危害严重。',
    difficulty: 2,
  },
  {
    title: '小麦吸浆虫的发生与什么因素关系最大？',
    options: ['温度', '湿度', '光照', '土壤'],
    answer: 'B',
    analysis: '小麦吸浆虫的发生与湿度关系最大，尤其是在小麦抽穗期，降雨多、湿度大有利于成虫羽化和产卵。',
    difficulty: 2,
  },
  {
    title: '小麦黏虫的迁飞特性是？',
    options: ['季节性迁飞', '无规律迁飞', '不迁飞', '随机迁飞'],
    answer: 'A',
    analysis: '小麦黏虫具有季节性迁飞特性，每年春季从南方迁飞到北方，秋季又迁回南方越冬。',
    difficulty: 2,
  },
  {
    title: '小麦棉铃虫的越冬场所是？',
    options: ['土壤', '秸秆', '种子', '杂草'],
    answer: 'A',
    analysis: '小麦棉铃虫以蛹在土壤中越冬，来年春季羽化出土，成为第一代成虫。',
    difficulty: 1,
  },
  {
    title: '小麦病毒病的预防措施主要是？',
    options: ['药剂防治', '选用抗病品种', '加强肥水管理', '及时除草'],
    answer: 'B',
    analysis: '选用抗病品种是预防小麦病毒病最有效的措施，结合防治传毒媒介可进一步降低发病风险。',
    difficulty: 1,
  },
  {
    title: '小麦全蚀病的病原菌是？',
    options: ['真菌', '细菌', '病毒', '线虫'],
    answer: 'A',
    analysis: '小麦全蚀病由真菌引起，属于子囊菌亚门，病菌在土壤中存活时间较长，难以防治。',
    difficulty: 1,
  },
  {
    title: '小麦腥黑穗病的防治措施主要是？',
    options: ['种子处理', '土壤消毒', '药剂喷雾', '轮作倒茬'],
    answer: 'A',
    analysis: '种子处理是防治小麦腥黑穗病最有效的措施，通过药剂拌种可杀死种子表面的病菌。',
    difficulty: 1,
  },
  {
    title: '小麦秆黑粉病的防治措施主要是？',
    options: ['种子处理', '土壤消毒', '药剂喷雾', '轮作倒茬'],
    answer: 'A',
    analysis: '种子处理是防治小麦秆黑粉病的关键措施，选用抗病品种和药剂拌种可有效控制病害发生。',
    difficulty: 1,
  },
  {
    title: '小麦叶枯病的防治措施主要是？',
    options: ['种子处理', '药剂喷雾', '合理密植', '及时排水'],
    answer: 'B',
    analysis: '药剂喷雾是防治小麦叶枯病的主要措施，在发病初期及时喷施杀菌剂可有效控制病害发展。',
    difficulty: 1,
  },
  {
    title: '小麦霜霉病的防治措施主要是？',
    options: ['种子处理', '药剂喷雾', '加强通风', '合理施肥'],
    answer: 'B',
    analysis: '药剂喷雾是防治小麦霜霉病的有效措施，选用针对卵菌的杀菌剂如甲霜灵等进行防治。',
    difficulty: 2,
  },
  {
    title: '小麦细菌性条斑病的防治措施主要是？',
    options: ['种子处理', '药剂喷雾', '轮作倒茬', '选用抗病品种'],
    answer: 'D',
    analysis: '选用抗病品种是防治小麦细菌性条斑病最有效的措施，同时结合种子处理和药剂防治可提高效果。',
    difficulty: 2,
  },
  {
    title: '小麦颖枯病的防治措施主要是？',
    options: ['种子处理', '药剂喷雾', '合理密植', '及时收获'],
    answer: 'B',
    analysis: '药剂喷雾是防治小麦颖枯病的主要措施，在小麦抽穗期和灌浆期进行药剂防治效果较好。',
    difficulty: 2,
  },
  {
    title: '以下哪种不是小麦病虫害综合防治的方法？',
    options: ['农业防治', '物理防治', '化学防治', '人工防治'],
    answer: 'D',
    analysis: '小麦病虫害综合防治方法包括农业防治、物理防治、化学防治和生物防治，人工防治不属于标准分类。',
    difficulty: 2,
  },
  {
    title: '农业防治小麦病虫害的措施不包括？',
    options: ['轮作倒茬', '合理密植', '药剂拌种', '清洁田园'],
    answer: 'C',
    analysis: '药剂拌种属于化学防治措施，农业防治主要包括轮作倒茬、合理密植、清洁田园、选用抗病品种等。',
    difficulty: 2,
  },
  {
    title: '生物防治小麦病虫害的优点是？',
    options: ['见效快', '无污染', '成本低', '操作简单'],
    answer: 'B',
    analysis: '生物防治小麦病虫害的优点是对环境无污染，不会产生农药残留，有利于生态平衡。',
    difficulty: 1,
  },
  {
    title: '化学防治小麦病虫害的注意事项不包括？',
    options: ['交替用药', '适时用药', '随意用药', '安全用药'],
    answer: 'C',
    analysis: '化学防治小麦病虫害应注意交替用药、适时用药、安全用药，避免随意用药导致抗药性产生。',
    difficulty: 1,
  },
  {
    title: '小麦病虫害预测预报的目的是？',
    options: ['提前防治', '减少损失', '科学决策', '以上都是'],
    answer: 'D',
    analysis: '小麦病虫害预测预报的目的是提前防治、减少损失、科学决策，为病虫害防治提供科学依据。',
    difficulty: 1,
  },
  {
    title: '小麦病虫害调查的内容不包括？',
    options: ['发生时间', '发生数量', '发生原因', '发生地点'],
    answer: 'C',
    analysis: '小麦病虫害调查的内容包括发生时间、发生数量、发生地点等，发生原因不属于调查内容，属于分析范畴。',
    difficulty: 2,
  },
  {
    title: '小麦病虫害防治的基本原则是？',
    options: ['预防为主', '综合防治', '科学防治', '以上都是'],
    answer: 'D',
    analysis: '小麦病虫害防治的基本原则是预防为主、综合防治、科学防治，坚持可持续发展的植保方针。',
    difficulty: 1,
  },
  {
    title: '以下哪种是小麦主要的生理性病害？',
    options: ['白粉病', '赤霉病', '缺素症', '锈病'],
    answer: 'C',
    analysis: '缺素症是小麦的生理性病害，由营养元素缺乏引起，而白粉病、赤霉病、锈病都是由病原物引起的侵染性病害。',
    difficulty: 1,
  },
  {
    title: '小麦缺锌的症状是？',
    options: ['叶片发黄', '叶片发白', '叶片扭曲', '植株矮化'],
    answer: 'B',
    analysis: '小麦缺锌时，新叶发白，尤其是在叶片中部出现白色条纹，严重时整叶变白。',
    difficulty: 2,
  },
  {
    title: '小麦缺铁的症状是？',
    options: ['老叶发黄', '新叶发黄', '叶片斑点', '茎秆变细'],
    answer: 'B',
    analysis: '小麦缺铁时，新叶发黄，叶脉保持绿色，形成明显的绿色网状脉，严重时叶片变白。',
    difficulty: 2,
  },
];

async function main() {
  console.log('开始批量插入题目...');
  
  for (const [index, question] of questions.entries()) {
    const optionsWithLabels = question.options.map((option, i) => ({
      label: String.fromCharCode(65 + i),
      content: option,
    }));

    await prisma.question.create({
      data: {
        title: question.title,
        options: JSON.stringify(optionsWithLabels),
        answer: question.answer,
        analysis: question.analysis,
        difficulty: question.difficulty,
      },
    });

    if ((index + 1) % 10 === 0) {
      console.log(`已插入 ${index + 1} 道题目`);
    }
  }

  console.log('所有题目插入完成！');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
