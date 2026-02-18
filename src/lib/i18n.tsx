import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Lang = 'ko' | 'en'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const LangContext = createContext<LangCtx>({
  lang: 'ko',
  setLang: () => {},
  t: (k) => k,
})

const STORAGE_KEY = 'ds_lang'

/* ═══════════════════════════════════════════════
   Dictionary — ko / en
   ═══════════════════════════════════════════════ */

const dict: Record<string, { ko: string; en: string }> = {
  // ── Nav & Pages ──
  'nav.dashboard': { ko: 'Dashboard', en: 'Dashboard' },
  'nav.masterlist': { ko: 'C/O 마스터리스트', en: 'C/O Master List' },
  'nav.traceability': { ko: 'Part Traceability', en: 'Part Traceability' },
  'nav.analytics': { ko: 'Analytics', en: 'Analytics' },
  'nav.data-entry': { ko: '데이터 입력', en: 'Data Entry' },
  'nav.settings': { ko: 'Settings', en: 'Settings' },

  // ── Page titles / subtitles ──
  'page.dashboard.sub': { ko: '', en: '' }, // uses dynamic date
  'page.masterlist.title': { ko: '부품 공용화 마스터리스트', en: 'Part Commonization Master List' },
  'page.masterlist.sub': { ko: 'H1 양산차 DB 구축 → H2 개발차 C/O 분석 | 차종 간 관계 매트릭스', en: 'H1 production DB → H2 development C/O analysis | Cross-vehicle matrix' },
  'page.traceability.sub': { ko: '부품 공용화 추적 | 원본차종→적용차종 C/O 흐름 · 시스템별 부품 상세 · 타 차종 비교', en: 'Part commonization tracking | Source→Target C/O flow · System detail · Cross-vehicle comparison' },
  'page.analytics.sub': { ko: '비C/O 사유 Pareto 분석 | 카테고리별 건수·비용·누적비율', en: 'Non-C/O Reason Pareto Analysis | Count · Cost · Cumulative ratio by category' },
  'page.data-entry.title': { ko: '데이터 입력', en: 'Data Entry' },
  'page.data-entry.sub': { ko: '차종 등록 · 부품 등록 · 비C/O 사유 입력', en: 'Vehicle registration · Part registration · Non-C/O reason entry' },
  'page.settings.sub': { ko: '데이터 관리 · 백업 · 시스템 정보', en: 'Data management · Backup · System info' },

  // ── Date helpers ──
  'date.sun': { ko: '일', en: 'Sun' },
  'date.mon': { ko: '월', en: 'Mon' },
  'date.tue': { ko: '화', en: 'Tue' },
  'date.wed': { ko: '수', en: 'Wed' },
  'date.thu': { ko: '목', en: 'Thu' },
  'date.fri': { ko: '금', en: 'Fri' },
  'date.sat': { ko: '토', en: 'Sat' },

  // ── Sidebar ──
  'sidebar.brand': { ko: 'AutoDev R&D', en: 'AutoDev R&D' },
  'sidebar.dept': { ko: 'Interior Design', en: 'Interior Design' },

  // ── Header ──
  'header.search': { ko: 'Search...', en: 'Search...' },

  // ── CoType labels ──
  'cotype.full': { ko: '1레벨 통째 C/O', en: 'L1 Full C/O' },
  'cotype.partial': { ko: '2레벨 부분 C/O', en: 'L2 Partial C/O' },
  'cotype.new': { ko: '신규개발', en: 'New Development' },
  'cotype.1level': { ko: '1레벨 C/O', en: 'L1 C/O' },
  'cotype.2level': { ko: '2레벨 부분 C/O', en: 'L2 Partial C/O' },
  'cotype.short.1level': { ko: '1레벨', en: 'L1' },
  'cotype.short.partial': { ko: '부분', en: 'Partial' },

  // ── Reason categories ──
  'reason.design': { ko: '디자인', en: 'Design' },
  'reason.spec-change': { ko: '사양변경', en: 'Spec Change' },
  'reason.regulation': { ko: '법규', en: 'Regulation' },
  'reason.new-spec': { ko: '신규사양', en: 'New Spec' },
  'reason.shape-diff': { ko: '형상차이', en: 'Shape Diff' },
  'reason.performance': { ko: '성능', en: 'Performance' },

  // ── Possibility labels ──
  'poss.high': { ko: '높음', en: 'High' },
  'poss.medium': { ko: '중간', en: 'Medium' },
  'poss.low': { ko: '낮음', en: 'Low' },
  'poss.none': { ko: '불가', en: 'None' },
  'poss.high.desc': { ko: '즉시 전환 가능', en: 'Immediate conversion possible' },
  'poss.medium.desc': { ko: '조건부 전환 가능', en: 'Conditional conversion' },
  'poss.low.desc': { ko: '향후 검토 필요', en: 'Further review needed' },
  'poss.none.desc': { ko: '전환 불가', en: 'Not convertible' },

  // ── Dashboard: Narrative ──
  'dash.narrative.title': { ko: '차량별 C/O 내러티브', en: 'Vehicle C/O Narrative' },
  'dash.narrative.sub': { ko: '전체 비용 → 공용화 현황 → 신규 가정 → 절감 효과', en: 'Total cost → C/O status → Counterfactual → Savings' },
  'dash.narrative.multiplier': { ko: '신규계수', en: 'New Dev Factor' },
  'dash.step1.label': { ko: '전체 부품 규모', en: 'Total Part Scale' },
  'dash.step2.label': { ko: '공용화 현황', en: 'C/O Status' },
  'dash.step3.label': { ko: '만약 모두 신규였다면', en: 'If All Were New Dev' },
  'dash.step4.label': { ko: '신규 대비 절감', en: 'Savings vs New Dev' },
  'dash.step1.systems': { ko: '개 시스템', en: ' systems' },
  'dash.step1.parts': { ko: '개 부품', en: ' parts' },
  'dash.step1.sales': { ko: 'K대/년', en: 'K units/yr' },
  'dash.step2.partcount': { ko: '부품 수', en: 'Part count' },
  'dash.step2.byamount': { ko: '금액 기준', en: 'By cost' },
  'dash.step3.extra': { ko: '현재 대비', en: 'vs current' },
  'dash.step3.factor': { ko: '신규개발 계수', en: 'New dev factor' },
  'dash.step3.applied': { ko: '적용', en: 'applied' },
  'dash.step4.rate': { ko: '절감률', en: 'Savings rate' },
  'dash.step4.annual': { ko: '연간', en: 'Annual' },
  'dash.step4.saving': { ko: '절감', en: 'saved' },
  'dash.narrative.summary.prefix': { ko: '는', en: '' },
  'dash.narrative.summary.of': { ko: '개 부품 중', en: ' parts, ' },
  'dash.narrative.summary.co': { ko: '개를 공용화하여, 신규 개발 대비', en: ' commonized, saving ' },
  'dash.narrative.summary.saved': { ko: '을 절감했습니다.', en: ' vs new development.' },
  'dash.narrative.annualvol': { ko: '연간 판매량', en: 'Annual volume' },
  'dash.narrative.annualbase': { ko: '대 기준, 총 절감 효과', en: ' units, total savings' },

  // ── Dashboard: Ranking ──
  'dash.ranking.title': { ko: '공용화 효과 종합 랭킹 (전 차종)', en: 'C/O Impact Ranking (All Vehicles)' },
  'dash.ranking.sub': { ko: '재료비 절감 × 판매량 + 투자비 절감 × 판매량 가중 합산', en: 'Material savings × Volume + Investment savings × Volume weighted' },
  'dash.ranking.factor': { ko: '계수', en: 'Factor' },
  'dash.ranking.col.rank': { ko: '#', en: '#' },
  'dash.ranking.col.vehicle': { ko: '차종', en: 'Vehicle' },
  'dash.ranking.col.system': { ko: '시스템', en: 'System' },
  'dash.ranking.col.type': { ko: '유형', en: 'Type' },
  'dash.ranking.col.savings': { ko: '단가절감 ($/대)', en: 'Savings ($/unit)' },
  'dash.ranking.col.volume': { ko: '판매량', en: 'Volume' },
  'dash.ranking.col.total': { ko: '총 절감효과 ($)', en: 'Total Savings ($)' },
  'dash.ranking.col.score': { ko: '종합점수', en: 'Combined Score' },

  // ── Dashboard: Awards ──
  'dash.monthly.title': { ko: '이달의 공용화 우수사례', en: 'Monthly Best C/O Practice' },
  'dash.monthly.savings': { ko: '로 단가', en: ' unit cost' },
  'dash.monthly.volume': { ko: '대 반영 시', en: ' units applied' },
  'dash.monthly.annual': { ko: '연간', en: 'Annual' },
  'dash.monthly.effect': { ko: '효과', en: 'effect' },
  'dash.monthly.bestof': { ko: 'BEST OF MONTH', en: 'BEST OF MONTH' },
  'dash.monthly.desc': { ko: '매월 공용화 효과 종합점수 1위를 전체 공지합니다. 담당 팀에게 우수사례 발표 기회가 주어집니다.', en: 'Monthly top C/O scorer is announced company-wide. The team receives a best practice presentation opportunity.' },
  'dash.annual.title': { ko: '연간 시상 제도', en: 'Annual Awards System' },
  'dash.annual.gold': { ko: '연간 종합점수 1위 시스템', en: 'Yearly top combined score system' },
  'dash.annual.silver': { ko: '연간 신규 공용화 전환 최다', en: 'Most new C/O conversions yearly' },
  'dash.annual.bronze': { ko: '설계 혁신으로 C/O 가능성 창출', en: 'C/O opportunity through design innovation' },
  'dash.annual.desc': { ko: '12월 연말 시상식에서 수여. 수상 팀에게 인센티브 및 해외 벤치마킹 기회 제공.', en: 'Awarded at December ceremony. Winners receive incentives and overseas benchmarking opportunities.' },

  // ── Dashboard: Stats ──
  'dash.stat.coeffect': { ko: 'C/O Effect (전체)', en: 'C/O Effect (Total)' },
  'dash.stat.co': { ko: '건 C/O', en: ' C/O items' },
  'dash.stat.newdev': { ko: '신규개발 비용', en: 'New Dev Cost' },
  'dash.stat.systems': { ko: '시스템', en: ' systems' },
  'dash.stat.devprojects': { ko: '개발 프로젝트', en: 'Dev Projects' },
  'dash.stat.coRate': { ko: '전체 C/O Rate', en: 'Overall C/O Rate' },

  // ── Dashboard: Charts ──
  'dash.chart.trend.title': { ko: 'C/O 절감 추이', en: 'C/O Savings Trend' },
  'dash.chart.trend.sub': { ko: '월별 실적 vs 목표 ($) — 예시 데이터', en: 'Monthly actual vs target ($) — sample data' },
  'dash.chart.trend.period': { ko: '최근 8개월', en: 'Last 8 months' },
  'dash.chart.pie.title': { ko: 'C/O 구성 비율', en: 'C/O Composition' },
  'dash.chart.pie.sub': { ko: '전체 시스템 기준', en: 'By total systems' },
  'dash.chart.bar.title': { ko: '차종별 C/O Rate', en: 'C/O Rate by Vehicle' },
  'dash.chart.pie.full': { ko: '100% C/O', en: '100% C/O' },
  'dash.chart.pie.partial': { ko: 'Partial C/O', en: 'Partial C/O' },
  'dash.chart.pie.newdev': { ko: 'New Dev', en: 'New Dev' },

  // ── Dashboard: Projects / Activity ──
  'dash.projects.title': { ko: '개발 프로젝트 (H2)', en: 'Dev Projects (H2)' },
  'dash.projects.empty': { ko: 'H2 개발 차종이 없습니다', en: 'No H2 development vehicles' },
  'dash.activity.title': { ko: '최근 활동', en: 'Recent Activity' },
  'dash.activity.empty': { ko: '아직 활동 기록이 없습니다', en: 'No activity yet' },
  'dash.activity.emptySub': { ko: '데이터 입력 시 자동 기록됩니다', en: 'Automatically recorded on data entry' },

  // ── Time labels ──
  'time.justNow': { ko: '방금 전', en: 'Just now' },
  'time.minsAgo': { ko: '분 전', en: 'm ago' },
  'time.hoursAgo': { ko: '시간 전', en: 'h ago' },
  'time.daysAgo': { ko: '일 전', en: 'd ago' },
  'time.seed': { ko: '시드 데이터', en: 'Seed data' },

  // ── Activity seed items ──
  'seed.nx8-init': { ko: 'NX8 C/O 마스터리스트 초기 구축', en: 'NX8 C/O master list initial setup' },
  'seed.ct5i-console': { ko: 'CT5i Console 2레벨 C/O 분석 완료 (12개 부품)', en: 'CT5i Console L2 C/O analysis complete (12 parts)' },
  'seed.tx6i-systems': { ko: 'TX6i IP/Door Trim 3개 시스템 등록', en: 'TX6i IP/Door Trim 3 systems registered' },
  'seed.az7i-seat': { ko: 'AZ7i Seat 1레벨 C/O 확정', en: 'AZ7i Seat L1 C/O confirmed' },
  'seed.dx4i-hvac': { ko: 'DX4i HVAC 비C/O 사유 6건 등록', en: 'DX4i HVAC 6 non-C/O reasons registered' },
  'seed.ev2i-new': { ko: 'EV2i 신규 개발차 등록 (Pre-SOP)', en: 'EV2i new dev vehicle registered (Pre-SOP)' },
  'seed.vehicle.register': { ko: '차종 등록', en: 'vehicle registered' },
  'seed.system.register': { ko: '시스템 등록', en: 'system registered' },
  'seed.reason.register': { ko: '비C/O 사유 등록', en: 'non-C/O reason registered' },

  // ── ProjectsView ──
  'proj.h1.label': { ko: 'H1 양산차 (베이스 DB 구축)', en: 'H1 Production (Base DB)' },
  'proj.h2.label': { ko: 'H2 개발차 (공용화 현황 분석)', en: 'H2 Development (C/O Analysis)' },
  'proj.stat.systems': { ko: '1레벨 시스템 수', en: 'L1 System Count' },
  'proj.stat.coRate': { ko: '2레벨 부품 공용화율', en: 'L2 Part C/O Rate' },
  'proj.stat.coCost': { ko: '공용화 포함 재료비 (1대분)', en: 'Material Cost w/ C/O (per unit)' },
  'proj.stat.effect': { ko: '공용화 효과 합계', en: 'C/O Effect Total' },
  'proj.chart.compare': { ko: '시스템별 재료비 비교', en: 'Material Cost Comparison by System' },
  'proj.chart.compareSub': { ko: '공용화 포함 vs 신규개발 ($/대)', en: 'C/O included vs New dev ($/unit)' },
  'proj.chart.coWith': { ko: '공용화 포함', en: 'With C/O' },
  'proj.chart.newDev': { ko: '신규개발', en: 'New Dev' },
  'proj.chart.coDist': { ko: '공용화 구분 (1레벨)', en: 'C/O Classification (L1)' },
  'proj.chart.coDistSub': { ko: '시스템 수 기준', en: 'By system count' },

  // ── ProjectsView: Matrix ──
  'proj.matrix.title': { ko: '차종 간 C/O 관계 매트릭스', en: 'Cross-Vehicle C/O Relationship Matrix' },
  'proj.matrix.sub': { ko: '개발차 → 베이스 차종 2레벨 부품 공용화율 (%)', en: 'Dev vehicle → Base vehicle L2 part C/O rate (%)' },
  'proj.matrix.label': { ko: '개발차 ↓ / 베이스 →', en: 'Dev ↓ / Base →' },

  // ── ProjectsView: Master list table ──
  'proj.table.title': { ko: '1레벨 마스터리스트', en: 'L1 Master List' },
  'proj.table.sub': { ko: 'BOM 기반 C/O 확인', en: 'BOM-based C/O verification' },
  'proj.table.col.no': { ko: 'No.', en: 'No.' },
  'proj.table.col.system': { ko: '1레벨 시스템', en: 'L1 System' },
  'proj.table.col.base': { ko: '베이스 차종', en: 'Base Vehicle' },
  'proj.table.col.basePNo': { ko: '기준 P/No', en: 'Base P/No' },
  'proj.table.col.coType': { ko: '공용화 구분', en: 'C/O Type' },
  'proj.table.col.reason': { ko: '신규개발 사유', en: 'New Dev Reason' },
  'proj.table.col.parts': { ko: '2레벨 부품', en: 'L2 Parts' },
  'proj.table.col.coCost': { ko: '공용화 포함 ($/대)', en: 'With C/O ($/unit)' },
  'proj.table.col.newCost': { ko: '신규개발 시 ($/대)', en: 'New Dev ($/unit)' },
  'proj.table.col.effect': { ko: '공용화 효과 ($)', en: 'C/O Effect ($)' },
  'proj.table.detail': { ko: '개 부품 상세', en: ' part details' },
  'proj.table.footer': { ko: '합계 (1대분)', en: 'Total (per unit)' },
  'proj.table.footerSystems': { ko: '개 시스템', en: ' systems' },
  'proj.filter.coType': { ko: '공용화', en: 'C/O Type' },
  'proj.filter.reason': { ko: '사유', en: 'Reason' },
  'proj.filter.all': { ko: '전체', en: 'All' },

  // ── ProjectsView: 2레벨 detail ──
  'proj.detail.title': { ko: '2레벨 부품 상세', en: 'L2 Part Details' },
  'proj.detail.col.partName': { ko: '부품명', en: 'Part Name' },
  'proj.detail.col.partNo': { ko: '파트넘버', en: 'Part Number' },
  'proj.detail.col.basePNo': { ko: '기준 P/No', en: 'Base P/No' },
  'proj.detail.col.co': { ko: 'C/O', en: 'C/O' },
  'proj.detail.col.source': { ko: 'C/O 출처 / 불가 사유', en: 'C/O Source / Reason' },
  'proj.detail.col.supplier': { ko: '협력사', en: 'Supplier' },
  'proj.detail.col.region': { ko: '지역', en: 'Region' },
  'proj.detail.col.cost': { ko: '재료비 ($)', en: 'Material ($)' },
  'proj.detail.new': { ko: '신규', en: 'New' },
  'proj.detail.subtotal': { ko: '소계', en: 'Subtotal' },
  'proj.detail.coRate': { ko: 'C/O율', en: 'C/O Rate' },
  'proj.detail.nonCo': { ko: '비C/O', en: 'Non-C/O' },

  // ── ProjectsView: 3레벨 reason detail ──
  'proj.reason.base': { ko: '베이스', en: 'BASE' },
  'proj.reason.devReq': { ko: '개발 요구', en: 'DEV REQ' },
  'proj.reason.change': { ko: '변경', en: 'CHANGE' },
  'proj.reason.keyDiff': { ko: '핵심 차이', en: 'KEY DIFFERENCE' },
  'proj.reason.whyChange': { ko: '왜 바꾸나', en: 'WHY CHANGE' },
  'proj.reason.impact': { ko: '영향 범위', en: 'IMPACT AREA' },
  'proj.reason.addCost': { ko: '추가 비용', en: 'Add. Cost' },
  'proj.reason.coPoss': { ko: '향후 C/O 전환 가능성', en: 'Future C/O Conversion Possibility' },

  // ── AnalyticsView ──
  'anal.totalNonCo': { ko: '총 비C/O 부품', en: 'Total Non-C/O Parts' },
  'anal.totalCost': { ko: '총 추가비용', en: 'Total Additional Cost' },
  'anal.topReasons': { ko: '주요 사유 (Top 2)', en: 'Top Reasons (Top 2)' },
  'anal.pareto.title': { ko: '비C/O 사유 Pareto 분석', en: 'Non-C/O Reason Pareto Analysis' },
  'anal.pareto.sub': { ko: '카테고리별 건수 + 누적 비율 (%)', en: 'Count by category + Cumulative ratio (%)' },
  'anal.pareto.count': { ko: '건수', en: 'Count' },
  'anal.pareto.cumPct': { ko: '누적 %', en: 'Cum. %' },
  'anal.detail.title': { ko: '카테고리별 상세', en: 'Category Details' },
  'anal.detail.col.reason': { ko: '사유', en: 'Reason' },
  'anal.detail.col.count': { ko: '건수', en: 'Count' },
  'anal.detail.col.cost': { ko: '추가비용', en: 'Add. Cost' },
  'anal.detail.col.ratio': { ko: '비율', en: 'Ratio' },
  'anal.detail.col.cumPct': { ko: '누적', en: 'Cum.' },
  'anal.vehicle.title': { ko: '차종별 비C/O 사유 분포', en: 'Non-C/O Reason Distribution by Vehicle' },
  'anal.vehicle.sub': { ko: 'Stacked Bar', en: 'Stacked Bar' },

  // ── OpportunityView ──
  'opp.donor': { ko: '원본차종 (Donor)', en: 'Source Vehicle (Donor)' },
  'opp.donorSub': { ko: 'C/O 소스 차종 수', en: 'Number of C/O source vehicles' },
  'opp.sharedSystems': { ko: '공용화 시스템', en: 'Shared Systems' },
  'opp.partsCo': { ko: '개 부품 공용', en: ' parts shared' },
  'opp.totalSavings': { ko: '총 절감 기여', en: 'Total Savings Contribution' },
  'opp.vsNewDev': { ko: '신규개발 대비', en: 'vs New Development' },
  'opp.avgSavings': { ko: '평균 절감/시스템', en: 'Avg. Savings/System' },
  'opp.perSystem': { ko: '시스템당 평균', en: 'Per system average' },
  'opp.chart.title': { ko: '원본차종별 절감 기여', en: 'Savings Contribution by Source Vehicle' },
  'opp.chart.sub': { ko: '각 양산차가 개발차에 기여한 원가 절감 ($/대)', en: 'Cost reduction each production vehicle contributed ($/unit)' },
  'opp.chart.tooltip': { ko: '절감 기여', en: 'Savings' },
  'opp.filter.title': { ko: '원본차종 필터', en: 'Source Vehicle Filter' },
  'opp.filter.all': { ko: '전체', en: 'All' },
  'opp.filter.systemSuffix': { ko: '시스템', en: ' systems' },
  'opp.filter.vehicleSuffix': { ko: '개 차종에서 사용', en: ' vehicles using' },
  'opp.table.title': { ko: '부품 공용화 추적 (Part Traceability)', en: 'Part Commonization Traceability' },
  'opp.table.sub': { ko: '클릭하여 2레벨 부품 상세 + 타 차종 비교 확인', en: 'Click to see L2 part details + cross-vehicle comparison' },
  'opp.table.col.target': { ko: '적용차종', en: 'Target Vehicle' },
  'opp.table.col.system': { ko: '시스템', en: 'System' },
  'opp.table.col.source': { ko: '원본', en: 'Source' },
  'opp.table.col.level': { ko: 'C/O 레벨', en: 'C/O Level' },
  'opp.table.col.parts': { ko: 'C/O 부품', en: 'C/O Parts' },
  'opp.table.col.coCost': { ko: '공용화비($/대)', en: 'C/O Cost($/u)' },
  'opp.table.col.newCost': { ko: '신규시($/대)', en: 'New Dev($/u)' },
  'opp.table.col.savings': { ko: '절감기여($)', en: 'Savings($)' },
  'opp.table.empty': { ko: '해당 조건의 공용화 데이터가 없습니다', en: 'No commonization data for this filter' },
  'opp.detail.title': { ko: '2레벨 부품 상세', en: 'L2 Part Details' },
  'opp.detail.basis': { ko: '기준', en: 'basis' },
  'opp.detail.cross.title': { ko: '타 차종 비교', en: 'Cross-Vehicle Comparison' },
  'opp.detail.cross.sub': { ko: '같은 시스템', en: 'Same system' },
  'opp.detail.cross.current': { ko: '현재', en: 'Current' },
  'opp.detail.cross.source': { ko: '원본 (신규개발)', en: 'Source (New Dev)' },
  'opp.detail.cross.base': { ko: '기준:', en: 'Base:' },
  'opp.detail.cross.coRate': { ko: 'C/O율', en: 'C/O Rate' },
  'opp.detail.subtotal': { ko: '소계', en: 'Subtotal' },
  'opp.detail.coRateLabel': { ko: 'C/O율', en: 'C/O Rate' },
  'opp.detail.nonCo': { ko: '비C/O', en: 'Non-C/O' },
  'opp.detail.col.partName': { ko: '부품명', en: 'Part Name' },
  'opp.detail.col.partNo': { ko: '파트넘버', en: 'Part No.' },
  'opp.detail.col.co': { ko: 'C/O', en: 'C/O' },
  'opp.detail.col.source': { ko: '출처/사유', en: 'Source/Reason' },
  'opp.detail.col.supplier': { ko: '협력사', en: 'Supplier' },
  'opp.detail.col.cost': { ko: '소재비($)', en: 'Material($)' },

  // ── DataEntryView ──
  'entry.tab.vehicle': { ko: '차종 등록', en: 'Vehicle Registration' },
  'entry.tab.part': { ko: '부품 등록', en: 'Part Registration' },
  'entry.tab.reason': { ko: '비C/O 사유 입력', en: 'Non-C/O Reason Entry' },
  'entry.tab.excel': { ko: '엑셀 등록', en: 'Excel Upload' },

  // Vehicle form
  'entry.vehicle.title': { ko: '신규 차종 등록', en: 'New Vehicle Registration' },
  'entry.vehicle.desc': { ko: '개발 또는 양산 차종 정보를 입력합니다', en: 'Enter development or production vehicle info' },
  'entry.vehicle.code': { ko: '차종 코드', en: 'Vehicle Code' },
  'entry.vehicle.name': { ko: '차종명', en: 'Vehicle Name' },
  'entry.vehicle.stage': { ko: '개발 단계', en: 'Dev Stage' },
  'entry.vehicle.sop': { ko: '일정 (SOP)', en: 'Schedule (SOP)' },
  'entry.vehicle.half': { ko: '반기', en: 'Half' },
  'entry.vehicle.vtype': { ko: '구분', en: 'Category' },
  'entry.vehicle.submit': { ko: '등록하기', en: 'Register' },
  'entry.vehicle.recent': { ko: '최근 등록', en: 'Recent Entries' },
  'entry.vehicle.empty': { ko: '등록된 차종이 없습니다', en: 'No vehicles registered' },
  'entry.vehicle.toast': { ko: '차종이 등록되었습니다', en: 'vehicle registered' },
  'entry.vehicle.vtype.mass': { ko: '양산', en: 'Production' },
  'entry.vehicle.vtype.dev': { ko: '개발', en: 'Development' },

  // Part form
  'entry.part.step1.title': { ko: '1레벨 시스템 정의', en: 'L1 System Definition' },
  'entry.part.step2.title': { ko: '2레벨 부품 등록', en: 'L2 Part Registration' },
  'entry.part.step1.desc': { ko: '상위 시스템을 먼저 정의합니다. 2레벨 부품은 반드시 이 시스템에 소속됩니다.', en: 'Define the parent system first. L2 parts must belong to this system.' },
  'entry.part.step1.full': { ko: 'Step 1: 1레벨 시스템 정의', en: 'Step 1: L1 System Definition' },
  'entry.part.step2.full': { ko: 'Step 2: 2레벨 세부 부품', en: 'Step 2: L2 Sub-Parts' },
  'entry.part.vehicle': { ko: '대상 차종', en: 'Target Vehicle' },
  'entry.part.coTypeLabel': { ko: 'C/O Type', en: 'C/O Type' },
  'entry.part.coType.full': { ko: '시스템 전체를 기준차종에서 그대로 가져옴', en: 'Entire system carried over from base vehicle' },
  'entry.part.coType.partial': { ko: '일부 부품만 공용화, 나머지는 신규', en: 'Some parts commonized, rest are new' },
  'entry.part.coType.new': { ko: '전체 신규 개발', en: 'Entirely new development' },
  'entry.part.systemName': { ko: '1레벨 시스템명', en: 'L1 System Name' },
  'entry.part.baseVehicle': { ko: '기준차종 (베이스)', en: 'Base Vehicle' },
  'entry.part.next': { ko: '다음: 2레벨 부품 입력', en: 'Next: L2 Part Entry' },
  'entry.part.addRow': { ko: '행 추가', en: 'Add Row' },
  'entry.part.col.partName': { ko: '부품명 *', en: 'Part Name *' },
  'entry.part.col.partNo': { ko: '부품번호 *', en: 'Part No. *' },
  'entry.part.col.co': { ko: 'C/O', en: 'C/O' },
  'entry.part.col.source': { ko: 'C/O 출처', en: 'C/O Source' },
  'entry.part.col.supplier': { ko: '공급업체', en: 'Supplier' },
  'entry.part.col.region': { ko: '지역', en: 'Region' },
  'entry.part.col.cost': { ko: '소재비($)', en: 'Material($)' },
  'entry.part.prev': { ko: '이전', en: 'Previous' },
  'entry.part.submit': { ko: '등록하기', en: 'Register' },
  'entry.part.edit': { ko: '수정', en: 'Edit' },
  'entry.part.toast': { ko: '에 등록되었습니다', en: ' registered' },
  'entry.part.belongsTo': { ko: '에 소속되는 부품을 입력합니다', en: 'Enter parts belonging to' },

  // Reason form
  'entry.reason.title': { ko: '비C/O 사유 상세', en: 'Non-C/O Reason Details' },
  'entry.reason.desc': { ko: '왜 이 부품이 공용화되지 못하는지 사유를 기록합니다', en: 'Record why this part cannot be commonized' },
  'entry.reason.selectPart': { ko: '부품 선택', en: 'Select Part' },
  'entry.reason.vehicle': { ko: '차종', en: 'Vehicle' },
  'entry.reason.system': { ko: '시스템', en: 'System' },
  'entry.reason.part': { ko: '부품', en: 'Part' },
  'entry.reason.noSub': { ko: '세부 부품 없음', en: 'No sub-parts' },
  'entry.reason.selected': { ko: '선택된 부품', en: 'Selected Part' },
  'entry.reason.category': { ko: '사유 카테고리', en: 'Reason Category' },
  'entry.reason.possibility': { ko: 'C/O 가능성', en: 'C/O Possibility' },
  'entry.reason.baseSpec': { ko: '기준 사양 (Base Spec)', en: 'Base Spec' },
  'entry.reason.newSpec': { ko: '변경 사양 (New Spec)', en: 'New Spec' },
  'entry.reason.diffDesc': { ko: '핵심 차이 설명', en: 'Key Difference Description' },
  'entry.reason.designIntent': { ko: '설계 의도 (왜 바꾸나)', en: 'Design Intent (Why Change)' },
  'entry.reason.impactArea': { ko: '영향 영역', en: 'Impact Area' },
  'entry.reason.coCondition': { ko: 'C/O 전환 조건', en: 'C/O Conversion Condition' },
  'entry.reason.addCost': { ko: '추가 비용 ($)', en: 'Additional Cost ($)' },
  'entry.reason.submit': { ko: '사유 등록하기', en: 'Register Reason' },
  'entry.reason.toast': { ko: '의 비C/O 사유가 등록되었습니다', en: ' non-C/O reason registered' },

  // Excel upload
  'entry.excel.template': { ko: '양식 다운로드', en: 'Download Template' },
  'entry.excel.templateDesc': { ko: '3개 시트가 포함된 엑셀 템플릿', en: 'Excel template with 3 sheets' },
  'entry.excel.sheet1': { ko: '차종', en: 'Vehicles' },
  'entry.excel.sheet2': { ko: '부품', en: 'Parts' },
  'entry.excel.sheet3': { ko: '비C/O 사유', en: 'Non-C/O Reasons' },
  'entry.excel.templateNote': { ko: '양식에 예시 데이터가 포함되어 있습니다.', en: 'Template includes sample data.' },
  'entry.excel.requiredNote': { ko: '* 표시 컬럼은 필수 입력입니다.', en: '* marked columns are required.' },
  'entry.excel.download': { ko: '양식 다운로드 (.xlsx)', en: 'Download Template (.xlsx)' },
  'entry.excel.parsing': { ko: '파싱 중...', en: 'Parsing...' },
  'entry.excel.uploadOther': { ko: '다른 파일을 업로드하려면 클릭하세요', en: 'Click to upload another file' },
  'entry.excel.dropzone': { ko: '엑셀 파일을 드래그하거나 클릭하여 업로드', en: 'Drag & drop Excel file or click to upload' },
  'entry.excel.supported': { ko: '.xlsx, .xls, .csv 지원', en: '.xlsx, .xls, .csv supported' },
  'entry.excel.unsupported': { ko: '지원하지 않는 파일 형식입니다. .xlsx 파일을 사용해주세요.', en: 'Unsupported file format. Please use .xlsx files.' },
  'entry.excel.parseError': { ko: '파일 파싱 중 오류가 발생했습니다.', en: 'Error occurred while parsing file.' },
  'entry.excel.warnings': { ko: '파싱 경고', en: 'Parse warnings' },
  'entry.excel.preview.vehicle': { ko: '차종 미리보기', en: 'Vehicle Preview' },
  'entry.excel.preview.part': { ko: '부품 미리보기', en: 'Part Preview' },
  'entry.excel.preview.reason': { ko: '비C/O 사유 미리보기', en: 'Non-C/O Reason Preview' },
  'entry.excel.cancel': { ko: '취소', en: 'Cancel' },
  'entry.excel.import': { ko: '건 등록하기', en: ' items to import' },
  'entry.excel.importDone': { ko: '등록 완료:', en: 'Import complete:' },
  'entry.excel.moreRows': { ko: '건 더', en: ' more rows' },

  // Preview table headers
  'entry.excel.h.code': { ko: '코드', en: 'Code' },
  'entry.excel.h.name': { ko: '차종명', en: 'Vehicle Name' },
  'entry.excel.h.stage': { ko: '단계', en: 'Stage' },
  'entry.excel.h.schedule': { ko: '일정', en: 'Schedule' },
  'entry.excel.h.half': { ko: '반기', en: 'Half' },
  'entry.excel.h.type': { ko: '구분', en: 'Type' },
  'entry.excel.h.vehicle': { ko: '차종', en: 'Vehicle' },
  'entry.excel.h.system': { ko: '시스템', en: 'System' },
  'entry.excel.h.baseV': { ko: '기준차종', en: 'Base Vehicle' },
  'entry.excel.h.coType': { ko: 'C/O Type', en: 'C/O Type' },
  'entry.excel.h.partCount': { ko: '부품수', en: 'Parts' },
  'entry.excel.h.coCount': { ko: 'C/O수', en: 'C/O Count' },
  'entry.excel.h.coCost': { ko: 'C/O비용', en: 'C/O Cost' },
  'entry.excel.h.newCost': { ko: '신규비용', en: 'New Cost' },
  'entry.excel.h.partNo': { ko: '부품번호', en: 'Part No.' },
  'entry.excel.h.category': { ko: '카테고리', en: 'Category' },
  'entry.excel.h.possibility': { ko: 'C/O 가능성', en: 'C/O Possibility' },
  'entry.excel.h.addCost': { ko: '추가비용', en: 'Add. Cost' },

  // ── SettingsView ──
  'set.data.title': { ko: '데이터 현황', en: 'Data Statistics' },
  'set.data.seed': { ko: '시드 데이터 (내장)', en: 'Seed Data (Built-in)' },
  'set.data.user': { ko: '사용자 추가 데이터', en: 'User-Added Data' },
  'set.data.vehicles': { ko: '차종', en: 'Vehicles' },
  'set.data.systems': { ko: '1레벨 시스템', en: 'L1 Systems' },
  'set.data.parts': { ko: '2레벨 부품', en: 'L2 Parts' },
  'set.data.addVehicles': { ko: '추가 차종', en: 'Added Vehicles' },
  'set.data.addSystems': { ko: '추가 시스템', en: 'Added Systems' },
  'set.data.addReasons': { ko: '추가 비C/O 사유', en: 'Added Non-C/O Reasons' },
  'set.data.storage': { ko: 'localStorage 사용량:', en: 'localStorage usage:' },
  'set.backup.title': { ko: '백업 & 복원', en: 'Backup & Restore' },
  'set.backup.desc': { ko: '사용자가 추가한 데이터를 JSON 파일로 백업/복원합니다. 시드 데이터는 항상 포함됩니다.', en: 'Backup/restore user-added data as JSON. Seed data is always included.' },
  'set.backup.download': { ko: 'JSON 백업 다운로드', en: 'Download JSON Backup' },
  'set.backup.restore': { ko: '백업 파일 복원', en: 'Restore Backup File' },
  'set.backup.downloadToast': { ko: '백업 파일이 다운로드되었습니다', en: 'Backup file downloaded' },
  'set.backup.restoreToast': { ko: '데이터가 성공적으로 복원되었습니다. 새로고침 해주세요.', en: 'Data restored successfully. Please refresh.' },
  'set.backup.invalidFile': { ko: '잘못된 백업 파일입니다', en: 'Invalid backup file' },
  'set.danger.title': { ko: '초기화', en: 'Reset' },
  'set.danger.desc': { ko: '사용자가 추가한 데이터(차종, 부품, 사유)를 모두 삭제합니다. 시드 데이터는 유지됩니다.', en: 'Delete all user-added data (vehicles, parts, reasons). Seed data is preserved.' },
  'set.danger.clear': { ko: '사용자 데이터 초기화', en: 'Clear User Data' },
  'set.danger.confirm': { ko: '정말 삭제하시겠습니까?', en: 'Are you sure you want to delete?' },
  'set.danger.confirmBtn': { ko: '삭제 확인', en: 'Confirm Delete' },
  'set.danger.cancelBtn': { ko: '취소', en: 'Cancel' },
  'set.danger.toast': { ko: '사용자 추가 데이터가 초기화되었습니다. 새로고침 해주세요.', en: 'User data cleared. Please refresh.' },
  'set.info.title': { ko: '시스템 정보', en: 'System Info' },
  'set.info.version': { ko: '버전', en: 'Version' },
  'set.info.storage': { ko: '데이터 저장', en: 'Data Storage' },
  'set.info.stack': { ko: '스택', en: 'Stack' },
  'set.info.phase2': { ko: 'Phase 2 예정', en: 'Phase 2 Planned' },
  'set.info.phase2Val': { ko: 'Supabase 멀티유저, 로그인, 감사로그', en: 'Supabase multi-user, auth, audit log' },

  // ── SearchModal ──
  'search.placeholder': { ko: '차종, 시스템, 부품명, 부품번호, 공급업체 검색...', en: 'Search vehicles, systems, parts, part numbers, suppliers...' },
  'search.empty': { ko: '검색 결과가 없습니다', en: 'No results found' },
  'search.move': { ko: '이동', en: 'Navigate' },
  'search.select': { ko: '선택', en: 'Select' },
  'search.close': { ko: '닫기', en: 'Close' },

  // ── Common ──
  'common.unit': { ko: '개', en: '' },
  'common.count': { ko: '건', en: '' },
  'common.vehicles': { ko: '대', en: '' },
  'common.new': { ko: '신규', en: 'New' },
  'common.export': { ko: 'Export', en: 'Export' },
  'common.systems': { ko: '시스템', en: 'Systems' },
  'common.subParts': { ko: '세부 부품', en: 'Sub-Parts' },

  // ── Regions ──
  'region.korea': { ko: '한국', en: 'Korea' },
  'region.india': { ko: '인도', en: 'India' },
  'region.china': { ko: '중국', en: 'China' },
  'region.japan': { ko: '일본', en: 'Japan' },
  'region.germany': { ko: '독일', en: 'Germany' },
  'region.usa': { ko: '미국', en: 'USA' },
  'region.other': { ko: '기타', en: 'Other' },
}

/* ═══════════════════════════════════════════════
   Provider
   ═══════════════════════════════════════════════ */

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'en' ? 'en' : 'ko'
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }, [])

  const t = useCallback((key: string): string => {
    const entry = dict[key]
    if (!entry) return key
    return entry[lang]
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
