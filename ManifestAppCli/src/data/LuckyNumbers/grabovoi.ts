export const grabovoiDaily = {
  sequence: '520 741',
  tr: 'Bolluk ve finansal akış niyetiyle.',
  en: 'For abundance and financial flow.',
};

export type GrabovoiSequence = {
  code: string;
  tr: string;
  en: string;
};

export type GrabovoiTopic = {
  id: string;
  popular: boolean;
  tr: string;
  en: string;
  subtitleTr: string;
  subtitleEn: string;
  bodyTr: string;
  bodyEn: string;
  sequences: GrabovoiSequence[];
};

export const grabovoiData: GrabovoiTopic[] = [
  {
    id: 'money',
    popular: true,
    tr: 'Para & Bolluk',
    en: 'Money & Abundance',
    subtitleTr: 'Finans, bereket ve maddi akış',
    subtitleEn: 'Finance, blessing and material flow',
    bodyTr:
      'Bu alandaki sayı dizileri bolluk, bereket ve maddi akış niyetini desteklemek için seçilmiştir.',
    bodyEn:
      'These sequences are chosen to support an intention of abundance, blessing and material flow.',
    sequences: [
      {code: '520 741', tr: 'Bolluk ve finansal akış', en: 'Abundance and financial flow'},
      {code: '888', tr: 'Bereket ve çoğalma', en: 'Blessing and multiplication'},
      {code: '318 798', tr: 'Maddi denge', en: 'Material balance'},
    ],
  },
  {
    id: 'career',
    popular: false,
    tr: 'İş ve kariyer',
    en: 'Work and career',
    subtitleTr: 'Başarı, fırsatlar ve ilerleme',
    subtitleEn: 'Success, opportunities and progress',
    bodyTr:
      'Kariyer yolunda netlik, fırsat ve ilerleme niyetiyle çalışabileceğin sayı dizileri.',
    bodyEn:
      'Number sequences you can work with for clarity, opportunity and progress in your career path.',
    sequences: [
      {code: '714 819', tr: 'İş başarısı', en: 'Work success'},
      {code: '548 921', tr: 'Yeni fırsatlar', en: 'New opportunities'},
      {code: '381', tr: 'İlerleme ve yükseliş', en: 'Progress and advancement'},
    ],
  },
  {
    id: 'love',
    popular: false,
    tr: 'Aşk & İlişkiler',
    en: 'Love & Relationships',
    subtitleTr: 'Sevgi, uyum ve aile bağları',
    subtitleEn: 'Love, harmony and family bonds',
    bodyTr:
      'Sevgi, uyum ve bağları güçlendirme niyeti için seçilmiş sayı dizileri.',
    bodyEn:
      'Number sequences chosen for an intention of love, harmony and stronger bonds.',
    sequences: [
      {code: '170 617', tr: 'Sevgi ve uyum', en: 'Love and harmony'},
      {code: '514 819', tr: 'İlişki dengesi', en: 'Relationship balance'},
      {code: '888 142', tr: 'Kalp bağlantısı', en: 'Heart connection'},
    ],
  },
  {
    id: 'growth',
    popular: false,
    tr: 'Özgüven & Gelişim',
    en: 'Confidence & Growth',
    subtitleTr: 'Kendini güçlendirme ve içsel dönüşüm',
    subtitleEn: 'Strengthening yourself and inner change',
    bodyTr:
      'Özgüven, içsel güç ve kişisel dönüşüm niyeti için sayı dizileri.',
    bodyEn:
      'Number sequences for confidence, inner strength and personal transformation.',
    sequences: [
      {code: '918 714', tr: 'Özgüven', en: 'Self-confidence'},
      {code: '381 514', tr: 'İçsel güç', en: 'Inner strength'},
      {code: '714', tr: 'Kişisel dönüşüm', en: 'Personal transformation'},
    ],
  },
  {
    id: 'spirit',
    popular: false,
    tr: 'Spiritüel Dünya',
    en: 'Spiritual World',
    subtitleTr: 'Enerji, korunma ve denge',
    subtitleEn: 'Energy, protection and balance',
    bodyTr:
      'Enerji, korunma ve spiritüel denge niyetiyle çalışabileceğin diziler.',
    bodyEn:
      'Sequences you can work with for energy, protection and spiritual balance.',
    sequences: [
      {code: '148 741', tr: 'Korunma', en: 'Protection'},
      {code: '318 888', tr: 'Enerji dengesi', en: 'Energy balance'},
      {code: '520', tr: 'Ruhsal netlik', en: 'Spiritual clarity'},
    ],
  },
  {
    id: 'health',
    popular: false,
    tr: 'Sağlık & Beden',
    en: 'Health & Body',
    subtitleTr: 'İyi oluş, denge ve yaşam enerjisi',
    subtitleEn: 'Wellbeing, balance and life energy',
    bodyTr:
      'İyi oluş, bedensel denge ve yaşam enerjisi niyeti için sayı dizileri.',
    bodyEn:
      'Number sequences for wellbeing, bodily balance and life energy.',
    sequences: [
      {code: '481 714', tr: 'İyi oluş', en: 'Wellbeing'},
      {code: '918 381', tr: 'Yaşam enerjisi', en: 'Life energy'},
      {code: '148', tr: 'Beden dengesi', en: 'Body balance'},
    ],
  },
  {
    id: 'family',
    popular: false,
    tr: 'Aile & Sosyal',
    en: 'Family & Social',
    subtitleTr: 'Aile, dostluklar ve sosyal uyum',
    subtitleEn: 'Family, friendships and social harmony',
    bodyTr:
      'Aile bağları, dostluklar ve sosyal uyum niyeti için sayı dizileri.',
    bodyEn:
      'Number sequences for family bonds, friendships and social harmony.',
    sequences: [
      {code: '514 170', tr: 'Aile uyumu', en: 'Family harmony'},
      {code: '819 888', tr: 'Dostluklar', en: 'Friendships'},
      {code: '381 170', tr: 'Sosyal denge', en: 'Social balance'},
    ],
  },
  {
    id: 'nature',
    popular: false,
    tr: 'Doğa & Canlılar',
    en: 'Nature & Living Beings',
    subtitleTr: 'Hayvanlar, bitkiler ve gıda',
    subtitleEn: 'Animals, plants and food',
    bodyTr:
      'Doğa, canlılar ve doğal dengeyle uyum niyeti için sayı dizileri.',
    bodyEn:
      'Number sequences for harmony with nature, living beings and natural balance.',
    sequences: [
      {code: '548 318', tr: 'Doğa ile uyum', en: 'Harmony with nature'},
      {code: '714 148', tr: 'Canlılara şefkat', en: 'Compassion for beings'},
      {code: '888 548', tr: 'Doğal denge', en: 'Natural balance'},
    ],
  },
];

export function getGrabovoiTopic(id: string) {
  return grabovoiData.find(topic => topic.id === id);
}
