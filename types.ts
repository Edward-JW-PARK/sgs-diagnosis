
export interface DiagnosticCategory {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export interface UniversityLevel {
  grade: string;
  name: string;
  range: [number, number];
  universities: string[];
}

export interface DiagnosticQuestion {
  id: string;
  category: string;
  text: string;
  isReverse?: boolean;
}

export const DIAGNOSTIC_CATEGORIES: DiagnosticCategory[] = [
  { id: 'A', name: '학습 시간의 질', weight: 20, description: '순공·산출물·실행률' },
  { id: 'B', name: '집중력 & 몰입 지속력', weight: 20, description: '몰입 지속 시간 및 외부 유혹 통제' },
  { id: 'C', name: '끈기 & 회복탄력성(Grit)', weight: 15, description: '난관 돌파 및 실패 후 회복력' },
  { id: 'D', name: '메타인지', weight: 20, description: '약점 인식 및 지식 구조화 능력' },
  { id: 'E', name: '학습 전략 레벨', weight: 15, description: '오답 관리 및 복습 시스템' },
  { id: 'F', name: '학습 환경 & 구조 통제', weight: 10, description: '학원 의존도 및 공부 환경 독립성' },
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // A: 학습 시간의 질 (8문항)
  { id: 'a1', category: 'A', text: '학원 수업 시간을 제외하고, 매일 정해진 순공 시간을 3시간 이상 확보하여 실천합니까?' },
  { id: 'a2', category: 'A', text: '학습 계획을 수립할 때, 공부 분량보다 완료해야 할 시간 단위를 구체적으로 기록합니까?' },
  { id: 'a3', category: 'A', text: '공부 도중 스마트폰을 확인하거나 딴생각을 하느라 계획된 시간을 허비하는 경우가 잦습니까?', isReverse: true },
  { id: 'a4', category: 'A', text: '그날 배운 핵심 내용을 당일에 최소 10분이라도 반드시 다시 훑어보는 습관이 있습니까?' },
  { id: 'a5', category: 'A', text: '매일 밤 잠들기 전, 오늘 세운 공부 계획의 실행률이 80%를 넘습니까?' },
  { id: 'a6', category: 'A', text: '책상에 앉아서 실제로 책을 펴고 집중을 시작하기까지 10분 이상의 시간이 걸립니까?', isReverse: true },
  { id: 'a7', category: 'A', text: '주말을 활용해 평일에 미처 다하지 못한 공부 분량을 빠짐없이 보충하고 있습니까?' },
  { id: 'a8', category: 'A', text: '공부한 시간만큼 실제 문제 풀이나 노트 정리 등의 가시적인 산출물이 충분하다고 느낍니까?' },

  // B: 집중력 & 몰입 지속력 (8문항)
  { id: 'b1', category: 'B', text: '한 번 공부를 시작하면 외부의 방해 없이 최소 60분 이상 끊김 없이 몰입할 수 있습니까?' },
  { id: 'b2', category: 'B', text: '주변의 작은 소음이나 가족들의 대화 소리에도 쉽게 집중력이 흐트러지는 편입니까?', isReverse: true },
  { id: 'b3', category: 'B', text: '공부를 시작할 때 스마트폰을 다른 방에 두거나 완전히 보이지 않게 차단합니까?' },
  { id: 'b4', category: 'B', text: '딴생각이 들더라도 곧바로 이를 인지하고 다시 공부 내용으로 의식을 되돌릴 수 있습니까?' },
  { id: 'b5', category: 'B', text: '공부 공간의 정돈 상태나 필기구의 느낌 등 주변 환경 조건에 예민하여 집중이 늦어집니까?', isReverse: true },
  { id: 'b6', category: 'B', text: '어려운 킬러 문항을 풀 때 시간의 흐름을 잊을 정도로 깊이 있게 빠져드는 경험을 자주 합니까?' },
  { id: 'b7', category: 'B', text: '공부 도중 물을 마시러 가거나 화장실을 가는 등의 이유로 자리를 비우는 횟수가 많습니까?', isReverse: true },
  { id: 'b8', category: 'B', text: '자신의 집중력이 가장 높은 시간대를 정확히 파악하여 그 시간에 어려운 과목을 배치합니까?' },

  // C: 끈기 & 회복탄력성 (8문항)
  { id: 'c1', category: 'C', text: '풀리지 않는 어려운 문제를 만났을 때, 답지를 보기 전 최소 20분 이상 스스로 고민합니까?' },
  { id: 'c2', category: 'C', text: '한 번 시작한 문제집이나 온라인 강의는 중도 포기 없이 마지막 페이지까지 완수합니까?' },
  { id: 'c3', category: 'C', text: '노력한 만큼 성적이 나오지 않았을 때, 실망감 때문에 학습 루틴이 며칠씩 무너지는 편입니까?', isReverse: true },
  { id: 'c4', category: 'C', text: '몸이 피곤하거나 기분이 좋지 않은 날에도 정해진 최소한의 학습량은 반드시 지킵니까?' },
  { id: 'c5', category: 'C', text: '원하는 대학 합격이라는 장기적 목표를 위해 당장의 오락이나 휴식을 뒤로 미룰 수 있습니까?' },
  { id: 'c6', category: 'C', text: '시험에서 실수를 했을 때, 감정적으로 자책하기보다 구체적인 원인을 분석하고 보완합니까?' },
  { id: 'c7', category: 'C', text: '학습량이 평소보다 조금만 많아져도 쉽게 지치고 금방 의욕을 상실하는 편입니까?', isReverse: true },
  { id: 'c8', category: 'C', text: '방학이나 공휴일에도 평일과 다름없는 긴장감과 학습 밀도를 유지하려고 노력합니까?' },

  // D: 메타인지 (8문항)
  { id: 'd1', category: 'D', text: '공부가 끝난 직후, 배운 내용을 백지에 스스로 써 내려가거나 남에게 설명할 수 있습니까?' },
  { id: 'd2', category: 'D', text: '자신이 이미 알고 있는 것과 아직 모르는 것을 명확히 구분하여 공부 비중을 조절합니까?' },
  { id: 'd3', category: 'D', text: '문제를 풀고 나서, 정답인 이유뿐만 아니라 오답이 왜 오답인지 논리적으로 설명 가능합니까?' },
  { id: 'd4', category: 'D', text: '공부를 하는 도중, 내가 제대로 이해하며 진도를 나가고 있는지 스스로 질문하며 확인합니까?' },
  { id: 'd5', category: 'D', text: '자신의 취약한 과목과 가장 보완이 필요한 단원 3가지를 구체적으로 알고 있습니까?' },
  { id: 'd6', category: 'D', text: '답을 맞혔더라도 풀이 과정이 조금이라도 모호하다면 반드시 다시 확인하고 넘어갑니까?' },
  { id: 'd7', category: 'D', text: '학습 계획을 세울 때, 자신의 실제 소화 능력보다 지나치게 많은 범위를 설정하는 경향이 있습니까?', isReverse: true },
  { id: 'd8', category: 'D', text: '새로운 개념을 배울 때, 이전에 알고 있던 지식과 어떻게 연결되는지 스스로 생각합니까?' },

  // E: 학습 전략 레벨 (8문항)
  { id: 'e1', category: 'E', text: '틀린 문제를 단순 확인하는 것에 그치지 않고, 주기적으로 다시 풀어보는 오답 시스템이 있습니까?' },
  { id: 'e2', category: 'E', text: '공부 시작 전 목차를 먼저 훑어보며 전체적인 지식의 구조를 먼저 파악하는 편입니까?' },
  { id: 'e3', category: 'E', text: '과목별 특성(수학의 논리, 국어의 독해 등)에 맞춰 학습 전략을 다르게 적용하고 있습니까?' },
  { id: 'e4', category: 'E', text: '요약 노트나 마인드맵 등을 활용하여 복잡한 지식을 자신만의 언어로 구조화합니까?' },
  { id: 'e5', category: 'E', text: '에빙하우스 망각곡선을 고려하여 일주일 단위의 누적 복습 시간을 따로 배정하고 있습니까?' },
  { id: 'e6', category: 'E', text: '공부 중 이해되지 않는 부분은 별도로 체크해두었다가 반드시 질문이나 검색으로 해결합니까?' },
  { id: 'e7', category: 'E', text: '시험 직전, 내가 무엇을 알고 무엇을 모르는지 최종 점검할 수 있는 체크리스트가 있습니까?' },
  { id: 'e8', category: 'E', text: '인강을 볼 때 배속 시청에만 의존하거나, 필기 없이 단순히 시청만 하는 경우가 많습니까?', isReverse: true },

  // F: 학습 환경 & 구조 통제 (8문항)
  { id: 'f1', category: 'F', text: '부모님의 잔소리나 학원의 호출 없이도 정해진 시간이 되면 스스로 책상에 앉습니까?' },
  { id: 'f2', category: 'F', text: '학원 숙제와 진도에 급급하지 않고, 자신만의 독립적인 학습 계획을 주도적으로 끌고 갑니까?' },
  { id: 'f3', category: 'F', text: '자신의 공부 방이나 책상 주변에 집중을 방해하는 물건이 전혀 없도록 철저히 관리합니까?' },
  { id: 'f4', category: 'F', text: '주변 친구들의 공부 페이스나 소문에 쉽게 흔들려 자신의 학습 리듬을 잃는 경우가 잦습니까?', isReverse: true },
  { id: 'f5', category: 'F', text: '자신에게 가장 잘 맞는 최적의 공부 환경(조도, 소음 수준 등)이 어디인지 알고 있습니까?' },
  { id: 'f6', category: 'F', text: '모르는 문제가 나오면 스스로 고민하기보다 학원 선생님이나 답지에 바로 의존하는 편입니까?', isReverse: true },
  { id: 'f7', category: 'F', text: '공부 도구(필기구, 태블릿, 책상 꾸미기)를 갖추는 일보다 학습 내용 자체에 더 집중합니까?' },
  { id: 'f8', category: 'F', text: '학습에 필요한 교재, 유인물, 준비물 등을 타인의 도움 없이 스스로 챙기고 관리합니까?' },
];

export const UNIVERSITY_LEVELS: UniversityLevel[] = [
  { grade: '1급', name: '최상위권 (Summit)', range: [96, 100], universities: ['최상위 의·치·한·약·수', '서울대'] },
  { grade: '2급', name: '초명문권', range: [90, 95], universities: ['연세대', '고려대', '카이스트', '포스텍'] },
  { grade: '3급', name: '상위권 명문', range: [86, 89], universities: ['서강대', '성균관대', '한양대', '지스트', '유니스트', '디지스트'] },
  { grade: '4급', name: '서울 주요권', range: [80, 85], universities: ['중앙대', '경희대', '한국외대', '시립대', '이화여대'] },
  { grade: '5급', name: '서울 핵심권', range: [76, 79], universities: ['건국대', '동국대', '홍익대'] },
  { grade: '6급', name: '수도권/거점국립', range: [70, 75], universities: ['인하대', '아주대', '경북대', '부산대', '국민대', '숭실대', '세종대', '숙명여대', '광운대', '서울과기대'] },
  { grade: '7급', name: '주요 거점권', range: [66, 69], universities: ['항공대', '에리카', '단국대', '성신여대', '가천대', '인천대', '충남대', '전남대'] },
  { grade: '8급', name: '수도권 중견권', range: [60, 65], universities: ['명지대', '상명대', '한국공학대', '가톨릭대', '경기대', '충북대', '부경대', '전북대', '한성대', '한국기술교육대'] },
  { grade: '9급', name: '지방 주요권', range: [50, 59], universities: ['서울여대', '덕성여대', '동덕여대', '서경대', '삼육대', '경상국립대', '수원대', '강원대', '기타지방주요대학'] },
  { grade: '10급', name: '집중 개선 필요', range: [0, 49], universities: ['학습 습관 및 전략의 근본적 전환이 시급함'] },
];
