export type Group = {
  id: string;
  number: string;
  name: string;
  kicker: string;
  description: string;
  learns: string[];
  races: string[];
  image: string;
  imageAlt: string;
};

export const groups: Group[] = [
  {
    id: 'hardware',
    number: '01',
    name: '硬件组',
    kicker: 'BUILD THE SIGNAL',
    description: '把想法焊接成可以被触摸、被测量、被验证的实体。',
    learns: ['电路与 PCB 设计', '嵌入式开发 / MCU', '传感器与通信协议'],
    races: ['全国大学生电子设计竞赛', '智能车竞赛 / 物联网赛道'],
    image: '/assets/group-hardware.webp',
    imageAlt: '电路板与电子元件的近景'
  },
  {
    id: 'software',
    number: '02',
    name: '应用组',
    kicker: 'MAKE IT USEFUL',
    description: '让设备拥有界面、连接和被真实用户使用的理由。',
    learns: ['Web / App 全栈开发', '物联网平台与数据可视化', '产品原型与交互设计'],
    races: ['中国国际大学生创新大赛', '挑战杯'],
    image: '/assets/group-software.webp',
    imageAlt: '桌面上的应用界面设计与开发设备'
  },
  {
    id: 'algorithm',
    number: '03',
    name: '算法组',
    kicker: 'TEACH MACHINES',
    description: '从一串原始数据里找到规律，让系统学会判断和行动。',
    learns: ['机器学习与计算机视觉', '数据处理与模型训练', '边缘 AI 与智能决策'],
    races: ['全国大学生数学建模竞赛', '中国高校计算机大赛 · 人工智能赛道'],
    image: '/assets/group-algorithm.webp',
    imageAlt: '屏幕上的代码与数据分析界面'
  }
];
