// /lib/reportParser.ts
import { Zap } from "lucide-react";
import React from "react";

export function parseAIReport(aiReport: string): React.ReactNode[] {
  return aiReport
    .split("\n")
    .map((line, i) => {
      const clean = line.replace(/[*#]/g, "").trim();
      if (!clean || clean === "---") return null;

      // 1️⃣ 메인 섹션 (1. ~ 7.)
      if (/^[1-7]\.\s/.test(clean)) {
        return (
          <div key={i} className="mt-20 mb-10 pt-12 border-t border-gray-100">
            <h3 className="text-3xl md:text-5xl font-black">{clean}</h3>
          </div>
        );
      }

      // 2️⃣ 영역 섹션 (①~⑥)
      if (/^(①|②|③|④|⑤|⑥)/.test(clean)) {
        return (
          <h4
            key={i}
            className="text-2xl md:text-4xl font-black mt-16 mb-8 border-l-[12px] border-blue-600 pl-6"
          >
            {clean}
          </h4>
        );
      }

      // 3️⃣ Prefix 계약
      const prefixes = ["판정:", "데이터 근거:", "SGS 분석 코멘트:", "즉시 실행 처방:"];
      const prefix = prefixes.find(p => clean.startsWith(p));
      if (prefix) {
        return (
          <div key={i} className="mb-8">
            <span className="block text-xs font-black uppercase text-gray-400 mb-2">
              {prefix}
            </span>
            <p className="pl-5 border-l-2 border-gray-100">{clean.slice(prefix.length).trim()}</p>
          </div>
        );
      }

      // 4️⃣ 미래 시뮬레이션
      if (clean.startsWith("⚡ 미래 시뮬레이션 :")) {
        return (
          <div key={i} className="mt-8 mb-14 bg-indigo-50 p-8 rounded-2xl border-l-8 border-indigo-600">
            <p className="font-bold flex gap-3">
              <Zap size={24} />
              {clean}
            </p>
          </div>
        );
      }

      // 5️⃣ 기본 문단
      return (
        <p key={i} className="mb-10 text-gray-600 leading-relaxed">
          {clean}
        </p>
      );
    })
    .filter(Boolean);
}

