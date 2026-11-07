export const grabovoiDaily = {
  sequence: '520 741',
  tr: 'Bolluk ve finansal akış niyetiyle.',
  en: 'For abundance and financial flow.',
};

export type SequenceBadge = 'shared' | 'popular' | 'frequent';

export type GrabovoiSequence = {
  code: string;
  tr: string;
  en: string;
  badge?: SequenceBadge;
  popular?: boolean;
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
    bodyTr: 'Para & Bolluk, hayatındaki finansal akışı, bereketi ve maddi güven duygusunu güçlendirmeye odaklanır. Kaynaklarını çoğaltmak, fırsatları fark etmek ve bolluk bilincini desteklemek için bu alanla çalışabilirsin.',
    bodyEn: 'Money & Abundance focuses on strengthening your financial flow, prosperity and sense of material security. You can work with this area to multiply your resources, notice opportunities and support an abundance mindset.',
    sequences: [
      {
        code: '520 741 741 741 889 8',
        tr: 'Para ve başarı formülü',
        en: 'Para ve başarı formülü',
        popular: true
      },
      {
        code: '520 741',
        tr: 'Para ve bolluk',
        en: 'Para ve bolluk',
        popular: true
      },
      {
        code: '520',
        tr: 'Beklenmedik para / para niyeti',
        en: 'Beklenmedik para / para niyeti',
        popular: true
      },
      {
        code: '520 741 8',
        tr: 'Beklenmedik para',
        en: 'Beklenmedik para',
        popular: true
      },
      {
        code: '318 798',
        tr: 'Finansal bolluk / para çekme',
        en: 'Finansal bolluk / para çekme',
        popular: true
      },
      {
        code: '318 612 518 714',
        tr: 'Sürekli nakit akışı',
        en: 'Sürekli nakit akışı'
      },
      {
        code: '9213140',
        tr: 'Düzenli ve yüksek gelir',
        en: 'Düzenli ve yüksek gelir'
      },
      {
        code: '888 412 128',
        tr: 'Bolluk / refah',
        en: 'Bolluk / refah'
      },
      {
        code: '741 852 963',
        tr: 'Para odağı / bolluk',
        en: 'Para odağı / bolluk'
      },
      {
        code: '719 318 52',
        tr: 'Finansal bağımsızlık',
        en: 'Finansal bağımsızlık'
      },
      {
        code: '918 794 818',
        tr: 'Refah ve başarı',
        en: 'Refah ve başarı'
      },
      {
        code: '2667827',
        tr: 'Para mıknatısı odağı',
        en: 'Para mıknatısı odağı'
      },
      {
        code: '6135455',
        tr: 'Para bloklarını bırakma',
        en: 'Para bloklarını bırakma'
      },
      {
        code: '87467894',
        tr: 'Parasal özgüven',
        en: 'Parasal özgüven'
      },
      {
        code: '3657745',
        tr: 'Finansal özgürlük',
        en: 'Finansal özgürlük'
      },
      {
        code: '426499',
        tr: 'Acil para / fırsat',
        en: 'Acil para / fırsat'
      },
      {
        code: '71427321893',
        tr: 'Ekonomik durumun dengelenmesi',
        en: 'Ekonomik durumun dengelenmesi'
      },
      {
        code: '318612518714',
        tr: 'Finansal istikrar',
        en: 'Finansal istikrar'
      },
      {
        code: '6559914',
        tr: 'Gelir artışı',
        en: 'Gelir artışı'
      },
      {
        code: '819 419 714',
        tr: 'Maddi refah',
        en: 'Maddi refah'
      },
      {
        code: '4 148 188',
        tr: 'Para tıkanıklığını açma',
        en: 'Para tıkanıklığını açma'
      },
      {
        code: '619 714 218 41',
        tr: 'Borç çözümü',
        en: 'Borç çözümü'
      },
      {
        code: '77 77 777',
        tr: 'Para şansı / bolluk',
        en: 'Para şansı / bolluk'
      },
      {
        code: '495291151',
        tr: 'Hızlı sonuç alma',
        en: 'Hızlı sonuç alma'
      },
      {
        code: '212309909',
        tr: 'Beklenmedik gelir',
        en: 'Beklenmedik gelir'
      },
      {
        code: '48864131811',
        tr: 'İş motivasyonu',
        en: 'İş motivasyonu'
      },
      {
        code: '414 81 88',
        tr: 'Zamanı paraya dönüştürme',
        en: 'Zamanı paraya dönüştürme'
      },
      {
        code: '520741',
        tr: 'Başarı ve bolluk',
        en: 'Başarı ve bolluk'
      },
      {
        code: '9798733714615',
        tr: 'Para çekme / para niyeti',
        en: 'Para çekme / para niyeti'
      },
      {
        code: '54121381948',
        tr: 'Satışları artırma',
        en: 'Satışları artırma'
      },
      {
        code: '71974131981',
        tr: 'Girişimcilik',
        en: 'Girişimcilik'
      },
      {
        code: '964986583',
        tr: 'Para bilgisi / finansal farkındalık',
        en: 'Para bilgisi / finansal farkındalık'
      },
      {
        code: '41481888',
        tr: 'Zamanı paraya dönüştürme',
        en: 'Zamanı paraya dönüştürme'
      },
      {
        code: '498518498',
        tr: 'Kararlılık ve hedefler',
        en: 'Kararlılık ve hedefler'
      },
      {
        code: '51731481911',
        tr: 'Sorumluluk',
        en: 'Sorumluluk'
      },
      {
        code: '31841791844',
        tr: 'Erteleme / tembellikten kurtulma',
        en: 'Erteleme / tembellikten kurtulma'
      },
      {
        code: '41948871',
        tr: 'Müşteri çekme',
        en: 'Müşteri çekme'
      },
      {
        code: '914481',
        tr: 'Mesleki tanınma',
        en: 'Mesleki tanınma'
      },
      {
        code: '888412128',
        tr: 'Bolluk ve refah',
        en: 'Bolluk ve refah'
      },
      {
        code: '741852963',
        tr: 'Para çekme odağı',
        en: 'Para çekme odağı'
      },
      {
        code: '71931852',
        tr: 'Finansal bağımsızlık',
        en: 'Finansal bağımsızlık'
      },
      {
        code: '918794818',
        tr: 'Refah ve başarı',
        en: 'Refah ve başarı'
      }
    ],
  },
  {
    id: 'career',
    popular: false,
    tr: 'İş ve kariyer',
    en: 'Work and career',
    subtitleTr: 'Başarı, fırsatlar ve ilerleme',
    subtitleEn: 'Success, opportunities and progress',
    bodyTr: 'İş ve kariyer, yolundaki başarıyı, fırsatları ve ilerlemeyi güçlendirmeye odaklanır. İş hayatında netlik, cesaret ve doğru yönelim için bu alanla çalışabilirsin.',
    bodyEn: 'Work and career focuses on strengthening success, opportunities and progress on your path. You can work with this area for clarity, courage and the right direction in your professional life.',
    sequences: [
      {
        code: '493151 864 1491',
        tr: 'İş bulma / hayalindeki iş',
        en: 'İş bulma / hayalindeki iş'
      },
      {
        code: '218 494517601',
        tr: 'Hızlı iş bulma',
        en: 'Hızlı iş bulma'
      },
      {
        code: '890 1048',
        tr: 'Kariyer ve başarı',
        en: 'Kariyer ve başarı'
      },
      {
        code: '52025',
        tr: 'Tıkanmış işin açılması',
        en: 'Tıkanmış işin açılması'
      },
      {
        code: '8 918 014915 6481',
        tr: 'İş başarısı',
        en: 'İş başarısı'
      },
      {
        code: '889',
        tr: 'Başarı / gerçekleşme',
        en: 'Başarı / gerçekleşme',
        popular: true
      },
      {
        code: '894 719 78 48',
        tr: 'Hedeflere ulaşma / başarabilme',
        en: 'Hedeflere ulaşma / başarabilme'
      },
      {
        code: '419 819 719 81',
        tr: 'Küçük işletmelerin büyümesi',
        en: 'Küçük işletmelerin büyümesi'
      },
      {
        code: '719 419 811',
        tr: 'Yurt dışında iş geliştirme',
        en: 'Yurt dışında iş geliştirme'
      },
      {
        code: '819 419 714',
        tr: 'Küçük işletmenin bağımsızlığı',
        en: 'Küçük işletmenin bağımsızlığı'
      },
      {
        code: '914 819 87',
        tr: 'Yeni teknoloji / hızlı yardım',
        en: 'Yeni teknoloji / hızlı yardım'
      },
      {
        code: '518 491 617',
        tr: 'Bağımsız finansman kaynağı',
        en: 'Bağımsız finansman kaynağı'
      },
      {
        code: '419 875',
        tr: 'Organizasyon becerisi',
        en: 'Organizasyon becerisi'
      },
      {
        code: '419 818 719 849',
        tr: 'Yönetim becerisi',
        en: 'Yönetim becerisi'
      },
      {
        code: '514 918 919',
        tr: 'İş bilgisi ve alışkanlıkları',
        en: 'İş bilgisi ve alışkanlıkları'
      },
      {
        code: '914 419 81',
        tr: 'İş önceliklerini belirleme',
        en: 'İş önceliklerini belirleme'
      },
      {
        code: '419 814',
        tr: 'Çalışma optimizasyonu',
        en: 'Çalışma optimizasyonu'
      },
      {
        code: '519 498 719 41',
        tr: 'Üretim ve satış teknolojisi',
        en: 'Üretim ve satış teknolojisi'
      },
      {
        code: '91431289',
        tr: 'İş geçmişini düzeltme niyeti',
        en: 'İş geçmişini düzeltme niyeti'
      },
      {
        code: '914 481',
        tr: 'Mesleki tanınma',
        en: 'Mesleki tanınma'
      },
      {
        code: '419 488 71',
        tr: 'Müşteri çekme / elverişli koşullar',
        en: 'Müşteri çekme / elverişli koşullar'
      },
      {
        code: '541213981948',
        tr: 'Mülk satışı / ticari satış listelerinde',
        en: 'Mülk satışı / ticari satış listelerinde'
      },
      {
        code: '4931518641491',
        tr: 'Hayalindeki işi bulma',
        en: 'Hayalindeki işi bulma'
      },
      {
        code: '218494517601',
        tr: 'Hızlı iş bulma',
        en: 'Hızlı iş bulma'
      },
      {
        code: '493151',
        tr: 'Kariyer ve gelir artışı',
        en: 'Kariyer ve gelir artışı'
      },
      {
        code: '8901048',
        tr: 'Kariyer ve başarı',
        en: 'Kariyer ve başarı'
      },
      {
        code: '8277237',
        tr: 'Şöhret / tanınma',
        en: 'Şöhret / tanınma'
      },
      {
        code: '41981971981',
        tr: 'Küçük işletmelerin büyümesi',
        en: 'Küçük işletmelerin büyümesi'
      },
      {
        code: '719419811',
        tr: 'Başka ülkelerde iş geliştirme',
        en: 'Başka ülkelerde iş geliştirme'
      },
      {
        code: '819419714',
        tr: 'Küçük işletmenin bağımsızlığı',
        en: 'Küçük işletmenin bağımsızlığı'
      },
      {
        code: '91481987',
        tr: 'Hızlı yardım / yeni teknoloji',
        en: 'Hızlı yardım / yeni teknoloji'
      },
      {
        code: '518491617',
        tr: 'Bağımsız finansman kaynağı',
        en: 'Bağımsız finansman kaynağı'
      },
      {
        code: '419875',
        tr: 'Organizasyon becerisi',
        en: 'Organizasyon becerisi'
      },
      {
        code: '419818719849',
        tr: 'Yönetim becerisi',
        en: 'Yönetim becerisi'
      },
      {
        code: '514918919',
        tr: 'İş bilgisi ve alışkanlıkları',
        en: 'İş bilgisi ve alışkanlıkları'
      },
      {
        code: '91441981',
        tr: 'İş önceliklerini belirleme',
        en: 'İş önceliklerini belirleme'
      },
      {
        code: '419814',
        tr: 'Çalışma optimizasyonu',
        en: 'Çalışma optimizasyonu'
      },
      {
        code: '51949871941',
        tr: 'Üretim ve satış teknolojisi',
        en: 'Üretim ve satış teknolojisi'
      },
      {
        code: '41948871',
        tr: 'Müşteri çekme',
        en: 'Müşteri çekme'
      },
      {
        code: '914481',
        tr: 'Mesleki tanınma',
        en: 'Mesleki tanınma'
      }
    ],
  },
  {
    id: 'love',
    popular: false,
    tr: 'Aşk & İlişkiler',
    en: 'Love & Relationships',
    subtitleTr: 'Sevgi, uyum ve aile bağları',
    subtitleEn: 'Love, harmony and family bonds',
    bodyTr: 'Aşk & İlişkiler, sevgiyi, uyumu ve bağ kurma enerjisini güçlendirmeye odaklanır. Kalbini açmak, sağlıklı ilişkiler kurmak ve sevgiyi davet etmek için bu alanla çalışabilirsin.',
    bodyEn: 'Love & Relationships focuses on strengthening love, harmony and connection. You can work with this area to open your heart, build healthy relationships and invite love in.',
    sequences: [
      {
        code: '888 412 1289018',
        tr: 'Aşk ve sevgi',
        en: 'Aşk ve sevgi'
      },
      {
        code: '938',
        tr: 'Aşk',
        en: 'Aşk',
        popular: true
      },
      {
        code: '541',
        tr: 'Aşk',
        en: 'Aşk'
      },
      {
        code: '157',
        tr: 'Aşk',
        en: 'Aşk'
      },
      {
        code: '888 912 818848',
        tr: 'Sonsuz aşk / sevgi',
        en: 'Sonsuz aşk / sevgi'
      },
      {
        code: '571',
        tr: 'Ruh eşi',
        en: 'Ruh eşi'
      },
      {
        code: '93 8',
        tr: 'Aşk ve ruh eşi',
        en: 'Aşk ve ruh eşi'
      },
      {
        code: '548',
        tr: 'Aşk çekme',
        en: 'Aşk çekme',
        popular: true
      },
      {
        code: '548317489417',
        tr: 'Aşkı çekme',
        en: 'Aşkı çekme'
      },
      {
        code: '888 418 128 90 18',
        tr: 'Aşkı çekme',
        en: 'Aşkı çekme'
      },
      {
        code: '888 12418 316019',
        tr: 'Aşkı çekme',
        en: 'Aşkı çekme'
      },
      {
        code: '64821',
        tr: 'Gerçek aşk',
        en: 'Gerçek aşk'
      },
      {
        code: '48040305',
        tr: 'Aşk ve evlilik',
        en: 'Aşk ve evlilik'
      },
      {
        code: '548938',
        tr: 'Aşk ve evlilik',
        en: 'Aşk ve evlilik'
      },
      {
        code: '5294361',
        tr: 'Aşk ve evlilik',
        en: 'Aşk ve evlilik'
      },
      {
        code: '591 718 9181419',
        tr: 'İlişkilerde rezonans / altın kural',
        en: 'İlişkilerde rezonans / altın kural'
      },
      {
        code: '28555901',
        tr: 'Aile içi uyum',
        en: 'Aile içi uyum'
      },
      {
        code: '285555901',
        tr: 'Ailede uyum',
        en: 'Ailede uyum'
      },
      {
        code: '141111963',
        tr: 'Uyumlu ilişki',
        en: 'Uyumlu ilişki'
      },
      {
        code: '917 498 31948',
        tr: 'Mevcut ilişkiyi güçlendirme',
        en: 'Mevcut ilişkiyi güçlendirme'
      },
      {
        code: '1847 8198 7181',
        tr: '',
        en: ''
      },
      {
        code: '14854321',
        tr: 'Partneri geri kazanma',
        en: 'Partneri geri kazanma'
      },
      {
        code: '318614218',
        tr: '',
        en: ''
      },
      {
        code: '3856794',
        tr: 'Eski sevgiliyi geri getirme',
        en: 'Eski sevgiliyi geri getirme'
      },
      {
        code: '396815',
        tr: 'Kendini sevme',
        en: 'Kendini sevme'
      },
      {
        code: '89974476',
        tr: 'Eski partnerle yeniden birleşme',
        en: 'Eski partnerle yeniden birleşme'
      },
      {
        code: '197023',
        tr: 'Partner çekme',
        en: 'Partner çekme'
      },
      {
        code: '888912818848',
        tr: 'Sonsuz aşk',
        en: 'Sonsuz aşk'
      },
      {
        code: '401543512',
        tr: 'Romantik ilişki',
        en: 'Romantik ilişki'
      },
      {
        code: '973594066',
        tr: 'Romantizm / ruh eşi',
        en: 'Romantizm / ruh eşi'
      },
      {
        code: '5284917',
        tr: 'Ruh eşi çekme',
        en: 'Ruh eşi çekme'
      },
      {
        code: '8884121289018',
        tr: 'Aşkı hayatına çekme',
        en: 'Aşkı hayatına çekme'
      },
      {
        code: '5197189181419',
        tr: 'Aşk, iş ve evlilikte altın kural',
        en: 'Aşk, iş ve evlilikte altın kural'
      }
    ],
  },
  {
    id: 'growth',
    popular: false,
    tr: 'Özgüven & Gelişim',
    en: 'Confidence & Growth',
    subtitleTr: 'Kendini güçlendirme ve içsel dönüşüm',
    subtitleEn: 'Strengthening yourself and inner change',
    bodyTr: 'Özgüven & Gelişim, iç gücünü, öz değerini ve kişisel dönüşümünü desteklemeye odaklanır. Kendine güvenmek ve potansiyelini açmak için bu alanla çalışabilirsin.',
    bodyEn: 'Confidence & Growth focuses on supporting your inner strength, self-worth and personal transformation. You can work with this area to trust yourself and open your potential.',
    sequences: [
      {
        code: '51949131948',
        tr: 'Kaygı / anksiyete',
        en: 'Kaygı / anksiyete'
      },
      {
        code: '5986819 06888914',
        tr: 'Cesaret',
        en: 'Cesaret'
      },
      {
        code: '18888 99',
        tr: 'Bilinç değişikliği',
        en: 'Bilinç değişikliği'
      },
      {
        code: '548 917 818',
        tr: 'Bilinç',
        en: 'Bilinç'
      },
      {
        code: '1888888 9 1',
        tr: 'Bilinç genişletme',
        en: 'Bilinç genişletme'
      },
      {
        code: '817498 8612194',
        tr: 'Biyolojik saat',
        en: 'Biyolojik saat'
      },
      {
        code: '918714',
        tr: 'Biyoenerji',
        en: 'Biyoenerji'
      },
      {
        code: '519514 319891',
        tr: 'Depresyon',
        en: 'Depresyon'
      },
      {
        code: '898 716 31944',
        tr: 'Duygu düzenleme',
        en: 'Duygu düzenleme'
      },
      {
        code: '489614 319 8',
        tr: 'Rüya',
        en: 'Rüya'
      },
      {
        code: '59867139874',
        tr: 'Etkinlik',
        en: 'Etkinlik'
      },
      {
        code: '5984971841',
        tr: 'Yetenek',
        en: 'Yetenek'
      },
      {
        code: '7819019425',
        tr: 'Geçmişle uyum',
        en: 'Geçmişle uyum'
      },
      {
        code: '148721091',
        tr: 'Gelecekle uyum',
        en: 'Gelecekle uyum'
      },
      {
        code: '598 688 716 01',
        tr: 'Gelecekteki olaylara odaklanma',
        en: 'Gelecekteki olaylara odaklanma'
      },
      {
        code: '9187756981818',
        tr: 'Genel koruma',
        en: 'Genel koruma'
      },
      {
        code: '9718319575148179',
        tr: 'Uyum / harmonizasyon',
        en: 'Uyum / harmonizasyon'
      },
      {
        code: '895 719 78 48',
        tr: 'Hedeflere odaklanma',
        en: 'Hedeflere odaklanma'
      },
      {
        code: '891 019 4918808',
        tr: 'Korku',
        en: 'Korku'
      },
      {
        code: '489314 81961',
        tr: 'Panik',
        en: 'Panik'
      },
      {
        code: '54857121918',
        tr: 'Kaygı',
        en: 'Kaygı'
      },
      {
        code: '9188013210617',
        tr: 'Meditasyon',
        en: 'Meditasyon'
      },
      {
        code: '614 318171 8914218',
        tr: 'Melankoli',
        en: 'Melankoli'
      },
      {
        code: '71381921',
        tr: 'Merkezine dönme',
        en: 'Merkezine dönme'
      },
      {
        code: '28 7 741',
        tr: 'Mutluluk',
        en: 'Mutluluk'
      },
      {
        code: '51631982198491',
        tr: 'Negatif enerjilere karşı',
        en: 'Negatif enerjilere karşı'
      },
      {
        code: '1888948',
        tr: 'Olumsuzu olumluya dönüştürme',
        en: 'Olumsuzu olumluya dönüştürme'
      },
      {
        code: '59179831749',
        tr: 'Gevşeme',
        en: 'Gevşeme'
      },
      {
        code: '59873189849',
        tr: 'Fobi',
        en: 'Fobi'
      },
      {
        code: '528471 228911',
        tr: 'Saldırganlık',
        en: 'Saldırganlık'
      },
      {
        code: '548321819911',
        tr: 'Sosyal uyum',
        en: 'Sosyal uyum'
      },
      {
        code: '514319893714',
        tr: 'Sakinlik',
        en: 'Sakinlik'
      },
      {
        code: '819471',
        tr: 'Stres',
        en: 'Stres'
      },
      {
        code: '514248538',
        tr: 'Uyku / uyku düzeni',
        en: 'Uyku / uyku düzeni'
      },
      {
        code: '489061 719 88 0618',
        tr: 'Umut',
        en: 'Umut'
      },
      {
        code: '513964 818 91',
        tr: 'İrade',
        en: 'İrade'
      },
      {
        code: '591617 88061',
        tr: 'Yalnızlık',
        en: 'Yalnızlık'
      },
      {
        code: '5555555',
        tr: 'Bilgi işleme',
        en: 'Bilgi işleme'
      },
      {
        code: '5893240',
        tr: 'Hafıza',
        en: 'Hafıza'
      },
      {
        code: '419886 7198',
        tr: 'Zekâ',
        en: 'Zekâ'
      },
      {
        code: '519 007 918 788',
        tr: 'Dâhilik / zihinsel kapasite',
        en: 'Dâhilik / zihinsel kapasite'
      },
      {
        code: '49181951749814',
        tr: 'Benlik saygısı',
        en: 'Benlik saygısı'
      },
      {
        code: '517 489 719 841',
        tr: 'Özgüven',
        en: 'Özgüven'
      },
      {
        code: '428 612 788910',
        tr: 'Unutkanlık',
        en: 'Unutkanlık'
      },
      {
        code: '48864131811',
        tr: 'Motivasyon',
        en: 'Motivasyon'
      },
      {
        code: '42168171919',
        tr: 'İç motivasyon',
        en: 'İç motivasyon'
      },
      {
        code: '1001105010',
        tr: 'İç huzur',
        en: 'İç huzur'
      },
      {
        code: '35986',
        tr: 'Sezgi geliştirme',
        en: 'Sezgi geliştirme'
      },
      {
        code: '25122004',
        tr: 'Karar verme',
        en: 'Karar verme'
      },
      {
        code: '81441881',
        tr: 'Zaman yönetimi',
        en: 'Zaman yönetimi'
      },
      {
        code: '519 7148',
        tr: 'Her şey mümkün / niyet',
        en: 'Her şey mümkün / niyet'
      },
      {
        code: '71042',
        tr: 'Anda kalma / şimdiki zamanla uyum',
        en: 'Anda kalma / şimdiki zamanla uyum'
      },
      {
        code: '1052014',
        tr: 'Özgüven',
        en: 'Özgüven'
      },
      {
        code: '598061291319',
        tr: 'Cesaret',
        en: 'Cesaret'
      },
      {
        code: '49861731',
        tr: 'Değişime direnç',
        en: 'Değişime direnç'
      },
      {
        code: '4980124121919',
        tr: 'Erteleme',
        en: 'Erteleme'
      },
      {
        code: '5197148',
        tr: 'Niyet / her şey mümkün',
        en: 'Niyet / her şey mümkün'
      },
      {
        code: '59868871601',
        tr: 'Gelecekteki olaylara odaklanma',
        en: 'Gelecekteki olaylara odaklanma'
      },
      {
        code: '212585212',
        tr: 'Çocukların amaçlı öğrenimi',
        en: 'Çocukların amaçlı öğrenimi'
      },
      {
        code: '12370744',
        tr: 'Ruhsal yenilenme',
        en: 'Ruhsal yenilenme'
      },
      {
        code: '1891013',
        tr: 'Yorgunluk',
        en: 'Yorgunluk'
      },
      {
        code: '88148194',
        tr: 'Sürekli gelişim',
        en: 'Sürekli gelişim'
      },
      {
        code: '517489719841',
        tr: 'Özgüven',
        en: 'Özgüven'
      }
    ],
  },
  {
    id: 'spirit',
    popular: false,
    tr: 'Spiritüel Dünya',
    en: 'Spiritual World',
    subtitleTr: 'Enerji, korunma ve denge',
    subtitleEn: 'Energy, protection and balance',
    bodyTr: 'Spiritüel Dünya, enerji dengeni, içsel dinginlik ve korunma hissini güçlendirmeye odaklanır. Bağlantını derinleştirmek ve ruhsal netlik için bu alanla çalışabilirsin.',
    bodyEn: 'Spiritual World focuses on strengthening energetic balance, inner calm and a sense of protection. You can work with this area to deepen your connection and spiritual clarity.',
    sequences: [
      {
        code: '818 918 888 841 498',
        tr: 'Enerji sekansı',
        en: 'Enerji sekansı'
      },
      {
        code: '8888',
        tr: 'Bazı listelerde kapanış / koruma sayısı',
        en: 'Bazı listelerde kapanış / koruma sayısı'
      },
      {
        code: '91809814',
        tr: 'Prana / yaşam enerjisi',
        en: 'Prana / yaşam enerjisi'
      },
      {
        code: '91119919111',
        tr: 'Aura / ışık bedeni',
        en: 'Aura / ışık bedeni'
      },
      {
        code: '519489 491848',
        tr: 'Üçüncü göz / spiritüel odak',
        en: 'Üçüncü göz / spiritüel odak'
      },
      {
        code: '88 44 242',
        tr: 'Sezgi / duru görü',
        en: 'Sezgi / duru görü'
      },
      {
        code: '417 584 217 888',
        tr: 'Spiritüel konsantrasyon',
        en: 'Spiritüel konsantrasyon'
      },
      {
        code: '818 8849482167',
        tr: 'Duru görü',
        en: 'Duru görü'
      },
      {
        code: '3582295',
        tr: 'Spiritüel gelişim',
        en: 'Spiritüel gelişim'
      },
      {
        code: '7847774392346743',
        tr: 'Spiritüel konsantrasyon',
        en: 'Spiritüel konsantrasyon'
      },
      {
        code: '881 881 881',
        tr: 'Duru görü / sezgi',
        en: 'Duru görü / sezgi'
      },
      {
        code: '1 489 999',
        tr: 'Spiritüel sekans',
        en: 'Spiritüel sekans'
      },
      {
        code: '2 890 618',
        tr: 'Spiritüel sekans',
        en: 'Spiritüel sekans'
      },
      {
        code: '41 931 888 941 898',
        tr: 'Spiritüel sekans',
        en: 'Spiritüel sekans'
      },
      {
        code: '9888772988',
        tr: 'Spiritüel sekans',
        en: 'Spiritüel sekans'
      },
      {
        code: '19 712 893',
        tr: 'Spiritüel sekans',
        en: 'Spiritüel sekans'
      },
      {
        code: '1231115025',
        tr: 'Yaratıcının varlığı',
        en: 'Yaratıcının varlığı'
      },
      {
        code: '12370744',
        tr: 'Yaratıcıyla bağlantı',
        en: 'Yaratıcıyla bağlantı'
      },
      {
        code: '197128',
        tr: 'Spiritüel sekans',
        en: 'Spiritüel sekans'
      },
      {
        code: '319817318',
        tr: 'Küresel kurtuluş / uyumlu gelişme',
        en: 'Küresel kurtuluş / uyumlu gelişme'
      },
      {
        code: '191317 481901',
        tr: 'Kendini gerçekleştirme',
        en: 'Kendini gerçekleştirme'
      },
      {
        code: '51847181 211',
        tr: 'Akaşik kayıtlar',
        en: 'Akaşik kayıtlar'
      },
      {
        code: '19712893',
        tr: 'Yaratıcının sıklığı',
        en: 'Yaratıcının sıklığı'
      },
      {
        code: '1784121',
        tr: 'Küresel felaketi önleme',
        en: 'Küresel felaketi önleme'
      },
      {
        code: '888918491648',
        tr: 'Dünyanın iyileşmesi',
        en: 'Dünyanın iyileşmesi'
      },
      {
        code: '5148123',
        tr: 'Minnettarlık / neşe',
        en: 'Minnettarlık / neşe'
      },
      {
        code: '819497264188',
        tr: 'Öz farkındalık',
        en: 'Öz farkındalık'
      },
      {
        code: '813791',
        tr: 'İdeal gelecek',
        en: 'İdeal gelecek'
      },
      {
        code: '891498314 719',
        tr: 'İlham',
        en: 'İlham'
      },
      {
        code: '718981',
        tr: 'Hızlı sonuç / eylem',
        en: 'Hızlı sonuç / eylem'
      },
      {
        code: '741',
        tr: 'Acil çözüm / arzulara odaklanma',
        en: 'Acil çözüm / arzulara odaklanma'
      },
      {
        code: '471891472',
        tr: 'Kayıp kişi veya hayvan',
        en: 'Kayıp kişi veya hayvan'
      },
      {
        code: '419 488 71',
        tr: 'Olumlu koşullar oluşturma',
        en: 'Olumlu koşullar oluşturma'
      },
      {
        code: '548491698719',
        tr: 'Bilinçaltı direncini bırakma',
        en: 'Bilinçaltı direncini bırakma'
      },
      {
        code: '61 988 184 161',
        tr: 'Duygusal hafızayı temizleme',
        en: 'Duygusal hafızayı temizleme'
      },
      {
        code: '88148194',
        tr: 'Sürekli gelişim',
        en: 'Sürekli gelişim'
      },
      {
        code: '91874818',
        tr: 'Kişisel korunma',
        en: 'Kişisel korunma'
      },
      {
        code: '918197185',
        tr: 'Negatif enerjilerden korunma',
        en: 'Negatif enerjilerden korunma'
      },
      {
        code: '91688',
        tr: 'Blokaj kaldırma',
        en: 'Blokaj kaldırma'
      },
      {
        code: '419818719914481',
        tr: 'Saygı duyulan biri olma',
        en: 'Saygı duyulan biri olma'
      },
      {
        code: '91688419818719',
        tr: 'Sosyal saygınlık',
        en: 'Sosyal saygınlık'
      },
      {
        code: '1937198',
        tr: 'Uçuş güvenliği',
        en: 'Uçuş güvenliği'
      },
      {
        code: '881881881',
        tr: 'Sezgi / duru görü',
        en: 'Sezgi / duru görü'
      }
    ],
  },
  {
    id: 'health',
    popular: false,
    tr: 'Sağlık & Beden',
    en: 'Health & Body',
    subtitleTr: 'İyi oluş, denge ve yaşam enerjisi',
    subtitleEn: 'Wellbeing, balance and life energy',
    bodyTr: 'Sağlık & Beden, iyi oluşu, dengeyi ve yaşam enerjisini desteklemeye odaklanır. Bedeninle uyum içinde hissetmek için bu alanla çalışabilirsin. Bu kodlar tıbbi tedavi yerine geçmez.',
    bodyEn: 'Health & Body focuses on supporting wellbeing, balance and life energy. You can work with this area to feel more in harmony with your body. These codes are not a substitute for medical treatment.',
    sequences: [
      {
        code: '1814321',
        tr: 'Genel sağlık normu',
        en: 'Genel sağlık normu'
      },
      {
        code: '1489999',
        tr: 'Genel canlanma / gençlik',
        en: 'Genel canlanma / gençlik'
      },
      {
        code: '9187948181',
        tr: 'Bedenin öz bakımı / iyileşme iddiası',
        en: 'Bedenin öz bakımı / iyileşme iddiası'
      },
      {
        code: '419312819212',
        tr: 'Organ yenilenmesi',
        en: 'Organ yenilenmesi'
      },
      {
        code: '88889888878888',
        tr: 'Çakra ve meridyen dengesi',
        en: 'Çakra ve meridyen dengesi'
      },
      {
        code: '2145432',
        tr: 'Gençleşme / yenilenme',
        en: 'Gençleşme / yenilenme'
      },
      {
        code: '1823451',
        tr: 'Metabolizma',
        en: 'Metabolizma'
      },
      {
        code: '548 716 916 228',
        tr: 'Lenfatik sistem',
        en: 'Lenfatik sistem'
      },
      {
        code: '219214319714',
        tr: 'Karaciğer',
        en: 'Karaciğer'
      },
      {
        code: '719',
        tr: 'Organların dekontaminasyonu',
        en: 'Organların dekontaminasyonu'
      },
      {
        code: '1895132',
        tr: 'Travmatik şok',
        en: 'Travmatik şok'
      },
      {
        code: '45143212',
        tr: 'Alerji',
        en: 'Alerji'
      },
      {
        code: '8111110',
        tr: 'Artrit',
        en: 'Artrit'
      },
      {
        code: '8943548',
        tr: 'Bronşiyal astım',
        en: 'Bronşiyal astım'
      },
      {
        code: '1484857',
        tr: 'Baş ağrısı',
        en: 'Baş ağrısı'
      },
      {
        code: '4812412',
        tr: 'İdeal kilo',
        en: 'İdeal kilo'
      },
      {
        code: '8142543',
        tr: 'Kompulsiyon',
        en: 'Kompulsiyon'
      },
      {
        code: '498712891319',
        tr: 'Ağrı',
        en: 'Ağrı'
      },
      {
        code: '8145432',
        tr: 'Yüksek tansiyon',
        en: 'Yüksek tansiyon'
      },
      {
        code: '59189171 4881',
        tr: 'Anestezi',
        en: 'Anestezi'
      },
      {
        code: '495 19 619',
        tr: 'Saç dökülmesi',
        en: 'Saç dökülmesi'
      },
      {
        code: '6484 121',
        tr: 'Saç sağlığı',
        en: 'Saç sağlığı'
      },
      {
        code: '519 606 901',
        tr: 'Cilt gençleştirme',
        en: 'Cilt gençleştirme'
      },
      {
        code: '58964959431',
        tr: 'Kolajen',
        en: 'Kolajen'
      },
      {
        code: '12746391',
        tr: 'Hücre yenilenmesi',
        en: 'Hücre yenilenmesi'
      },
      {
        code: '1884321',
        tr: 'Tanımlanamayan ağrı / rahatsızlık',
        en: 'Tanımlanamayan ağrı / rahatsızlık'
      },
      {
        code: '518231415',
        tr: 'Diş iltihabı',
        en: 'Diş iltihabı'
      },
      {
        code: '1488514',
        tr: 'Diş ağrısı',
        en: 'Diş ağrısı'
      },
      {
        code: '5189912',
        tr: 'Soğuk algınlığı',
        en: 'Soğuk algınlığı'
      },
      {
        code: '219 389 998 419',
        tr: 'İdrar kaçırma',
        en: 'İdrar kaçırma'
      },
      {
        code: '9718961',
        tr: 'Prostat iltihabı',
        en: 'Prostat iltihabı'
      },
      {
        code: '1891013',
        tr: 'Yorgunluk',
        en: 'Yorgunluk'
      },
      {
        code: '1851432',
        tr: 'Boğaz',
        en: 'Boğaz'
      },
      {
        code: '8421432',
        tr: 'Kalp',
        en: 'Kalp'
      },
      {
        code: '8915678',
        tr: 'Kalp krizi',
        en: 'Kalp krizi'
      },
      {
        code: '1891014',
        tr: 'Göz',
        en: 'Göz'
      },
      {
        code: '49819431947',
        tr: 'Saç beyazlaması',
        en: 'Saç beyazlaması'
      },
      {
        code: '51245424',
        tr: 'Kramp',
        en: 'Kramp'
      },
      {
        code: '4854312',
        tr: 'Göğüs kisti',
        en: 'Göğüs kisti'
      },
      {
        code: '514248538',
        tr: 'Derin uyku',
        en: 'Derin uyku'
      },
      {
        code: '43524585584',
        tr: 'Skolyoz',
        en: 'Skolyoz'
      },
      {
        code: '5481543',
        tr: 'Romatizma',
        en: 'Romatizma'
      },
      {
        code: '4 818 543',
        tr: 'Baş ağrısı',
        en: 'Baş ağrısı'
      },
      {
        code: '23 31 443',
        tr: 'Genel ağrı',
        en: 'Genel ağrı'
      },
      {
        code: '71 81 533',
        tr: 'Sırt ağrısı',
        en: 'Sırt ağrısı'
      },
      {
        code: '8819971',
        tr: 'Diyabet',
        en: 'Diyabet'
      },
      {
        code: '1414551',
        tr: 'Sigara / bağımlılık bırakma',
        en: 'Sigara / bağımlılık bırakma'
      },
      {
        code: '148543292',
        tr: 'Alkol bağımlılığı',
        en: 'Alkol bağımlılığı'
      },
      {
        code: '5333353',
        tr: 'Uyuşturucu bağımlılığı',
        en: 'Uyuşturucu bağımlılığı'
      },
      {
        code: '1257814',
        tr: 'KOAH / solunum',
        en: 'KOAH / solunum'
      },
      {
        code: '5184325',
        tr: 'Alerjik rinit',
        en: 'Alerjik rinit'
      },
      {
        code: '2145432',
        tr: 'Gençleşme',
        en: 'Gençleşme'
      },
      {
        code: '1234571',
        tr: 'İdrar yolu enfeksiyonu',
        en: 'İdrar yolu enfeksiyonu'
      },
      {
        code: '8145999',
        tr: 'Farenjit / bazı listelerde endokardit',
        en: 'Farenjit / bazı listelerde endokardit'
      },
      {
        code: '1851760',
        tr: 'Retina',
        en: 'Retina'
      },
      {
        code: '80845700',
        tr: 'Genel sağlık / iyilik hâli odağı',
        en: 'Genel sağlık / iyilik hâli odağı'
      },
      {
        code: '5343168',
        tr: 'Kilo verme',
        en: 'Kilo verme'
      },
      {
        code: '3122778',
        tr: 'Kilo verme',
        en: 'Kilo verme'
      },
      {
        code: '83585179',
        tr: 'Güzellik ve fiziksel çekicilik',
        en: 'Güzellik ve fiziksel çekicilik'
      },
      {
        code: '5197148',
        tr: 'Fiziksel iyileşme',
        en: 'Fiziksel iyileşme'
      },
      {
        code: '5195148',
        tr: 'Kaygı / fiziksel iyilik hâli',
        en: 'Kaygı / fiziksel iyilik hâli'
      },
      {
        code: '548716916228',
        tr: 'Lenfatik sistem',
        en: 'Lenfatik sistem'
      }
    ],
  },
  {
    id: 'family',
    popular: false,
    tr: 'Aile & Sosyal',
    en: 'Family & Social',
    subtitleTr: 'Aile, dostluklar ve sosyal uyum',
    subtitleEn: 'Family, friendships and social harmony',
    bodyTr: 'Aile & Sosyal, aile bağlarını, dostlukları ve sosyal uyumu güçlendirmeye odaklanır. İlişkilerinde sıcaklık ve denge için bu alanla çalışabilirsin.',
    bodyEn: 'Family & Social focuses on strengthening family bonds, friendships and social harmony. You can work with this area for warmth and balance in your relationships.',
    sequences: [
      {
        code: '28555901',
        tr: 'Aile içi uyum',
        en: 'Aile içi uyum'
      },
      {
        code: '285555901',
        tr: 'Ailede uyum',
        en: 'Ailede uyum'
      },
      {
        code: '141111963',
        tr: 'Uyumlu ilişki',
        en: 'Uyumlu ilişki'
      },
      {
        code: '917 498 31948',
        tr: 'Mevcut ilişkiyi güçlendirme',
        en: 'Mevcut ilişkiyi güçlendirme'
      },
      {
        code: '14854321',
        tr: 'Partneri geri kazanma',
        en: 'Partneri geri kazanma'
      },
      {
        code: '89974476',
        tr: 'Eski partnerle yeniden birleşme',
        en: 'Eski partnerle yeniden birleşme'
      },
      {
        code: '197023',
        tr: 'Partner çekme',
        en: 'Partner çekme'
      },
      {
        code: '401543512',
        tr: 'Romantik ilişki',
        en: 'Romantik ilişki'
      }
    ],
  },
  {
    id: 'nature',
    popular: false,
    tr: 'Doğa & Canlılar',
    en: 'Nature & Living Beings',
    subtitleTr: 'Hayvanlar, bitkiler ve gıda',
    subtitleEn: 'Animals, plants and food',
    bodyTr: 'Doğa & Canlılar, hayvanlar, bitkiler ve gıda ile olan bağını desteklemeye odaklanır. Doğayla uyum ve canlılara şefkat için bu alanla çalışabilirsin.',
    bodyEn: 'Nature & Living Beings focuses on supporting your bond with animals, plants and food. You can work with this area for harmony with nature and care for living beings.',
    sequences: [
      {
        code: '811120218',
        tr: 'Bitkiler',
        en: 'Bitkiler'
      },
      {
        code: '555142198110',
        tr: '',
        en: ''
      },
      {
        code: '549371298',
        tr: 'Köpeklerde hastalık',
        en: 'Köpeklerde hastalık'
      },
      {
        code: '598 64 18',
        tr: 'Köpeklerde hücresel yenilenme',
        en: 'Köpeklerde hücresel yenilenme'
      },
      {
        code: '47 1918 498',
        tr: 'Kedilerde hücresel yenilenme',
        en: 'Kedilerde hücresel yenilenme'
      },
      {
        code: '471891472',
        tr: 'Kayıp hayvan',
        en: 'Kayıp hayvan'
      },
      {
        code: '258041818',
        tr: 'Genel gıda',
        en: 'Genel gıda'
      },
      {
        code: '54931749871',
        tr: 'Beyaz ekmek',
        en: 'Beyaz ekmek'
      },
      {
        code: '54961831754',
        tr: 'Çavdar ekmeği',
        en: 'Çavdar ekmeği'
      },
      {
        code: '494891519',
        tr: 'Patates',
        en: 'Patates'
      },
      {
        code: '479894317',
        tr: 'Sarımsak',
        en: 'Sarımsak'
      },
      {
        code: '318567491',
        tr: 'Karnabahar',
        en: 'Karnabahar'
      },
      {
        code: '489716318',
        tr: 'Havuç',
        en: 'Havuç'
      },
      {
        code: '591318549',
        tr: 'Domates',
        en: 'Domates'
      },
      {
        code: '694897548',
        tr: 'Elma',
        en: 'Elma'
      },
      {
        code: '497514894',
        tr: 'Armut',
        en: 'Armut'
      },
      {
        code: '516498518',
        tr: 'Muz',
        en: 'Muz'
      },
      {
        code: '4897183194',
        tr: 'Ispanak',
        en: 'Ispanak'
      },
      {
        code: '549649894',
        tr: 'Salata',
        en: 'Salata'
      },
      {
        code: '5496418911',
        tr: 'Yağ / tereyağı / margarin',
        en: 'Yağ / tereyağı / margarin'
      },
      {
        code: '31961871481',
        tr: 'Ekmek ve un ürünleri',
        en: 'Ekmek ve un ürünleri'
      },
      {
        code: '91471831949181',
        tr: 'Süt ve süt ürünleri',
        en: 'Süt ve süt ürünleri'
      },
      {
        code: '51481631971',
        tr: 'Mısır gevreği',
        en: 'Mısır gevreği'
      },
      {
        code: '319681398',
        tr: 'Sebze',
        en: 'Sebze'
      },
      {
        code: '5619494319',
        tr: 'Meyve',
        en: 'Meyve'
      },
      {
        code: '5496181979',
        tr: 'Kuru meyve',
        en: 'Kuru meyve'
      },
      {
        code: '56489131849718',
        tr: 'Mantar',
        en: 'Mantar'
      },
      {
        code: '3148964971981',
        tr: 'Yumurta',
        en: 'Yumurta'
      },
      {
        code: '51849459758961',
        tr: 'Balık ve yumuşakçalar',
        en: 'Balık ve yumuşakçalar'
      },
      {
        code: '598714221',
        tr: 'Şeker ve şeker ürünleri',
        en: 'Şeker ve şeker ürünleri'
      },
      {
        code: '648541919',
        tr: 'Soğan',
        en: 'Soğan'
      },
      {
        code: '548741318',
        tr: 'Maydanoz',
        en: 'Maydanoz'
      },
      {
        code: '371894548',
        tr: 'Pancar',
        en: 'Pancar'
      },
      {
        code: '149714319',
        tr: 'Patlıcan',
        en: 'Patlıcan'
      },
      {
        code: '361851368',
        tr: 'Kabak',
        en: 'Kabak'
      },
      {
        code: '984417319',
        tr: 'Ananas',
        en: 'Ananas'
      },
      {
        code: '894108494',
        tr: 'Şeftali',
        en: 'Şeftali'
      },
      {
        code: '31421721861',
        tr: 'Omega-3',
        en: 'Omega-3'
      },
      {
        code: '14854232190',
        tr: 'Evrensel sistem / her şey',
        en: 'Evrensel sistem / her şey'
      },
      {
        code: '5986418',
        tr: 'Köpeklerde hücresel yenilenme',
        en: 'Köpeklerde hücresel yenilenme'
      },
      {
        code: '471891498',
        tr: 'Kedilerde hücresel yenilenme',
        en: 'Kedilerde hücresel yenilenme'
      }
    ],
  },
];

export function getGrabovoiTopic(id: string) {
  return grabovoiData.find(topic => topic.id === id);
}
