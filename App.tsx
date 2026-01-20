
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  Target, 
  Brain, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  BookOpen, 
  Award,
  BarChart3, 
  Clock,
  LayoutGrid,
  AlertCircle,
  Menu, 
  ArrowRight,
  User, 
  CreditCard,
  CheckCircle2,
  Loader2,
  FileText,
  Share2,
  Download
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

import { DIAGNOSTIC_CATEGORIES, UNIVERSITY_LEVELS, DIAGNOSTIC_QUESTIONS } from './types';
import { parseAIReport } from "./lib/reportParser";

// --- Types for Flow ---
type AppStep = 'HOME' | 'APPLY' | 'PAYMENT' | 'TEST' | 'PROCESSING' | 'REPORT';

interface UserInfo {
  name: string;
  grade: string;
  phone: string;
  uniqueCode: string;
}

// --- PAI 계산 단일 진실원 (Source of Truth) ---
const calculatePAI = (catScores: Record<string, number>) => {
  let totalWeight = 0;
  let weightedScore = 0;
  DIAGNOSTIC_CATEGORIES.forEach(cat => {
    totalWeight += cat.weight;
    weightedScore += (catScores[cat.id] * cat.weight);
  });
  let total = Math.round(weightedScore / totalWeight);
  let correction = 0;
  if (catScores['D'] >= 95 && catScores['E'] <= 50) correction -= 3;
  if (catScores['B'] >= 95 && catScores['A'] <= 50) correction -= 3;
  return Math.max(0, Math.min(100, total + correction));
};

// --- Shared Components ---

const SectionTitle = ({ title, subtitle, light = false }: { title: string; subtitle?: string; light?: boolean }) => (
  <div className="mb-10 md:mb-16 text-center px-4 print:mb-8">
    <h2 className={`text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight ${light ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
    {subtitle && <p className={`text-base md:text-lg ${light ? 'text-blue-100' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>{subtitle}</p>}
  </div>
);

const Card: React.FC<{ children?: React.ReactNode; className?: string; noBaseBg?: boolean }> = ({ children, className = "", noBaseBg = false }) => (
  <div className={`${noBaseBg ? '' : 'bg-white'} rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 ${className}`}>
    {children}
  </div>
);

// --- Sections ---

const Hero = ({ onStart }: { onStart: () => void }) => (
  <section className="relative pt-24 pb-16 md:pt-48 md:pb-32 overflow-hidden bg-gradient-sgs">
    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-white/5 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-teal-500/10 rounded-full blur-3xl"></div>
    
    <div className="container mx-auto px-4 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[11px] md:text-sm font-semibold mb-6 backdrop-blur-md border border-white/20">
        <Target size={14} className="md:w-4 md:h-4" />
        <span>SNU × SKY 학습진단 : 성적이 아닌 진짜 실력을 진단하다</span>
      </div>
      <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-10 leading-tight tracking-tight px-2">
        SGS 잠재실력 진단 &<br />
        <span className="text-teal-300 underline decoration-teal-300/30">성장 예측 시스템</span>
      </h1>
      <div className="max-w-3xl mx-auto mb-10 md:mb-14">
        <p className="text-base md:text-2xl text-blue-100 leading-relaxed mb-8 px-4 font-light">
          SKY 합격생의 데이터를 기준으로 학생의 공부 습관을 정밀 분석하여,<br className="hidden md:block"/>
          2-3년 뒤 도달 가능한 대학 레벨을 예측합니다.
        </p>
        <div className="bg-white/10 backdrop-blur-sm p-5 md:p-8 rounded-2xl border border-white/20 text-blue-50 text-left md:text-center mx-2 shadow-2xl">
          <p className="font-bold text-base md:text-xl mb-2">📌 지금 이 습관 그대로라면, 고등학교에서 성적이 유지될 확률은 생각보다 낮습니다.</p>
          <p className="text-xs md:text-base opacity-90 leading-relaxed font-light">
            많은 중상위권 학생들이 “중2·중3까지는 괜찮았는데…”라는 말을 남기고 무너집니다.<br className="hidden md:block"/>
            그 차이는 ‘실력’이 아니라 ‘공부 구조’였습니다.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center px-4">
        <button onClick={onStart} className="w-full md:w-auto bg-white text-blue-900 px-8 py-4 md:py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group shadow-xl">
          내 아이의 ‘진짜 위치’ 확인하기 <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="w-full md:w-auto bg-transparent border-2 border-white/30 text-white px-8 py-4 md:py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
          SGS 프로그램 알아보기
        </button>
      </div>
    </div>
  </section>
);

const ProblemDefinition = () => (
  <section className="py-20 md:py-32 bg-white">
    <div className="container mx-auto px-4">
      <SectionTitle 
        title="기존 교육 진단의 한계" 
        subtitle="우리는 지금까지 '결과'만 보고 '원인'을 무시해왔습니다."
      />
      
      <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div className="space-y-8 md:space-y-12">
          <div className="flex gap-4 md:gap-6">
            <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
              <ShieldAlert size={28} className="md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">학원·과외가 만든 '가짜 실력'</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-lg font-light">
                초중등 때는 외부의 강한 관리가 성적을 만듭니다. 하지만 이는 학생 스스로의 실력이 아닙니다. 고등학교 진입 시 급격한 학습량 폭증과 시간 부족으로 인해 무너질 수밖에 없습니다.
              </p>
            </div>
          </div>
          <div className="flex gap-4 md:gap-6">
            <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
              <TrendingUp size={28} className="md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">예측 불가능한 미래 궤적</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-lg font-light">
                부모님들은 현재 성적 위치는 알지만, 이 성적이 <strong>'유지 가능한지'</strong>, 그리고 고등학교 이후에도 <strong>'통하는 실력인지'</strong> 알지 못합니다.
              </p>
            </div>
          </div>
          <div className="p-6 md:p-10 bg-blue-50 rounded-3xl border-l-8 border-blue-600 shadow-sm">
            <p className="text-blue-900 font-bold text-lg md:text-2xl italic mb-4 md:mb-6 leading-relaxed">
              "성적은 현재 위치일 뿐이고, 자기주도 학습력은 미래의 궤적입니다."
            </p>
            <p className="text-red-600 font-bold text-sm md:text-lg leading-relaxed">
              ❗ 성적이 괜찮을 때는 문제가 보이지 않습니다. 문제가 드러날 때는 이미 늦은 경우가 많습니다.<br className="hidden md:block"/>
              SGS 진단은 ‘문제가 생기기 전’에 구조를 확인하는 유일한 방법입니다.
            </p>
          </div>
        </div>
        <div className="relative mt-10 md:mt-0 px-4 md:px-0">
          <div className="absolute -inset-4 md:-inset-8 bg-teal-500/5 rounded-[40px] md:rounded-[60px] -rotate-2"></div>
          <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800&h=600" alt="Intense student studying" className="relative rounded-3xl md:rounded-[40px] shadow-2xl border-4 md:border-8 border-white object-cover aspect-video md:aspect-auto" />
        </div>
      </div>
    </div>
  </section>
);

const DiagnosticFrame = () => (
  <section className="py-20 md:py-32 bg-gray-50">
    <div className="container mx-auto px-4">
      <SectionTitle 
        title="SGS 핵심 진단 영역 (6대 축)" 
        subtitle="논문과 합격 수기를 기반으로 설계된 과학적인 진단 프레임워크입니다."
      />
      
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-16 px-4">
        <div className="bg-blue-600 text-white inline-block px-5 py-2 rounded-full font-bold text-xs mb-4 shadow-lg uppercase tracking-widest">Benchmark with SKY Alumni</div>
        <p className="text-gray-700 font-medium text-sm md:text-lg leading-relaxed">
          이 항목들은 모두 <strong>서울대·연세대·고려대 합격생들의 공통 패턴</strong>입니다.<br className="hidden md:block"/>
          현재 자녀의 점수보다 중요한 것은 이 항목들이 SKY 기준 대비 몇 % 수준인지입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {DIAGNOSTIC_CATEGORIES.map((cat, idx) => (
          <Card key={cat.id} className="hover:border-blue-200 hover:shadow-xl transition-all group duration-300">
            <div className="mb-6 text-blue-600 flex justify-between items-start">
              <span className="text-4xl md:text-5xl font-black text-blue-50 group-hover:text-blue-100 transition-colors leading-none">0{idx + 1}</span>
              <div className="p-3 md:p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                {idx === 0 && <Clock size={24} />}
                {idx === 1 && <Award size={24} />}
                {idx === 2 && <Brain size={24} />}
                {idx === 3 && <LayoutGrid size={24} />}
                {idx === 4 && <Zap size={24} />}
                {idx === 5 && <ShieldAlert size={24} />}
              </div>
            </div>
            <h4 className="text-xl md:text-2xl font-bold mb-3">{cat.name}</h4>
            <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed font-light">{cat.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// App JSX

const DiagnosticTool = ({
  onStart,
  finalResult
}: {
  onStart: () => void;
  finalResult: {
    pai: number;
    categories: Record<string, number>;
  } | null;
}) => {

  // 1️⃣ 초기 점수 (finalResult가 있으면 고정값, 없으면 0)
  const initialScores = useMemo(() => {
    const base: Record<string, number> = {};
    DIAGNOSTIC_CATEGORIES.forEach(cat => {
      base[cat.id] = finalResult?.categories?.[cat.id] ?? 0;
    });
    return base;
  }, [finalResult]);

  const [scores, setScores] = useState<Record<string, number>>(initialScores);

  // finalResult가 들어오면 슬라이더도 동기화
  useEffect(() => {
    setScores(initialScores);
  }, [initialScores]);

const simulatedPAI = useMemo(
  () => calculatePAI(scores),
  [scores]
);

const displayPAI = finalResult ? finalResult.pai : simulatedPAI;

const PAI_DISPLAY = displayPAI;




  const predictedLevel = useMemo(() => {
    return UNIVERSITY_LEVELS.find(l => PAI_DISPLAY >= l.range[0] && PAI_DISPLAY <= l.range[1]) || UNIVERSITY_LEVELS[UNIVERSITY_LEVELS.length - 1];
  }, [PAI_DISPLAY]);

  const chartData = useMemo(() => {
    return DIAGNOSTIC_CATEGORIES.map(cat => {
      return {
        subject: cat.name,
        student: scores[cat.id],
        sky: 100,
      };
    });
  }, [scores]);

  const handleScoreChange = (id: string, val: number) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

  return (
    <section className="py-20 md:py-32 bg-white" id="diagnosis">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="간이 잠재 실력 지수(PAI) 계산기" 
          subtitle="스스로 생각하는 자신의 학습 습관을 솔직하게 평가해보세요."
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* Inputs */}
          <Card className="space-y-10 md:space-y-12">
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">자가 진단 항목</h3>
              <p className="text-gray-500 text-sm md:text-base italic font-light">SKY 합격생의 평균 습관을 100점으로 보았을 때 나의 현재 수준은?</p>
            </div>
            {DIAGNOSTIC_CATEGORIES.map(cat => (
              <div key={cat.id} className="space-y-5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-gray-700 flex items-center gap-2 text-base md:text-lg">
                    {cat.name} 
                  </label>
                  <span className="text-blue-600 font-black text-xl md:text-2xl">{scores[cat.id]}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={scores[cat.id]} 
                  onChange={(e) => handleScoreChange(cat.id, parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-inner"
                />
              </div>
            ))}
          </Card>

          {/* Results Visual */}
          <div className="space-y-8 md:space-y-10">
            <div className="bg-slate-950 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10 md:mb-14">
                  <div className="flex items-center gap-2">
                    <Award className="text-teal-400" size={18} />
                    <h4 className="text-teal-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Potential Academic Index</h4>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold text-slate-500 border border-white/5 tracking-tighter">DATASET: SKY-2024.v1</div>
                </div>

                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-7xl md:text-9xl font-black text-white leading-none tracking-tighter">
                    {PAI_DISPLAY} {/* [1/3] 시뮬레이터 카드 */}
                  </span>
                  <span className="text-xl md:text-3xl text-slate-500 font-black tracking-widest opacity-50">/ 100</span>
                </div>
                
                <p className="text-teal-300/80 text-[10px] md:text-xs font-bold mb-10 md:mb-14">
                  SKY 합격생 평균 패턴 대비 달성률: {PAI_DISPLAY}%
                </p>
                
                <div className="mb-12 md:mb-16 bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest">SKY Benchmark Match</span>
                    <span className="font-black text-teal-400 text-lg md:text-2xl">{PAI_DISPLAY}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-5 md:h-6 rounded-full overflow-hidden p-1 border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-700 via-blue-400 to-teal-400 transition-all duration-1000 ease-out rounded-full shadow-[0_0_20px_rgba(45,212,191,0.4)]" 
                      style={{ width: `${PAI_DISPLAY}%` }}
                    />
                  </div>
                  <p className="mt-4 text-[9px] md:text-[11px] text-slate-500 italic">
                    ※ 이 점수는 현재 성적이 아닙니다. 현재 학습 습관과 행동을 기준으로 산출된 ‘성장 가능성 지표’입니다.
                  </p>
                </div>

                <div className="space-y-5 p-7 md:p-10 bg-blue-600/10 rounded-[2rem] md:rounded-[2.5rem] border border-blue-500/20 backdrop-blur-md shadow-2xl">
                  <p className="text-teal-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-2">Study Trajectory Simulation</p>
                  <div className="flex flex-col gap-3">
                    <p className="text-slate-400 text-xs md:text-sm font-medium">현재 공부 습관 유지 시 예측 대학:</p>
                    <div className="flex flex-col">
                      <p className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">
                         <span className="text-teal-400">{predictedLevel.grade}</span> : {predictedLevel.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {predictedLevel.universities.map((uni, idx) => (
                          <span key={idx} className="bg-white/5 px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-bold text-teal-200 border border-white/5 shadow-sm">
                            {uni}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 md:mt-12 space-y-6">
                  <div className="flex items-start gap-4 p-5 md:p-7 bg-red-950/40 rounded-2xl md:rounded-3xl border border-red-900/50">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={24} />
                    <div className="text-left">
                      <p className="text-red-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-2">⚠️ RISK ADVISORY</p>
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed font-bold mb-3">
                        ⚠️ 주의: 이 점수는 ‘가능성’일 뿐입니다.
                      </p>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-4">
                        지금의 공부 습관을 그대로 유지하면 이 점수는 오르지 않고, 오히려 떨어질 확률이 더 큽니다.
                        <br/><br/>
                        📌 같은 점수의 학생이라도 <strong>공부 구조를 언제 바꾸느냐</strong>에 따라 도달 대학은 완전히 달라집니다.
                      </p>
                      <button onClick={onStart} className="w-full bg-teal-500 text-white py-4 rounded-xl font-black text-sm md:text-base hover:bg-teal-400 transition-all flex items-center justify-center gap-2 shadow-xl">
                        SKY 기준 SGS 정밀 진단 리포트 받기 <ArrowRight size={18}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="h-[350px] md:h-[450px] flex flex-col">
               <h4 className="text-lg md:text-xl font-bold mb-6 md:mb-10 flex items-center gap-2 text-gray-900">
                 <BarChart3 size={24} className="text-blue-600" /> SKY 합격생 패턴 정밀 비교
               </h4>
               <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#e5e7eb" strokeWidth={2} />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="나의 점수"
                        dataKey="student"
                        stroke="#2563eb"
                        strokeWidth={3}
                        fill="#2563eb"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="SKY 합격생"
                        dataKey="sky"
                        stroke="#cbd5e1"
                        strokeWidth={1}
                        fill="#cbd5e1"
                        fillOpacity={0.1}
                      />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }} />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
               <p className="mt-4 text-[9px] md:text-[11px] text-gray-400 text-center font-medium">
                ※ 이 차트는 또래 비교가 아닌, SKY 합격생 평균을 기준으로 한 상대 위치입니다.
               </p>
            </Card>
          </div>
        </div>

        <div className="mt-20 md:mt-32 text-center max-w-4xl mx-auto px-4">
          <div className="p-8 md:p-16 bg-red-50 border border-red-100 rounded-[2.5rem] md:rounded-[4rem] shadow-sm">
             <div className="inline-block p-4 bg-red-100 text-red-600 rounded-3xl mb-8">
               <ShieldAlert size={36} className="md:w-12 md:h-12" />
             </div>
             <h3 className="text-2xl md:text-4xl font-black text-red-900 mb-8 leading-tight italic tracking-tight">“지금의 성적은 일시적 현상일 수 있습니다.”</h3>
             <p className="text-gray-800 leading-relaxed mb-10 text-base md:text-2xl font-light">
                현재 전교권 성적이라 하더라도 PAI 점수가 60점 미만이라면,<br className="hidden md:block"/> 고등학교 진학 시 급격한 성적 하락을 피할 수 없습니다. <br/>
                중요한 것은 나타난 결과(Output)가 아닌, 결과를 만드는 <strong>'구조(Input)'</strong>입니다.
             </p>
             <button onClick={onStart} className="w-full md:w-auto bg-red-600 text-white px-12 py-5 md:py-6 rounded-full font-black text-lg md:text-2xl hover:bg-red-700 transition-all shadow-2xl hover:-translate-y-1">
                정밀 진단 및 1:1 심층 상담 신청하기
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const UniversityMatrix = ({ onStart }: { onStart: () => void }) => (
  <section className="py-20 md:py-32 bg-gray-50">
    <div className="container mx-auto px-4">
      <SectionTitle 
        title="PAI 기반 대학 레벨 예측 매트릭스" 
        subtitle="학습 데이터와 입결 빅데이터를 결합한 SGS만의 정밀 예측 지표"
      />
      <div className="overflow-x-auto mb-12 shadow-2xl rounded-3xl border border-gray-100">
        <table className="w-full bg-white min-w-[800px]">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-8 py-6 text-left text-xs font-black tracking-widest uppercase">PAI Score</th>
              <th className="px-8 py-6 text-left text-xs font-black tracking-widest uppercase">Target Tier</th>
              <th className="px-8 py-6 text-left text-xs font-black tracking-widest uppercase">Key Universities</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {UNIVERSITY_LEVELS.map((level) => (
              <tr key={level.grade} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-8 py-5 font-mono text-blue-600 font-black text-lg">{`${level.range[0]}-${level.range[1]}`}</td>
                <td className="px-8 py-5 font-black text-gray-900">{level.grade}: {level.name}</td>
                <td className="px-8 py-5 text-gray-500 text-sm leading-relaxed">{level.universities.join(' · ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

const SGSSolution = () => (
  <section className="py-20 md:py-32 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
    <div className="container mx-auto px-4 text-center relative z-10">
      <div className="inline-block p-5 bg-blue-100 text-blue-600 rounded-3xl mb-8 shadow-inner">
        <Award size={56} className="md:w-16 md:h-16" />
      </div>
      <h2 className="text-3xl md:text-6xl font-black mb-8 text-gray-900 tracking-tight leading-tight">성적 이전에 '실력'을 전환합니다</h2>
      <p className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto mb-16 md:mb-24 leading-relaxed font-light">
        SGS는 단순히 문제를 풀게 하는 학원이 아닙니다. <br className="hidden md:block"/>
        학생의 학습 유전자를 수정하여 스스로 공부하는 힘을 길러주는 <br className="hidden md:block"/> <strong>자기주도 학습력 전환 프로그램</strong>입니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-left">
        {[
          { icon: <BarChart3 size={32} />, title: "정밀 진단", points: ["SGS 기반 PAI 지수 산출", "성적 하락 위기 구간 예측", "개인별 취약 습관 정밀 분석"] },
          { icon: <LayoutGrid size={32} />, title: "자기조절 훈련", points: ["SKY 합격생 공부법 동기화", "순공부시간 밀도 극대화", "오답 기반 메타인지 강화"], highlighted: true },
          { icon: <Target size={32} />, title: "지속 성장", points: ["매월 학습 행동 재진단", "학부모 정기 성장 리포트", "목표 대학 상향 조정 멘토링"] }
        ].map((item, i) => (
          <div key={i} className={`p-10 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl transition-all duration-500 hover:-translate-y-3 border ${item.highlighted ? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-gray-900 border-blue-50'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg ${item.highlighted ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
              {item.icon}
            </div>
            <h4 className="text-2xl md:text-3xl font-black mb-8">{item.title}</h4>
            <ul className="space-y-4">
              {item.points.map((p, j) => (
                <li key={j} className="flex items-center gap-3 text-sm md:text-base font-bold">
                  <div className={`w-2 h-2 rounded-full ${item.highlighted ? 'bg-teal-300' : 'bg-blue-600'}`}></div> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-950 text-gray-500 py-20 md:py-32 border-t border-gray-900 print:hidden">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg group-hover:scale-110 transition-transform">S</div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">SGS Academy</span>
          </div>
          <p className="max-w-md leading-relaxed text-sm md:text-lg text-gray-400 font-light">
            SGS는 학생들의 잠재된 공부 실력을 객관적으로 진단하고, 
            미래의 학업 성취도를 예측하여 올바른 학습 습관의 길을 제시합니다. 
            단순한 성적이 아닌, 평생 가는 <strong>지적 근력</strong>을 믿습니다.
          </p>
        </div>
        <div>
          <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-xs">Resources</h4>
          <ul className="space-y-4 font-bold text-sm">
            <li><a href="#" className="hover:text-blue-400 transition-colors">PAI 무료 진단</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">프로그램 가이드</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">성공 사례 분석</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">연구 센터</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-xs">Contact</h4>
          <ul className="space-y-3 text-xs md:text-sm font-light leading-relaxed">
            <li>서울특별시 강남구 개포로 250, SGS 아카데미 본부</li>
            <li>Tel: 02-576-0579</li>
            <li>Email: skycoach21@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 text-[10px] md:text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-8">
        <p>© 2024 SGS Potential Diagnostic System. Engineering better education.</p>
        <div className="flex gap-10">
          <a href="#" className="hover:text-white transition-colors">이용약관</a>
          <a href="#" className="hover:text-white transition-colors text-blue-400">개인정보처리방침</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App Component ---

export default function App() {
  const [step, setStep] = useState<AppStep>('HOME');
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', grade: '', phone: '', uniqueCode: '' });
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // ===============================
// 🔒 SSOT: 최종 결과 단일 진실원
// ===============================
const finalResult = useMemo<{
  pai: number;
  categories: Record<string, number>;
} | null>(() => {
  if (Object.keys(answers).length === 0) return null;

  const categoryScores: Record<string, number> = {};

  DIAGNOSTIC_CATEGORIES.forEach(cat => {
    const catQuestions = DIAGNOSTIC_QUESTIONS.filter(
      q => q.category === cat.id
    );

    const sum = catQuestions.reduce(
      (acc, q) => acc + (answers[q.id] || 0),
      0
    );

    const maxPossible = catQuestions.length * 4;

    categoryScores[cat.id] =
      maxPossible === 0 ? 0 : (sum / maxPossible) * 100;
  });

  return {
    categories: categoryScores,
    pai: calculatePAI(categoryScores)
  };
}, [answers]);

  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [aiReport, setAiReport] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const resetToHome = () => {
    setStep('HOME');
    setAnswers({});
    setCurrentQuestionIdx(0);
    setAiReport("");
    window.scrollTo(0, 0);
  };

  const startFlow = () => {
    setStep('APPLY');
    window.scrollTo(0, 0);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `SGS-${userInfo.name}-${Math.floor(1000 + Math.random() * 9000)}`;
    setUserInfo({ ...userInfo, uniqueCode: code });
    setStep('PAYMENT');
    window.scrollTo(0, 0);
  };

  const startTest = () => {
    setStep('TEST');
    window.scrollTo(0, 0);
  };

  const handleAnswer = (score: number) => {
    const q = DIAGNOSTIC_QUESTIONS[currentQuestionIdx];
    const finalScore = q.isReverse ? (4 - score) : score;
    setAnswers({ ...answers, [q.id]: finalScore });
    
    if (currentQuestionIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      generateFinalReport();
    }
  };



const generateFinalReport = async () => {
  // 🔒 중복 호출 방지
  if (step === "PROCESSING") return;
  if (!finalResult) return;

  setStep("PROCESSING");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userInfo,
        pai: finalResult.pai,
        categories: finalResult.categories,
      }),
      signal: controller.signal,
    });

    const raw = await response.text();

    if (!response.ok) {
      throw new Error(raw);
    }

    const json = JSON.parse(raw);

    if (!json.reportText) {
      throw new Error("Invalid report API response");
    }

    setAiReport(json.reportText);
    setStep("REPORT");

  } catch (err: any) {
    if (err.name === "AbortError") {
      alert("리포트 생성 시간이 초과되었습니다. 다시 시도해주세요.");
    } else {
      console.error("FINAL REPORT ERROR:", err);
      alert("리포트 생성 중 오류가 발생했습니다.");
    }
    setStep("TEST");
  } finally {
    clearTimeout(timeoutId);
  }
};




  // --- Header for Flow Steps ---
  const FlowHeader = () => (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-100 print:hidden">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={resetToHome}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg group-hover:scale-110 transition-transform">S</div>
          <span className="text-lg md:text-xl font-black text-gray-900 tracking-tighter">SGS <span className="text-blue-600 uppercase">Academy</span></span>
        </div>
        <button onClick={resetToHome} className="text-xs font-black text-gray-400 uppercase tracking-widest">나가기</button>
      </div>
    </nav>
  );

  if (step === 'APPLY') return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <FlowHeader />
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><User size={24}/></div>
            <h2 className="text-2xl font-black">진단 신청서 작성</h2>
          </div>
          <form onSubmit={handleApply} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">학생 이름</label>
              <input required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none transition-all focus:ring-2 focus:ring-blue-500" placeholder="홍길동" value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">학년</label>
              <select required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none transition-all focus:ring-2 focus:ring-blue-500" value={userInfo.grade} onChange={e => setUserInfo({...userInfo, grade: e.target.value})}>
                <option value="">학년 선택</option>
                <option value="초4 이하">초등학교 4학년 이하</option>
                <option value="초5">초등학교 5학년</option>
                <option value="초6">초등학교 6학년</option>
                <option value="중1">중학교 1학년</option>
                <option value="중2">중학교 2학년</option>
                <option value="중3">중학교 3학년</option>
                <option value="고1">고등학교 1학년</option>
                <option value="고2 이상">고등학교 2학년 이상</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">연락처</label>
              <input required type="tel" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none transition-all focus:ring-2 focus:ring-blue-500" placeholder="010-0000-0000" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-full font-black text-lg hover:bg-blue-700 shadow-xl flex items-center justify-center gap-2 group transition-all">
              입금 안내 단계로 이동 <ChevronRight className="group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (step === 'PAYMENT') return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <FlowHeader />
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><CreditCard size={120}/></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">무통장 입금 안내</h2>
            <p className="text-gray-500 text-sm mb-10 uppercase tracking-widest font-bold">Payment Instructions</p>
            <div className="space-y-6 mb-10">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase mb-2 tracking-widest">입금 계좌</p>
                <p className="text-xl font-black text-gray-900">우리은행 1002-123-456789</p>
                <p className="text-gray-600 text-sm font-medium">예금주: (주)SGS 아카데미</p>
              </div>
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <p className="text-xs text-teal-600 font-bold uppercase mb-2 tracking-widest">입금 금액</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-400 line-through text-sm">49,000원</span>
                  <span className="text-2xl font-black text-gray-900">9,900원</span>
                </div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <p className="text-xs text-red-600 font-bold uppercase mb-2 tracking-widest italic">⚠️ 필독: 입금자명 설정</p>
                <p className="text-lg font-black text-red-900 underline decoration-red-900/30 underline-offset-4">{userInfo.uniqueCode}</p>
                <p className="text-red-700 text-xs mt-2 leading-relaxed">입금자명을 반드시 위 코드로 설정해주셔야 자동 승인이 가능합니다.</p>
              </div>
            </div>
            <button onClick={startTest} className="w-full bg-blue-600 text-white py-5 rounded-full font-black text-lg hover:bg-blue-700 shadow-xl flex items-center justify-center gap-2 group transition-all">
              입금 완료했습니다. 진단 시작하기 <ChevronRight className="group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (step === 'TEST') {
    const q = DIAGNOSTIC_QUESTIONS[currentQuestionIdx];
    const progress = Math.round(((currentQuestionIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100);
    const cat = DIAGNOSTIC_CATEGORIES.find(c => c.id === q.category);

    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <FlowHeader />
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">{cat?.name}</p>
                <h2 className="text-xl font-black text-gray-900">질문 {currentQuestionIdx + 1} / {DIAGNOSTIC_QUESTIONS.length}</h2>
              </div>
              <span className="text-gray-400 font-bold text-sm">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-14 shadow-2xl border border-gray-100 min-h-[400px] flex flex-col justify-center text-center">
             <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 leading-snug">"{q.text}"</h3>
             <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
               {[
                 { label: '전혀 그렇지 않음', score: 0, index: '①' },
                 { label: '거의 그렇지 않음', score: 1, index: '②' },
                 { label: '가끔 그러함', score: 2, index: '③' },
                 { label: '자주 그러함', score: 3, index: '④' },
                 { label: '매우 그러함', score: 4, index: '⑤' },
               ].map((choice) => (
                 <button key={choice.score} onClick={() => handleAnswer(choice.score)} className="px-4 py-4 md:py-8 border-2 border-gray-100 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all group flex flex-col items-center gap-2">
                   <span className="text-lg md:text-xl font-black text-gray-300 group-hover:text-blue-600">{choice.index}</span>
                   <span className="text-[10px] md:text-xs font-bold text-gray-500 group-hover:text-blue-900">{choice.label}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (step === 'PROCESSING') return (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <div className="text-center max-w-xl">

      {/* SGS System Loader */}
      <div className="relative w-20 h-20 mx-auto mb-10">
        <div className="absolute inset-0 rounded-full border-4 border-teal-400/20" />
        <div className="absolute inset-0 rounded-full border-t-4 border-teal-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-teal-400 font-black text-xs">
          SGS
        </div>
      </div>

      <h2 className="text-2xl md:text-4xl font-black text-white mb-6 leading-tight">
        SGS 학습진단 시스템이<br />
        {userInfo.name} 학생의 학습 데이터를 구조화하고 있습니다
      </h2>

      <p className="text-teal-400 font-black uppercase tracking-[0.25em] text-xs">
        SGS SYSTEM PROCESSING
      </p>

    </div>
  </div>
);


if (step === 'REPORT') {
  if (!finalResult) return null;

  const radarData = DIAGNOSTIC_CATEGORIES.map(cat => ({
    subject: cat.name,
    student: Math.round(finalResult.categories[cat.id] ?? 0),
    sky: 100,
  }));

  const level =
    UNIVERSITY_LEVELS.find(
      l =>
        finalResult.pai >= l.range[0] &&
        finalResult.pai <= l.range[1]
    ) || UNIVERSITY_LEVELS[UNIVERSITY_LEVELS.length - 1];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 print:bg-white">
      <FlowHeader />

      <div className="container mx-auto px-4 max-w-4xl print:max-w-none print:px-0">

        {/* ===== 리포트 헤더 ===== */}
        <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl mb-8 border border-white/5 print:rounded-none print:shadow-none print:bg-slate-900">
          {/* ... (헤더 내용 동일) */}
        </div>

        {/* ===== 리포트 본문 ===== */}
        <div className="space-y-12">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-xl border border-gray-100 print:rounded-none print:shadow-none print:border-none">
            <div className="prose prose-blue max-w-none">
              {aiReport
                ? parseAIReport(aiReport)
                : <p className="text-gray-400 italic">리포트를 불러오는 중입니다...</p>}
            </div>
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="mt-16 bg-teal-50 border border-teal-100 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 print:hidden">
          <div className="bg-teal-500 text-white p-4 rounded-2xl shadow-lg">
            <CheckCircle2 size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black text-teal-900 mb-2">
              진단 결과에 따른 맞춤 처방이 필요하십니까?
            </h4>
            <p className="text-teal-700">
              이 진단 결과를 바탕으로 학생의 학습 구조를 완전히 전환할
              <strong> ‘SGS 12주 트레이닝’ </strong>
              상담을 신청하세요.
            </p>
          </div>
          <button className="bg-gray-900 text-white px-8 py-5 rounded-full font-black text-sm shadow-xl">
            1:1 전문가 상담 예약
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}

// 🔒 기본 HOME 화면 (App 함수의 최종 return)
return (
  <>
    <Hero onStart={startFlow} />
    <ProblemDefinition />
    <DiagnosticFrame />
    <DiagnosticTool onStart={startFlow} finalResult={finalResult} />
    <UniversityMatrix onStart={startFlow} />
    <SGSSolution />
    <Footer />
  </>
);

