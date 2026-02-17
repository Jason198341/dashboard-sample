import { useState, Fragment } from 'react'
import {
  LayoutDashboard, FolderKanban, BarChart3, Users, Settings, Search,
  Bell, ChevronDown, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight,
  Car, Wrench, Target, Calendar, Filter, Download, CheckCircle2, CircleDot, CirclePlus, X
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

/* ─── Data ─── */
const monthlyData = [
  { month: 'Jul', actual: 280, target: 300 },
  { month: 'Aug', actual: 320, target: 300 },
  { month: 'Sep', actual: 350, target: 320 },
  { month: 'Oct', actual: 310, target: 330 },
  { month: 'Nov', actual: 380, target: 340 },
  { month: 'Dec', actual: 420, target: 350 },
  { month: 'Jan', actual: 460, target: 360 },
  { month: 'Feb', actual: 412, target: 336 },
]

const coData = [
  { name: 'CT5i', rate: 78 },
  { name: 'VN3', rate: 85 },
  { name: 'AZ7i', rate: 72 },
  { name: 'TX6i', rate: 65 },
  { name: 'DX4i', rate: 58 },
]

const pieData = [
  { name: '100% C/O', value: 42, color: '#3182F6' },
  { name: 'Partial C/O', value: 31, color: '#93C5FD' },
  { name: 'New Dev', value: 27, color: '#E5E7EB' },
]

const projects = [
  { code: 'NX8', stage: '모델선정', date: "'28.8", progress: 35, status: 'active' },
  { code: 'TX6i', stage: '시작차', date: "'26.10", progress: 72, status: 'active' },
  { code: 'DX4i', stage: 'ALL도', date: "'27.8", progress: 48, status: 'active' },
  { code: 'EV2i', stage: '시작차', date: "'27.1", progress: 55, status: 'review' },
  { code: 'CT5i F/L', stage: '양산', date: "'26.6", progress: 88, status: 'active' },
]

const recentActivity = [
  { action: 'NX8 C/O 마스터리스트 업데이트', user: 'Kim S.', time: '2시간 전' },
  { action: 'CT5i Pre-SR 절감안 3건 등록', user: 'Lee J.', time: '4시간 전' },
  { action: 'TX6i 2열 시트 검토 완료', user: 'Choi M.', time: '어제' },
  { action: 'AZ7i NCAP 평가 결과 공유', user: 'Park H.', time: '어제' },
  { action: 'VN3 도어트림 FMEA 갱신', user: 'Jung D.', time: '2일 전' },
]

/* ─── 차종별 1레벨 마스터리스트 ─── */
type CoType = '1레벨 C/O' | '2레벨 부분 C/O' | '신규개발'

interface ReasonDetail {
  category: '디자인' | '사양변경' | '법규' | '신규사양' | '형상차이' | '성능'
  baseSpec: string           // 베이스 차종 현재 사양
  newSpec: string            // 개발 차종 요구 사양
  diffDescription: string    // 구체적 차이 설명
  designIntent: string       // 변경 의도/배경
  impactArea: string         // 영향 범위 (금형, 조립, 검증 등)
  coPossibility: 'high' | 'medium' | 'low' | 'none'  // 향후 C/O 가능성
  coCondition?: string       // C/O 가능 조건
  additionalCost: number     // 신규개발 추가 비용 ($)
}

interface SubPart {
  partName: string         // 2레벨 부품명
  partNo: string           // 파트넘버
  isCo: boolean            // C/O 여부
  coSource?: string        // C/O 출처 차종
  nonCoReason?: string     // C/O 불가 사유
  reasonDetail?: ReasonDetail  // 비C/O 사유 상세
  supplier: string         // 협력사
  supplierRegion: string   // 협력사 지역
  materialCost: number     // 재료비 ($/개)
}

interface MasterPart {
  system: string
  baseVehicle: string
  coType: CoType
  subParts: number
  coSubParts: number
  coCost: number
  newDevCost: number
  details?: SubPart[]      // 2레벨 상세 (있는 경우만)
}

interface VehicleInfo {
  code: string
  name: string
  stage: string
  date: string
  half: 'H1' | 'H2'
  type: '양산' | '개발'
  parts: MasterPart[]
}

const vehicles: VehicleInfo[] = [
  // ─── H1 양산차 (베이스 DB 구축) ───
  {
    code: 'VN3', name: 'AY (Sedan-A)', stage: '양산', date: "'24.6", half: 'H1', type: '양산',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: '-', coType: '신규개발', subParts: 16, coSubParts: 0, coCost: 0, newDevCost: 118.4 },
      { system: 'Console', baseVehicle: '-', coType: '신규개발', subParts: 10, coSubParts: 0, coCost: 0, newDevCost: 52.8 },
      { system: 'Door Trim', baseVehicle: '-', coType: '신규개발', subParts: 20, coSubParts: 0, coCost: 0, newDevCost: 98.6 },
      { system: 'Seat (Fr/Rr)', baseVehicle: '-', coType: '신규개발', subParts: 34, coSubParts: 0, coCost: 0, newDevCost: 256.2 },
      { system: 'HVAC / Air Vent', baseVehicle: '-', coType: '신규개발', subParts: 14, coSubParts: 0, coCost: 0, newDevCost: 88.4 },
      { system: 'Headliner', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 48.2 },
      { system: 'Pillar Trim', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 24.6 },
      { system: 'Steering Wheel', baseVehicle: '-', coType: '신규개발', subParts: 6, coSubParts: 0, coCost: 0, newDevCost: 34.8 },
      { system: 'Carpet / Floor', baseVehicle: '-', coType: '신규개발', subParts: 6, coSubParts: 0, coCost: 0, newDevCost: 28.4 },
      { system: 'Garnish / Molding', baseVehicle: '-', coType: '신규개발', subParts: 10, coSubParts: 0, coCost: 0, newDevCost: 18.6 },
    ],
  },
  {
    code: 'CT5i', name: 'CT5i (SUV-B)', stage: '양산', date: "'24.1", half: 'H1', type: '양산',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: '-', coType: '신규개발', subParts: 18, coSubParts: 0, coCost: 0, newDevCost: 132.5 },
      { system: 'Console', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 5, coCost: 48.2, newDevCost: 62.4 },
      { system: 'Door Trim', baseVehicle: '-', coType: '신규개발', subParts: 24, coSubParts: 0, coCost: 0, newDevCost: 124.8 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 38, coSubParts: 12, coCost: 242.6, newDevCost: 298.4 },
      { system: 'HVAC / Air Vent', baseVehicle: '-', coType: '신규개발', subParts: 16, coSubParts: 0, coCost: 0, newDevCost: 101.0 },
      { system: 'Headliner', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 52.6 },
      { system: 'Pillar Trim', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 28.6 },
      { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 34.8, newDevCost: 38.2 },
      { system: 'Carpet / Floor', baseVehicle: '-', coType: '신규개발', subParts: 6, coSubParts: 0, coCost: 0, newDevCost: 32.6 },
      { system: 'Garnish / Molding', baseVehicle: '-', coType: '신규개발', subParts: 10, coSubParts: 0, coCost: 0, newDevCost: 21.8 },
    ],
  },
  {
    code: 'AZ7i', name: 'AZ7i (MPV-C)', stage: '양산', date: "'25.12", half: 'H1', type: '양산',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 12, coCost: 98.4, newDevCost: 138.2 },
      { system: 'Console', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 8, coCost: 48.6, newDevCost: 68.4 },
      { system: 'Door Trim', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 16, coCost: 92.4, newDevCost: 132.8 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 38, coSubParts: 24, coCost: 228.6, newDevCost: 312.4 },
      { system: 'HVAC / Air Vent', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 16, coSubParts: 16, coCost: 101.0, newDevCost: 108.2 },
      { system: 'Headliner', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 10, coSubParts: 6, coCost: 44.8, newDevCost: 62.4 },
      { system: 'Pillar Trim', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 8, coSubParts: 8, coCost: 28.6, newDevCost: 32.4 },
      { system: 'Steering Wheel', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 38.2, newDevCost: 42.6 },
      { system: 'Carpet / Floor', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 6, coSubParts: 4, coCost: 26.8, newDevCost: 36.2 },
      { system: 'Package Tray', baseVehicle: '-', coType: '신규개발', subParts: 4, coSubParts: 0, coCost: 0, newDevCost: 16.8 },
    ],
  },
  // ─── H2 개발차 (공용화 현황) ───
  {
    code: 'DX4i', name: 'DX4i (Crossover)', stage: 'ALL도', date: "'27.8", half: 'H2', type: '개발',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 13, coCost: 92.4, newDevCost: 135.6 },
      { system: 'Console', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 12, coSubParts: 12, coCost: 62.4, newDevCost: 72.8 },
      { system: 'Door Trim', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 18, coCost: 96.4, newDevCost: 138.2 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 36, coSubParts: 22, coCost: 218.4, newDevCost: 308.6 },
      { system: 'HVAC / Air Vent', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 16, coSubParts: 16, coCost: 101.0, newDevCost: 112.4 },
      { system: 'Headliner', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 10, coSubParts: 10, coCost: 62.4, newDevCost: 68.2 },
      { system: 'Pillar Trim', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 8, coSubParts: 8, coCost: 28.6, newDevCost: 34.8 },
      { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 34.8, newDevCost: 42.2 },
      { system: 'Carpet / Floor', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 32.6, newDevCost: 38.4 },
      { system: 'Garnish / Molding', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 10, coSubParts: 7, coCost: 16.2, newDevCost: 24.6 },
    ],
  },
  {
    code: 'EV2i', name: 'EV2i (Electric SUV)', stage: '시작차', date: "'27.1", half: 'H2', type: '개발',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 20, coSubParts: 10, coCost: 108.4, newDevCost: 168.2 },
      { system: 'Console', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 14, coSubParts: 6, coCost: 52.6, newDevCost: 82.4 },
      { system: 'Door Trim', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 14, coCost: 98.4, newDevCost: 148.6 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 40, coSubParts: 18, coCost: 248.6, newDevCost: 362.4 },
      { system: 'HVAC / Air Vent', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 10, coCost: 88.4, newDevCost: 128.6 },
      { system: 'Headliner', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 10, coSubParts: 6, coCost: 48.2, newDevCost: 72.4 },
      { system: 'Pillar Trim', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 8, coSubParts: 4, coCost: 22.4, newDevCost: 38.6 },
      { system: 'Steering Wheel', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 52.8 },
      { system: 'Carpet / Floor', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 36.2, newDevCost: 42.4 },
      { system: 'Battery Cover', baseVehicle: '-', coType: '신규개발', subParts: 6, coSubParts: 0, coCost: 0, newDevCost: 48.6 },
    ],
  },
  {
    code: 'TX6i', name: 'TX6i (SUV-F)', stage: '시작차', date: "'26.10", half: 'H2', type: '개발',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 11, coCost: 96.8, newDevCost: 142.4 },
      { system: 'Console', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 8, coCost: 48.6, newDevCost: 74.2 },
      { system: 'Door Trim', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 15, coCost: 94.8, newDevCost: 142.6 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 38, coSubParts: 20, coCost: 232.4, newDevCost: 328.6 },
      { system: 'HVAC / Air Vent', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 16, coSubParts: 16, coCost: 101.0, newDevCost: 118.4 },
      { system: 'Headliner', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 10, coSubParts: 10, coCost: 62.4, newDevCost: 72.8 },
      { system: 'Pillar Trim', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 8, coSubParts: 8, coCost: 28.6, newDevCost: 36.2 },
      { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 6, coSubParts: 4, coCost: 32.4, newDevCost: 44.8 },
      { system: 'Carpet / Floor', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 32.6, newDevCost: 38.4 },
      { system: 'Garnish / Molding', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 10, coSubParts: 6, coCost: 14.8, newDevCost: 24.2 },
    ],
  },
  // ─── NX8 (기존) ───
  {
    code: 'NX8', name: 'NX8 (MPV-G)', stage: '모델선정', date: "'28.8", half: 'H2', type: '개발',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 14, coCost: 88.9, newDevCost: 129.8, details: [
        { partName: 'IP Frame Assy', partNo: 'NX-IP-001', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 12.4 },
        { partName: 'IP Upper Pad', partNo: 'NX-IP-002', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 8.6 },
        { partName: 'IP Lower Cover', partNo: 'NX-IP-003', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.2 },
        { partName: 'Glove Box Assy', partNo: 'NX-IP-004', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 4.8 },
        { partName: 'Glove Box Striker', partNo: 'NX-IP-005', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 0.6 },
        { partName: 'Cluster Hood', partNo: 'NX-IP-006', isCo: false, nonCoReason: '디자인 차별화 — 전용 클러스터 형상 변경', reasonDetail: {
          category: '디자인', baseSpec: 'CT5i: 아날로그+4.2" MID 조합, 후드 개구부 W 280mm × H 120mm', newSpec: 'NX8: 12.3" Full Digital Cluster, 후드 개구부 W 320mm × H 95mm (와이드형)',
          diffDescription: '클러스터 디스플레이가 아날로그→풀디지털로 변경되면서 후드 개구부 폭이 40mm 확대, 높이 25mm 축소됨. 후드 상단 곡률(R)이 CT5i R180→NX8 R250으로 변경되어 금형 전면 신규 필요. 내부 차광 리브 구조도 디스플레이 반사각 대응으로 재설계.',
          designIntent: 'NX8 MPV 포지셔닝에 맞는 프리미엄 계기판 경험 제공. 12.3" 풀디지털 클러스터는 NX8 핵심 USP 중 하나로 디자인팀 필수 요구사항.',
          impactArea: '금형 신규 1벌 (사출 금형 + 도장 지그), 클러스터 모듈 조립 지그 변경, 광학 검증 시험 추가',
          coPossibility: 'low', coCondition: 'CT5i F/L에서 동일 12.3" 클러스터 적용 시 역C/O 가능 (\'28년 이후)',
          additionalCost: 2.1
        }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.8 },
        { partName: 'Center Fascia Panel', partNo: 'NX-IP-007', isCo: false, nonCoReason: 'AVN 디스플레이 사이즈 변경 (10.25→12.3")', reasonDetail: {
          category: '사양변경', baseSpec: 'CT5i: 10.25" AVN, 파시아 개구부 W 262mm × H 165mm, 고정 브래킷 4점', newSpec: 'NX8: 12.3" AVN, 파시아 개구부 W 305mm × H 180mm, 고정 브래킷 6점 + 플로팅 구조',
          diffDescription: 'AVN 디스플레이 10.25"→12.3" 확대에 따라 파시아 패널 개구부 폭 43mm, 높이 15mm 증가. 디스플레이 고정 방식이 후면 4점 클립→6점 플로팅 마운트로 변경되어 파시아 후면 리브 구조 전면 재설계. 에어컨 조작부가 물리 버튼→터치 통합으로 변경되면서 파시아 하단 형상도 변경.',
          designIntent: '12.3" 대화면 AVN은 인도 시장 경쟁 대응 필수 사양 (Kushaq 10", Creta 10.25" 대비 차별화). 플로팅 구조로 프리미엄 감성 확보.',
          impactArea: '사출 금형 신규, 도장 지그 변경, AVN 모듈 조립 공정 변경, EMC/NVH 재검증 필요',
          coPossibility: 'medium', coCondition: 'CT5i F/L에서 12.3" AVN 동시 적용 확정 시 파시아 공용 설계 가능. 다만 에어컨 조작부 통합 여부에 따라 하단부 별도 검토 필요.',
          additionalCost: 3.8
        }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 6.4 },
        { partName: 'Side Defroster Duct', partNo: 'NX-IP-008', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 1.8 },
        { partName: 'Center Vent Assy', partNo: 'NX-IP-009', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 3.2 },
        { partName: 'Side Vent LH', partNo: 'NX-IP-010', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 2.4 },
        { partName: 'Side Vent RH', partNo: 'NX-IP-011', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 2.4 },
        { partName: 'Cowl Cross Bar', partNo: 'NX-IP-012', isCo: true, coSource: 'CT5i', supplier: 'Sungwoo', supplierRegion: 'Chennai', materialCost: 8.2 },
        { partName: 'Fuse Box Cover', partNo: 'NX-IP-013', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
        { partName: 'Hood Latch Cable', partNo: 'NX-IP-014', isCo: true, coSource: 'CT5i', supplier: 'Hi-Lex', supplierRegion: 'Gurgaon', materialCost: 1.4 },
        { partName: 'IP Garnish (Upper)', partNo: 'NX-IP-015', isCo: false, nonCoReason: '인테리어 컬러/텍스처 차별화 적용', reasonDetail: {
          category: '디자인', baseSpec: 'CT5i: 단색 블랙 그레인 (Grain #G-102), 곡률 R400, 두께 2.5mm', newSpec: 'NX8: 투톤 (상단 소프트그레이 + 하단 다크그레이), 신규 Grain #G-218 적용, 곡률 R350, 두께 2.8mm',
          diffDescription: '가니쉬 표면 텍스처(그레인)가 CT5i #G-102→NX8 #G-218로 변경. 투톤 컬러 적용으로 사출 후 별도 도장 공정 추가. 곡률 R400→R350 변경에 따라 그레인 전사 시 흐름성 차이 발생하여 금형 러너/게이트 위치 재설계.',
          designIntent: 'NX8 MPV 인테리어 컬러 차별화 — 프리미엄 투톤 적용으로 CT5i SUV 대비 모던/소프트 감성 지향. Grain Book에서 인도 소비자 선호도 1위 패턴 반영.',
          impactArea: '그레인 전사 금형 변경, 도장 공정 1단계 추가 (투톤 마스킹), 컬러 매칭 검증',
          coPossibility: 'high', coCondition: '가니쉬 형상(외곽 치수)은 동일 유지 가능. 그레인/컬러만 차별화하는 경우 "금형 공용 + 그레인/도장 별도" 방식으로 금형 C/O 가능 (금형비 약 60% 절감).',
          additionalCost: 1.4
        }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 4.2 },
        { partName: 'IP Garnish (Lower)', partNo: 'NX-IP-016', isCo: false, nonCoReason: '인테리어 컬러/텍스처 차별화 적용', reasonDetail: {
          category: '디자인', baseSpec: 'CT5i: 단색 블랙 그레인 (Grain #G-102), 하단 수납 포켓 미적용', newSpec: 'NX8: 투톤 다크그레이 + 크롬 액센트 라인, 하단 스마트폰 수납 포켓 추가',
          diffDescription: 'Upper 가니쉬와 동일한 컬러/텍스처 변경에 더해, NX8는 하단에 스마트폰 수납 포켓(W 85mm × D 15mm)이 추가됨. 포켓 추가로 하단 가니쉬 리브 구조 재설계 및 크롬 액센트 인서트 몰딩 공정 추가.',
          designIntent: 'MPV 사용 시나리오에서 조수석 승객의 스마트폰 수납 편의성 확보. 크롬 액센트로 프리미엄 감성 강화.',
          impactArea: '금형 신규 (포켓 형상 추가), 크롬 인서트 별도 금형 1벌, 조립 공정 1스텝 추가',
          coPossibility: 'medium', coCondition: '포켓 미적용 버전으로 CT5i 금형 공용 가능하나, NX8 상품기획 필수 사양으로 지정되어 현 시점 C/O 불가. 차기 CT5i F/L 적용 검토 시 역C/O 가능.',
          additionalCost: 1.8
        }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.6 },
        { partName: 'Knee Bolster', partNo: 'NX-IP-017', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.8 },
        { partName: 'Speaker Grille (IP)', partNo: 'NX-IP-018', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
      ]},
      { system: 'Console', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 8, coCost: 43.6, newDevCost: 66.9, details: [
        { partName: 'Console Housing Assy', partNo: 'NX-CN-001', isCo: true, coSource: 'VN3', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 8.4 },
        { partName: 'Armrest Assy', partNo: 'NX-CN-002', isCo: true, coSource: 'VN3', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 4.6 },
        { partName: 'Cup Holder Assy', partNo: 'NX-CN-003', isCo: true, coSource: 'VN3', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 2.8 },
        { partName: 'Console Lid Hinge', partNo: 'NX-CN-004', isCo: true, coSource: 'VN3', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 0.8 },
        { partName: 'Shift Panel Garnish', partNo: 'NX-CN-005', isCo: false, nonCoReason: '전자식 변속 (SBW) 전용 패널 적용', reasonDetail: {
          category: '사양변경', baseSpec: 'VN3: 기계식 변속 레버 (게이트 타입), 패널 개구부 W 68mm × L 180mm, 가죽 부츠 장착', newSpec: 'NX8: SBW (Shift By Wire) 다이얼 + 버튼식, 패널 개구부 Ø 62mm 원형 + P/R/N/D 버튼 4개 배열',
          diffDescription: '변속 방식이 기계식 레버→전자식 다이얼(SBW)로 완전 변경. 패널 개구부가 직사각형→원형+버튼 배열로 바뀌어 형상 호환 불가. SBW 컨트롤러 하부 커넥터 위치도 다르며, 패널 내 조명(인디케이터 LED) 도광판 구조가 신규 추가.',
          designIntent: 'NX8 MPV 프리미엄 포지셔닝에 맞는 전자식 변속 적용. 콘솔 공간 확보(레버 제거→수납공간 창출) 및 미래 자율주행 대비 인터페이스 전환.',
          impactArea: '패널 금형 전면 신규, LED 도광판 금형 1벌 추가, SBW 커넥터 위치 대응 하부 구조 변경, 조립 공정 변경',
          coPossibility: 'none', coCondition: '변속 시스템 자체가 다르므로 C/O 불가. 단, SBW 채택 차종 간(DX4i, TX6i 등) 패널 공용화 별도 추진 가능.',
          additionalCost: 3.4
        }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 6.2 },
        { partName: 'USB Charging Port', partNo: 'NX-CN-006', isCo: true, coSource: 'VN3', supplier: 'Aptiv', supplierRegion: 'Pune', materialCost: 3.4 },
        { partName: 'Console Side Cover LH', partNo: 'NX-CN-007', isCo: true, coSource: 'VN3', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 1.8 },
        { partName: 'Console Side Cover RH', partNo: 'NX-CN-008', isCo: true, coSource: 'VN3', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 1.8 },
        { partName: 'Wireless Charger Pad', partNo: 'NX-CN-009', isCo: false, nonCoReason: '15W→50W 고속충전 사양 변경', reasonDetail: {
          category: '사양변경', baseSpec: 'VN3: Qi 15W 무선충전, 코일 Ø 48mm 단일, 충전 영역 W 80 × L 160mm, 방열판 알루미늄 1.2mm', newSpec: 'NX8: Qi2 50W 고속무선충전, 코일 Ø 55mm 듀얼(수직 정렬), 충전 영역 W 85 × L 170mm, 방열판 구리+그래핀 복합 2.0mm + 쿨링팬 내장',
          diffDescription: '충전 출력 15W→50W 3.3배 증가에 따라 코일 구성이 단일→듀얼로 변경되고, 발열 관리를 위한 방열 구조가 완전히 달라짐. 알루미늄 방열판→구리+그래핀 복합판으로 변경, 내부에 Ø 25mm 쿨링팬이 추가되어 모듈 두께 8mm→14mm 증가. 콘솔 트레이 깊이가 이에 맞춰 조정되어 트레이와의 인터페이스도 변경.',
          designIntent: '인도 시장 스마트폰 대화면화 + 급속충전 트렌드 대응. 중국 경쟁차(BYD, MG) 50W 탑재 시작에 따른 사양 패리티 확보.',
          impactArea: '충전 모듈 전체 신규, 콘솔 트레이 깊이 변경 연동, EMI 차폐 검증 재실시, 열관리 DV 시험 추가',
          coPossibility: 'low', coCondition: 'Qi2 50W가 플랫폼 공통 사양으로 확정되면 DX4i/TX6i와 모듈 공용화 가능. 단, 콘솔 트레이 인터페이스 통일 필요.',
          additionalCost: 4.8
        }, supplier: 'Aircharge', supplierRegion: 'UK (Import)', materialCost: 8.4 },
        { partName: 'Console Tray (Storage)', partNo: 'NX-CN-010', isCo: true, coSource: 'VN3', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.6 },
        { partName: 'Mode Button Panel', partNo: 'NX-CN-011', isCo: false, nonCoReason: '드라이브 모드 버튼 레이아웃 변경', reasonDetail: {
          category: '사양변경', baseSpec: 'VN3: Eco/Normal/Sport 3모드, 물리 토글 스위치 1개, 패널 W 42 × H 28mm', newSpec: 'NX8: Eco/Normal/Sport/Smart/Sand(오프로드) 5모드 + Terrain 다이얼, 패널 W 68 × H 45mm, 햅틱 피드백 버튼',
          diffDescription: '드라이브 모드가 3개→5개로 증가하고, 오프로드 Terrain 모드 다이얼이 추가되면서 패널 면적 약 2.6배 확대. 버튼 방식이 물리 토글→햅틱 피드백 터치 버튼으로 변경되어 PCB 기판 + 액추에이터 내장 구조로 전면 재설계.',
          designIntent: 'NX8 MPV의 인도 다양한 도로 환경 대응 (도심/고속/비포장/모래). 경쟁차 대비 모드 다양성으로 "All-Terrain MPV" 포지셔닝 확보.',
          impactArea: '버튼 패널 금형 신규, PCB + 햅틱 액추에이터 모듈 개발, 소프트웨어 인터페이스 변경, 조작력 DV 시험',
          coPossibility: 'low', coCondition: 'SBW 채택 차종 중 동일 5모드 구성 적용 시 공용 가능. 현재 DX4i만 5모드 검토 중.',
          additionalCost: 2.4
        }, supplier: 'Alps Alpine', supplierRegion: 'Pune', materialCost: 4.2 },
        { partName: 'Console Mat (Anti-slip)', partNo: 'NX-CN-012', isCo: false, nonCoReason: '콘솔 내부 형상 차이로 사이즈 불일치', reasonDetail: {
          category: '형상차이', baseSpec: 'VN3: 콘솔 트레이 내부 W 92 × L 168mm, 코너 R8, 두께 1.5mm 실리콘', newSpec: 'NX8: 콘솔 트레이 내부 W 88 × L 175mm, 코너 R12, 두께 2.0mm TPE (열가소성 엘라스토머)',
          diffDescription: '무선충전 모듈 두께 증가(8→14mm)로 콘솔 트레이 깊이 변경되면서 내부 치수가 폭 4mm 축소, 길이 7mm 확대. 코너 R도 8→12로 변경. 소재도 실리콘→TPE로 변경하여 고온(50°C+) 환경 내구성 확보.',
          designIntent: '인도 고온 환경 대응 (차량 내부 최고 80°C). TPE 소재는 고온에서 실리콘 대비 형상 유지력 우수.',
          impactArea: '재단 금형 변경 (저비용), 소재 변경에 따른 접착력 검증',
          coPossibility: 'high', coCondition: '콘솔 하우징 형상 확정 후 매트만 별도 재단하면 되므로, 금형 비용 미미 ($0.1K). 소재 변경만 표준화하면 타 차종 확대 적용 용이.',
          additionalCost: 0.2
        }, supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 0.6 },
      ]},
      { system: 'Door Trim (Fr)', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 14, coSubParts: 10, coCost: 48.8, newDevCost: 72.8, details: [
        { partName: 'Door Trim Board LH', partNo: 'NX-DT-001', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 6.8 },
        { partName: 'Door Trim Board RH', partNo: 'NX-DT-002', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 6.8 },
        { partName: 'Armrest Pad LH', partNo: 'NX-DT-003', isCo: true, coSource: 'AZ7i', supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 2.4 },
        { partName: 'Armrest Pad RH', partNo: 'NX-DT-004', isCo: true, coSource: 'AZ7i', supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 2.4 },
        { partName: 'Map Pocket LH', partNo: 'NX-DT-005', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
        { partName: 'Map Pocket RH', partNo: 'NX-DT-006', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
        { partName: 'Inner Handle Escutcheon LH', partNo: 'NX-DT-007', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 0.8 },
        { partName: 'Inner Handle Escutcheon RH', partNo: 'NX-DT-008', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 0.8 },
        { partName: 'Speaker Grille LH', partNo: 'NX-DT-009', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 0.6 },
        { partName: 'Speaker Grille RH', partNo: 'NX-DT-010', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 0.6 },
        { partName: 'Door Garnish (Upper) LH', partNo: 'NX-DT-011', isCo: false, nonCoReason: '도어벨트 라인 디자인 변경에 따른 형상 차이', reasonDetail: {
          category: '디자인', baseSpec: 'AZ7i: 도어벨트 라인 높이 H 892mm (바닥 기준), 가니쉬 단면 프로파일 L자형, 두께 2.2mm, 크롬 미적용', newSpec: 'NX8: 도어벨트 라인 높이 H 878mm (14mm 하향), 가니쉬 단면 프로파일 C자형(웨더스트립 통합), 두께 2.8mm, 새틴 크롬 인서트 적용',
          diffDescription: '도어벨트 라인(윈도우 하단 라인)이 14mm 하향되면서 가니쉬 길이 및 단면 형상 변경. AZ7i L자형 단면→NX8 C자형(웨더스트립 립 통합) 단면으로 변경되어 사출 금형 전면 재설계. 새틴 크롬 인서트 몰딩 추가로 2색 사출 또는 인서트 공정 필요.',
          designIntent: 'NX8 MPV의 사이드뷰 프로포션 최적화 — 벨트 라인 하향으로 글래스 면적 확대(개방감↑), 웨더스트립 통합 가니쉬로 부품 수 1개 감소 효과. 크롬 액센트로 프리미엄 외관 확보.',
          impactArea: '사출 금형 신규 LH/RH 각 1벌, 크롬 인서트 금형 1벌, 웨더스트립 단면 검증(수밀 시험), 풍절음 NVH 재검증',
          coPossibility: 'none', coCondition: '벨트 라인 높이가 차종 고유 디자인 요소로 C/O 불가. 단, 크롬 인서트 사출 공법은 타 차종 표준화하여 금형 코어만 교체하는 방식으로 비용 절감 가능.',
          additionalCost: 2.2
        }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.8 },
        { partName: 'Door Garnish (Upper) RH', partNo: 'NX-DT-012', isCo: false, nonCoReason: '도어벨트 라인 디자인 변경에 따른 형상 차이', reasonDetail: {
          category: '디자인', baseSpec: 'AZ7i: LH 대칭 구조, 도어벨트 라인 H 892mm', newSpec: 'NX8: LH 대칭 구조, 도어벨트 라인 H 878mm, RH 측 연료주입구 회피 형상 추가',
          diffDescription: 'LH와 동일한 벨트 라인 변경에 더해, RH 측은 연료주입구(Fuel Filler) 리드 회피를 위한 국소 형상 변경이 추가됨. 가니쉬 후단부에 W 35mm 노치(절개) 추가.',
          designIntent: 'LH 대칭 기본 + RH 연료주입구 간섭 회피. NX8 연료주입구 위치가 AZ7i 대비 15mm 전방 이동.',
          impactArea: 'RH 전용 금형 별도 (LH와 비대칭), 연료주입구 주변 수밀 검증 추가',
          coPossibility: 'none', coCondition: 'LH와 동일 사유. RH는 연료주입구 위치까지 차종 고유이므로 C/O 불가.',
          additionalCost: 2.4
        }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.8 },
        { partName: 'Ambient Light Module LH', partNo: 'NX-DT-013', isCo: false, nonCoReason: '신규 사양 — 기존 차종 미적용', reasonDetail: {
          category: '신규사양', baseSpec: 'AZ7i: 앰비언트 라이트 미적용. 도어트림 상단에 조명 가이드 홈 없음.', newSpec: 'NX8: 64색 LED 앰비언트 라이트, 도광판 길이 L 680mm, LED 12개 직렬, 밝기 3단계 + 음악 연동 모드',
          diffDescription: '기존 차종에 전혀 없던 신규 사양. 도어트림 보드에 도광판 수납 홈(W 8 × D 6mm) 가공 필요. LED 모듈 12개가 도광판 양 끝에서 입사하는 Edge-lit 방식. 전원은 바디 ECU에서 CAN 통신으로 제어, 전용 하네스 3P 커넥터 추가.',
          designIntent: 'NX8 MPV 프리미엄 실내 감성의 핵심 사양. 인도 시장에서 Kushaq, Creta 대비 차별화 포인트. 64색 + 음악 연동으로 젊은 층 타겟 어필. 메카트로닉스 Squad 주도 개발.',
          impactArea: '도어트림 보드 금형에 도광판 홈 추가, LED 모듈 + 도광판 + 하네스 3종 신규 부품, 바디 ECU 소프트웨어 변경, 광량 균일도 DV 시험, EMC 시험',
          coPossibility: 'medium', coCondition: 'NX8에서 검증 완료 후 DX4i/TX6i/EV2i로 확대 적용 시 LED 모듈+도광판 C/O 가능. 도어트림 보드 금형은 차종별 별도이나 홈 규격 표준화로 가공비 절감 가능.',
          additionalCost: 3.8
        }, supplier: 'Hella', supplierRegion: 'Pune', materialCost: 5.4 },
        { partName: 'Ambient Light Module RH', partNo: 'NX-DT-014', isCo: false, nonCoReason: '신규 사양 — 기존 차종 미적용', reasonDetail: {
          category: '신규사양', baseSpec: 'AZ7i: 앰비언트 라이트 미적용', newSpec: 'NX8: LH 동일 사양 (64색, L 680mm 도광판, LED 12개)',
          diffDescription: 'LH와 동일 사양의 RH 대칭 부품. 도광판 길이/LED 배치는 동일하나, RH 도어트림 보드의 스피커 위치가 다르므로 도광판 경로에 국소 우회 구간(W 40mm) 존재.',
          designIntent: 'LH/RH 동일한 실내 조명 경험 제공. 좌우 비대칭 시 감성 품질 저하.',
          impactArea: 'LH와 동일 + RH 전용 도광판 경로 우회 설계',
          coPossibility: 'medium', coCondition: 'LH와 동일. LED 모듈은 LH/RH 공용 가능. 도광판만 RH 전용.',
          additionalCost: 3.8
        }, supplier: 'Hella', supplierRegion: 'Pune', materialCost: 5.4 },
      ]},
      { system: 'Door Trim (Rr)', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 10, coSubParts: 10, coCost: 36.8, newDevCost: 52.1 },
      { system: 'Seat (Fr)', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 22, coSubParts: 22, coCost: 151.9, newDevCost: 205.8 },
      { system: 'Seat (Rr)', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 15, coSubParts: 11, coCost: 61.2, newDevCost: 83.8, details: [
        { partName: 'Rr Seat Cushion Frame', partNo: 'NX-RS-001', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 8.2 },
        { partName: 'Rr Seat Cushion Pad', partNo: 'NX-RS-002', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 4.6 },
        { partName: 'Rr Seat Cushion Cover', partNo: 'NX-RS-003', isCo: false, nonCoReason: '시트 패턴/컬러 차별화', reasonDetail: {
          category: '디자인', baseSpec: 'VN3: 직물(Fabric) 단색 그레이, 퀼팅 패턴 없음, 스티치 컬러 동색', newSpec: 'NX8: 합성피혁(PVC Leather) 투톤 (베이지+브라운), 다이아몬드 퀼팅, 컨트라스트 스티치 (브라운 실)',
          diffDescription: '커버 소재가 직물→합성피혁으로 완전 변경. 봉제 패턴이 플랫→다이아몬드 퀼팅으로 변경되어 재단 패턴(커팅 다이) 및 봉제 공정 전면 변경. 투톤 적용으로 2가지 소재 접합 공정 추가. 라미네이팅 두께도 3mm→5mm(쿠션감 강화).',
          designIntent: 'NX8 MPV 인테리어 프리미엄화 핵심. 인도 시장에서 합성피혁+퀼팅은 프리미엄 인식의 결정적 요소. VN3 세단 대비 MPV 프리미엄 포지셔닝 차별화.',
          impactArea: '재단 금형(커팅 다이) 전면 신규, 봉제 라인 공정 변경, 소재 접착 공정 추가, VOC/포름알데히드 시험 재실시',
          coPossibility: 'none', coCondition: '소재+패턴+컬러가 모두 다르므로 C/O 불가. 다만, 시트 프레임/패드는 C/O 유지. 커버만 차종별 전용.',
          additionalCost: 1.6
        }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.8 },
        { partName: 'Rr Seat Back Frame', partNo: 'NX-RS-004', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 9.4 },
        { partName: 'Rr Seat Back Pad', partNo: 'NX-RS-005', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.8 },
        { partName: 'Rr Seat Back Cover', partNo: 'NX-RS-006', isCo: false, nonCoReason: '시트 패턴/컬러 차별화', reasonDetail: {
          category: '디자인', baseSpec: 'VN3: 직물 단색 그레이, 플랫 패턴, 등판 포켓 없음', newSpec: 'NX8: 합성피혁 투톤, 다이아몬드 퀼팅, 등판 메쉬 포켓 + 태블릿 홀더 마운트 포인트 2개',
          diffDescription: '쿠션 커버와 동일한 소재/패턴/컬러 변경에 더해, 시트백 후면에 메쉬 포켓 봉제 및 태블릿 홀더 마운트 포인트(M5 인서트 2개) 추가. 등판 전체 봉제 패턴이 변경되어 커팅 다이 신규.',
          designIntent: '후석 승객(가족) 편의 강화 — MPV 핵심 USP. 태블릿 마운트는 2열 엔터테인먼트 기능의 기반 인프라.',
          impactArea: '커팅 다이 신규, M5 인서트 매입 공정 추가, 봉제 라인 변경',
          coPossibility: 'none', coCondition: '쿠션 커버와 동일 사유. 커버류는 차종 고유 디자인 항목.',
          additionalCost: 1.4
        }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.2 },
        { partName: 'Recliner Mechanism LH', partNo: 'NX-RS-007', isCo: true, coSource: 'VN3', supplier: 'Faurecia', supplierRegion: 'Pune', materialCost: 4.8 },
        { partName: 'Recliner Mechanism RH', partNo: 'NX-RS-008', isCo: true, coSource: 'VN3', supplier: 'Faurecia', supplierRegion: 'Pune', materialCost: 4.8 },
        { partName: 'Headrest (Rr)', partNo: 'NX-RS-009', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 2.6 },
        { partName: 'Armrest (Rr Center)', partNo: 'NX-RS-010', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.4 },
        { partName: 'Seat Bolster Foam (Cushion)', partNo: 'NX-RS-011', isCo: false, nonCoReason: '쿠션각 변경(12→15.5°)에 따른 볼스터 형상 차이', reasonDetail: {
          category: '형상차이', baseSpec: 'VN3: 쿠션각 12°, 볼스터 높이 38mm, 볼스터 폭 65mm, 폼 밀도 45kg/m³', newSpec: 'NX8: 쿠션각 15.5°, 볼스터 높이 45mm, 볼스터 폭 72mm, 폼 밀도 50kg/m³',
          diffDescription: '쿠션각이 12°→15.5°로 3.5° 증가하면서 볼스터(측면 지지대) 형상이 전면 변경. 볼스터 높이 +7mm, 폭 +7mm 확대로 MPV 장거리 승차감 확보. 폼 밀도도 45→50kg/m³로 높여 장시간 착좌 시 체압 분산 개선. 발포 금형 캐비티 형상이 달라 C/O 불가.',
          designIntent: 'MPV 2열 장거리 승차감 확보. 인도 시장 장거리 가족 이동(500km+) 빈번 — 쿠션각 증가로 허벅지 지지력 향상, 볼스터 확대로 코너링 시 횡지지력 강화.',
          impactArea: '발포 금형 신규 1벌, 폼 밀도 변경에 따른 발포 공정 조건 변경 (온도/시간), 착좌감 주관평가 재실시',
          coPossibility: 'medium', coCondition: '차기 VN3 F/L에서 쿠션각 15.5° 동일 적용 시 발포 금형 C/O 가능. 현재 VN3 F/L 기획팀에 사양 제안 중.',
          additionalCost: 1.2
        }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 2.8 },
        { partName: 'Seat Belt Buckle Rr', partNo: 'NX-RS-012', isCo: true, coSource: 'VN3', supplier: 'Autoliv', supplierRegion: 'Bangalore', materialCost: 3.2 },
        { partName: 'Seat Hinge Cover', partNo: 'NX-RS-013', isCo: true, coSource: 'VN3', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 0.8 },
        { partName: 'Rear Cup Holder (Armrest)', partNo: 'NX-RS-014', isCo: true, coSource: 'VN3', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.4 },
        { partName: 'Seat Back Pocket', partNo: 'NX-RS-015', isCo: false, nonCoReason: '태블릿 거치대 통합 설계로 형상 변경', reasonDetail: {
          category: '신규사양', baseSpec: 'VN3: 단순 메쉬 포켓 (W 250 × H 180mm), 잡지/서류 수납용, 탄성밴드 고정', newSpec: 'NX8: 메쉬 포켓 + 태블릿 거치대 통합 (W 280 × H 220mm), 7~12" 태블릿 거치, 각도 조절 15°/25°/35° 3단, USB-C 충전 케이블 라우팅 홀',
          diffDescription: '기존 단순 메쉬 포켓에 태블릿 거치 기능이 통합됨. 포켓 상단에 ABS 프레임(태블릿 클램프) 추가, 각도 조절 힌지(3단 디텐트) 내장, 하단에 USB-C 케이블 통과 홀(Ø 12mm) 가공. 포켓 전체 크기 확대(폭 +30mm, 높이 +40mm)로 시트백 보드 부착점 위치 변경.',
          designIntent: 'MPV 2열 패밀리 엔터테인먼트 핵심. 인도 시장 장거리 이동 시 자녀 태블릿 시청 수요 높음. 시트백 포켓을 "엔터테인먼트 허브"로 전환하여 경쟁차 대비 차별화.',
          impactArea: 'ABS 프레임 금형 1벌 신규, 힌지 부품 2종 추가, 시트백 보드 부착점 위치 변경 (보드 금형 국소 수정), USB 케이블 라우팅 하네스 추가',
          coPossibility: 'high', coCondition: 'NX8 검증 완료 후 태블릿 거치대 모듈을 표준화하면 DX4i/TX6i/EV2i 2열에 동일 적용 가능. ABS 프레임+힌지를 공용 모듈화하고, 포켓 메쉬만 차종별 사이즈 대응하는 방식 제안.',
          additionalCost: 1.6
        }, supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 2.4 },
      ]},
      { system: 'HVAC / Air Vent', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 16, coSubParts: 16, coCost: 67.0, newDevCost: 101.0 },
      { system: 'Headliner', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 8, coSubParts: 6, coCost: 40.4, newDevCost: 58.1 },
      { system: 'Pillar Trim', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 8, coSubParts: 8, coCost: 18.8, newDevCost: 28.6 },
      { system: 'Package Tray', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 4, coSubParts: 4, coCost: 11.2, newDevCost: 16.8 },
      { system: 'Carpet / Floor', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 22.4, newDevCost: 32.6 },
      { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 6, coSubParts: 4, coCost: 28.5, newDevCost: 38.2 },
      { system: 'Sunroof (PGS)', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 64.5 },
      { system: 'Garnish / Molding', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 10, coSubParts: 10, coCost: 14.6, newDevCost: 21.8 },
    ],
  },
]

// 차종 간 공용화 관계 매트릭스 (개발차 → 양산차 C/O 비율)
const allCodes = vehicles.map(v => v.code)
const matrixData: Record<string, Record<string, number>> = {}
for (const v of vehicles) {
  matrixData[v.code] = {}
  const totalSub = v.parts.reduce((s, p) => s + p.subParts, 0)
  for (const base of allCodes) {
    const coSub = v.parts.filter(p => p.baseVehicle === base).reduce((s, p) => s + p.coSubParts, 0)
    matrixData[v.code][base] = totalSub > 0 ? Math.round((coSub / totalSub) * 100) : 0
  }
}

// 차종별 합계 계산 유틸
function getVehicleTotals(parts: MasterPart[]) {
  const totalSystems = parts.length
  const totalSubParts = parts.reduce((s, p) => s + p.subParts, 0)
  const totalCoSubParts = parts.reduce((s, p) => s + p.coSubParts, 0)
  const totalCoCost = parts.reduce((s, p) => s + p.coCost, 0)
  const totalNewDevCost = parts.reduce((s, p) => s + p.newDevCost, 0)
  const totalEffect = totalNewDevCost - totalCoCost
  const coRate = totalSubParts > 0 ? Math.round((totalCoSubParts / totalSubParts) * 100) : 0
  return { totalSystems, totalSubParts, totalCoSubParts, totalCoCost, totalNewDevCost, totalEffect, coRate }
}

/* ─── Components ─── */
function StatCard({ icon: Icon, label, value, change, positive, suffix = '' }: {
  icon: typeof TrendingUp; label: string; value: string; change: string; positive: boolean; suffix?: string
}) {
  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-[12px] bg-primary-dim flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <span className={`text-sm font-medium flex items-center gap-1 ${positive ? 'text-success' : 'text-danger'}`}>
          {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </span>
      </div>
      <div>
        <p className="text-text-muted text-sm">{label}</p>
        <p className="text-2xl font-bold tracking-tight mt-1">{value}{suffix}</p>
      </div>
    </div>
  )
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: {
  icon: typeof LayoutDashboard; label: string; active?: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors cursor-pointer
        ${active
          ? 'bg-primary text-white'
          : 'text-text-muted hover:bg-secondary hover:text-text'
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}

function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="h-2 bg-secondary rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ─── Status Badge ─── */
function CoTypeBadge({ type }: { type: CoType }) {
  const config = {
    '1레벨 C/O': { icon: CheckCircle2, bg: 'bg-success-dim', text: 'text-success', label: '1레벨 통째 C/O' },
    '2레벨 부분 C/O': { icon: CircleDot, bg: 'bg-[#DBEAFE]', text: 'text-primary', label: '2레벨 부분 C/O' },
    '신규개발': { icon: CirclePlus, bg: 'bg-secondary', text: 'text-text-muted', label: '신규개발' },
  }[type]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon size={12} />
      {config.label}
    </span>
  )
}

/* ─── Projects View (차종별 부품 공용화 마스터리스트) ─── */
function ProjectsView() {
  const [selectedVehicle, setSelectedVehicle] = useState('NX8')
  const [filterType, setFilterType] = useState<CoType | 'all'>('all')
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [expandedDetail, setExpandedDetail] = useState<string | null>(null) // partNo of expanded detail

  const vehicle = vehicles.find(v => v.code === selectedVehicle)!
  const totals = getVehicleTotals(vehicle.parts)
  const filtered = filterType === 'all' ? vehicle.parts : vehicle.parts.filter(p => p.coType === filterType)
  const filteredCoCost = filtered.reduce((s, p) => s + p.coCost, 0)
  const filteredNewCost = filtered.reduce((s, p) => s + p.newDevCost, 0)
  const filteredEffect = filteredNewCost - filteredCoCost

  const h1 = vehicles.filter(v => v.half === 'H1')
  const h2 = vehicles.filter(v => v.half === 'H2')

  // 선택된 차종의 시스템별 차트 데이터
  const chartData = vehicle.parts.map(p => ({
    name: p.system.length > 10 ? p.system.slice(0, 10) + '…' : p.system,
    fullName: p.system,
    coCost: p.coCost,
    newDevCost: p.newDevCost,
  }))

  // 선택된 차종의 공용화 구분 파이
  const coTypePie = [
    { name: '1레벨 통째 C/O', value: vehicle.parts.filter(p => p.coType === '1레벨 C/O').length, color: '#3182F6' },
    { name: '2레벨 부분 C/O', value: vehicle.parts.filter(p => p.coType === '2레벨 부분 C/O').length, color: '#93C5FD' },
    { name: '신규개발', value: vehicle.parts.filter(p => p.coType === '신규개발').length, color: '#E5E7EB' },
  ]

  return (
    <>
      {/* Vehicle Tabs */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-text-subtle mb-2 font-medium">H1 양산차 (베이스 DB 구축)</p>
            <div className="flex gap-2">
              {h1.map(v => (
                <button
                  key={v.code}
                  onClick={() => { setSelectedVehicle(v.code); setFilterType('all'); setExpandedRow(null); setExpandedDetail(null) }}
                  className={`px-3 py-1.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors cursor-pointer ${
                    selectedVehicle === v.code ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:bg-secondary-hover'
                  }`}
                >
                  {v.code}
                  <span className="text-xs opacity-70 ml-1">{v.stage}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <p className="text-xs text-text-subtle mb-2 font-medium">H2 개발차 (공용화 현황 분석)</p>
            <div className="flex gap-2">
              {h2.map(v => (
                <button
                  key={v.code}
                  onClick={() => { setSelectedVehicle(v.code); setFilterType('all'); setExpandedRow(null); setExpandedDetail(null) }}
                  className={`px-3 py-1.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors cursor-pointer ${
                    selectedVehicle === v.code ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:bg-secondary-hover'
                  }`}
                >
                  {v.code}
                  <span className="text-xs opacity-70 ml-1">{v.date}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">1레벨 시스템 수</p>
          <p className="text-2xl font-bold mt-1">{totals.totalSystems}<span className="text-base font-normal text-text-muted ml-1">개</span></p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">2레벨 부품 공용화율</p>
          <p className="text-2xl font-bold mt-1">{totals.coRate}<span className="text-base font-normal text-text-muted ml-1">%</span></p>
          <p className="text-xs text-text-subtle mt-1">{totals.totalCoSubParts} / {totals.totalSubParts} parts</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">공용화 포함 재료비 (1대분)</p>
          <p className="text-2xl font-bold mt-1">${totals.totalCoCost.toFixed(1)}</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">공용화 효과 합계</p>
          <p className="text-2xl font-bold text-success mt-1">${totals.totalEffect.toFixed(1)}</p>
          <p className="text-xs text-text-subtle mt-1">신규 ${totals.totalNewDevCost.toFixed(1)} − C/O ${totals.totalCoCost.toFixed(1)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">{vehicle.code} 시스템별 재료비 비교</h3>
          <p className="text-sm text-text-muted mb-4">공용화 포함 vs 신규개발 ($/대)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={2} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} angle={-25} textAnchor="end" height={48} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(value) => [`$${Number(value).toFixed(1)}`]}
              />
              <Bar dataKey="coCost" name="공용화 포함" fill="#3182F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="newDevCost" name="신규개발" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">공용화 구분 (1레벨)</h3>
          <p className="text-sm text-text-muted mb-4">{vehicle.code} 시스템 수 기준</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={coTypePie} cx="50%" cy="50%" innerRadius={42} outerRadius={64} paddingAngle={4} dataKey="value">
                {coTypePie.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {coTypePie.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-muted">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}개</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Vehicle Matrix */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 mb-8">
        <h3 className="text-base font-bold mb-1">차종 간 C/O 관계 매트릭스</h3>
        <p className="text-sm text-text-muted mb-4">개발차 → 베이스 차종 2레벨 부품 공용화율 (%)</p>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-text-muted border-b border-border">개발차 ↓ / 베이스 →</th>
                {allCodes.map(code => (
                  <th key={code} className={`px-4 py-2 text-center text-xs font-semibold border-b border-border ${
                    code === selectedVehicle ? 'text-primary' : 'text-text-muted'
                  }`}>{code}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCodes.map(row => (
                <tr key={row} className={row === selectedVehicle ? 'bg-primary-dim/30' : ''}>
                  <td className={`px-4 py-2.5 text-sm border-b border-border ${
                    row === selectedVehicle ? 'font-bold text-primary' : 'font-medium'
                  }`}>{row}</td>
                  {allCodes.map(col => {
                    const val = matrixData[row]?.[col] || 0
                    const isSelf = row === col
                    return (
                      <td key={col} className="px-4 py-2.5 text-center border-b border-border">
                        {isSelf ? (
                          <span className="text-text-subtle">—</span>
                        ) : val > 0 ? (
                          <span className={`inline-block min-w-[36px] px-2 py-0.5 rounded text-xs font-medium ${
                            val >= 30 ? 'bg-primary text-white' :
                            val >= 15 ? 'bg-primary-dim text-primary' :
                            val > 0 ? 'bg-secondary text-text-muted' : ''
                          }`}>{val}%</span>
                        ) : (
                          <span className="text-text-subtle text-xs">0</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-text-subtle">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary" /> 30%+</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary-dim" /> 15~29%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-secondary" /> 1~14%</span>
        </div>
      </div>

      {/* Master List Table */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-base font-bold">{vehicle.code} 1레벨 마스터리스트</h3>
            <p className="text-sm text-text-muted mt-0.5">{vehicle.name} ({vehicle.date}, {vehicle.stage}) | BOM 기반 C/O 확인</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-text-subtle" />
              {(['all', '1레벨 C/O', '2레벨 부분 C/O', '신규개발'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => { setFilterType(type); setExpandedRow(null); setExpandedDetail(null) }}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    filterType === type ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:bg-secondary-hover'
                  }`}
                >{type === 'all' ? '전체' : type}</button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-sm text-text-muted bg-secondary px-3 py-1.5 rounded-[var(--radius-button)] hover:bg-secondary-hover transition-colors">
              <Download size={14} /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#FAFBFC]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted">No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">1레벨 시스템</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">베이스 차종</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">공용화 구분</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted">2레벨 부품</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted">공용화 포함 ($/대)</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted">신규개발 시 ($/대)</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-text-muted">공용화 효과 ($)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((part, i) => {
                const effect = part.newDevCost - part.coCost
                const hasDetails = part.details && part.details.length > 0
                const isExpanded = expandedRow === i
                return (
                  <Fragment key={i}>
                    <tr
                      onClick={() => { if (hasDetails) { setExpandedRow(isExpanded ? null : i); setExpandedDetail(null) } }}
                      className={`border-b border-border last:border-b-0 transition-colors ${
                        hasDetails ? 'cursor-pointer hover:bg-primary-dim/20' : 'hover:bg-[#FAFBFC]'
                      } ${isExpanded ? 'bg-primary-dim/30' : ''}`}
                    >
                      <td className="px-6 py-3 text-text-subtle">
                        <div className="flex items-center gap-1">
                          {hasDetails && (
                            <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                              <ChevronRight size={14} className="text-primary" />
                            </span>
                          )}
                          {i + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {part.system}
                        {hasDetails && (
                          <span className="ml-2 text-[10px] text-primary font-normal bg-primary-dim px-1.5 py-0.5 rounded">
                            {part.details!.length}개 부품 상세
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {part.baseVehicle === '-' ? (
                          <span className="text-text-subtle">—</span>
                        ) : (
                          <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">{part.baseVehicle}</span>
                        )}
                      </td>
                      <td className="px-4 py-3"><CoTypeBadge type={part.coType} /></td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-medium">{part.coSubParts}</span>
                        <span className="text-text-subtle">/{part.subParts}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {part.coCost > 0 ? `$${part.coCost.toFixed(1)}` : <span className="text-text-subtle">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">${part.newDevCost.toFixed(1)}</td>
                      <td className="px-6 py-3 text-right font-mono font-medium text-success">${effect.toFixed(1)}</td>
                    </tr>

                    {/* 2레벨 상세 확장 영역 */}
                    {isExpanded && hasDetails && (
                      <tr key={`detail-${i}`}>
                        <td colSpan={8} className="p-0">
                          <div className="bg-[#F8FAFF] border-y border-primary/10">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-3 border-b border-primary/10">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-primary">{part.system}</span>
                                <span className="text-xs text-text-muted">2레벨 부품 상세</span>
                                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                  C/O {part.details!.filter(d => d.isCo).length}/{part.details!.length}
                                </span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); setExpandedRow(null); setExpandedDetail(null) }}
                                className="text-text-subtle hover:text-text transition-colors cursor-pointer"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            {/* Sub-part table */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-[#EEF2FF]">
                                    <th className="text-left px-4 py-2.5 font-semibold text-text-muted w-10">No.</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">부품명</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">파트넘버</th>
                                    <th className="text-center px-3 py-2.5 font-semibold text-text-muted w-16">C/O</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">C/O 출처 / 불가 사유</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">협력사</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">지역</th>
                                    <th className="text-right px-4 py-2.5 font-semibold text-text-muted">재료비 ($)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {part.details!.map((sub, j) => {
                                    const hasReasonDetail = !sub.isCo && sub.reasonDetail
                                    const isDetailOpen = expandedDetail === sub.partNo
                                    const coPossColors = { high: 'text-success bg-success-dim', medium: 'text-warning bg-warning-dim', low: 'text-danger bg-danger-dim', none: 'text-text-subtle bg-secondary' }
                                    const coPossLabels = { high: '높음', medium: '중간', low: '낮음', none: '불가' }
                                    return (
                                      <Fragment key={j}>
                                        <tr
                                          className={`border-b border-primary/5 last:border-b-0 ${
                                            sub.isCo ? 'bg-white' : 'bg-danger-dim/30'
                                          } ${isDetailOpen ? 'bg-danger-dim/50' : ''}`}
                                        >
                                          <td className="px-4 py-2 text-text-subtle">{j + 1}</td>
                                          <td className="px-3 py-2 font-medium text-text">{sub.partName}</td>
                                          <td className="px-3 py-2 font-mono text-text-muted">{sub.partNo}</td>
                                          <td className="px-3 py-2 text-center">
                                            {sub.isCo ? (
                                              <span className="inline-flex items-center gap-0.5 text-success font-medium">
                                                <CheckCircle2 size={12} /> C/O
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-0.5 text-danger font-medium">
                                                <X size={12} /> 신규
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2">
                                            {sub.isCo ? (
                                              <span className="bg-success-dim text-success px-2 py-0.5 rounded text-[10px] font-medium">
                                                {sub.coSource} C/O
                                              </span>
                                            ) : hasReasonDetail ? (
                                              <button
                                                onClick={(e) => { e.stopPropagation(); setExpandedDetail(isDetailOpen ? null : sub.partNo) }}
                                                className="text-left group cursor-pointer"
                                              >
                                                <span className="text-danger/80 text-[11px] leading-tight underline decoration-dashed decoration-danger/40 group-hover:decoration-danger group-hover:text-danger transition-colors">
                                                  {sub.nonCoReason}
                                                </span>
                                                <span className={`ml-1.5 inline-flex items-center transition-transform duration-200 ${isDetailOpen ? 'rotate-90' : ''}`}>
                                                  <ChevronRight size={10} className="text-danger/60" />
                                                </span>
                                              </button>
                                            ) : (
                                              <span className="text-danger/80 text-[11px] leading-tight">
                                                {sub.nonCoReason}
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 text-text-muted">{sub.supplier}</td>
                                          <td className="px-3 py-2">
                                            <span className="bg-secondary px-1.5 py-0.5 rounded text-[10px] font-medium text-text-muted">
                                              {sub.supplierRegion}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2 text-right font-mono font-medium">
                                            ${sub.materialCost.toFixed(1)}
                                          </td>
                                        </tr>

                                        {/* 3레벨: 비C/O 사유 상세 — 비주얼 중심 */}
                                        {isDetailOpen && hasReasonDetail && (() => {
                                          const rd = sub.reasonDetail!
                                          const coPossWidth = { high: '75%', medium: '50%', low: '25%', none: '5%' }
                                          const coPossColor = { high: '#22C55E', medium: '#F59E0B', low: '#EF4444', none: '#9CA3AF' }
                                          const catEmoji = { '디자인': '🎨', '사양변경': '🔧', '법규': '📋', '신규사양': '✨', '형상차이': '📐', '성능': '⚡' }
                                          return (
                                          <tr>
                                            <td colSpan={8} className="p-0">
                                              <div className="bg-gradient-to-b from-[#FFF5F5] to-[#FFF9F5] border-y border-danger/10">

                                                {/* ── Top bar: Category + Part + Cost ── */}
                                                <div className="flex items-center justify-between px-5 py-2.5 border-b border-danger/8 bg-white/60">
                                                  <div className="flex items-center gap-3">
                                                    <span className="text-base">{catEmoji[rd.category]}</span>
                                                    <span className="text-xs font-bold text-text">{sub.partName}</span>
                                                    <span className="text-[10px] font-mono text-text-subtle">{sub.partNo}</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-danger bg-danger-dim">{rd.category}</span>
                                                  </div>
                                                  <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                      <span className="text-[10px] text-text-subtle block">추가 비용</span>
                                                      <span className="text-base font-black text-danger">${rd.additionalCost.toFixed(1)}</span>
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); setExpandedDetail(null) }} className="text-text-subtle hover:text-text cursor-pointer">
                                                      <X size={14} />
                                                    </button>
                                                  </div>
                                                </div>

                                                {/* ── Main content: 3-column visual layout ── */}
                                                <div className="grid grid-cols-[1fr_auto_1fr] gap-0 px-5 py-3">

                                                  {/* LEFT: Base spec */}
                                                  <div className="bg-white rounded-l-[12px] border border-r-0 border-border p-3">
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                      <div className="w-2 h-2 rounded-full bg-text-subtle" />
                                                      <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wider">베이스</span>
                                                    </div>
                                                    <p className="text-[11px] text-text leading-relaxed">{rd.baseSpec}</p>
                                                  </div>

                                                  {/* CENTER: Arrow */}
                                                  <div className="flex items-center px-2 bg-gradient-to-r from-white to-white border-y border-border">
                                                    <div className="flex flex-col items-center gap-1">
                                                      <span className="text-danger text-lg font-black">→</span>
                                                      <span className="text-[8px] text-danger font-bold">변경</span>
                                                    </div>
                                                  </div>

                                                  {/* RIGHT: New spec */}
                                                  <div className="bg-white rounded-r-[12px] border border-l-0 border-danger/30 p-3">
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                      <div className="w-2 h-2 rounded-full bg-danger" />
                                                      <span className="text-[10px] font-bold text-danger uppercase tracking-wider">개발 요구</span>
                                                    </div>
                                                    <p className="text-[11px] text-text leading-relaxed">{rd.newSpec}</p>
                                                  </div>
                                                </div>

                                                {/* ── Bottom: 4-column compact cards ── */}
                                                <div className="grid grid-cols-4 gap-2.5 px-5 pb-3">

                                                  {/* 핵심 차이 */}
                                                  <div className="bg-white rounded-[10px] border border-border p-2.5 col-span-2">
                                                    <p className="text-[9px] font-bold text-text-subtle uppercase tracking-wider mb-1">핵심 차이</p>
                                                    <p className="text-[11px] text-text leading-snug line-clamp-3">{rd.diffDescription}</p>
                                                  </div>

                                                  {/* 변경 배경 */}
                                                  <div className="bg-white rounded-[10px] border border-border p-2.5">
                                                    <p className="text-[9px] font-bold text-text-subtle uppercase tracking-wider mb-1">왜 바꾸나</p>
                                                    <p className="text-[11px] text-text leading-snug line-clamp-3">{rd.designIntent}</p>
                                                  </div>

                                                  {/* 영향 */}
                                                  <div className="bg-white rounded-[10px] border border-border p-2.5">
                                                    <p className="text-[9px] font-bold text-text-subtle uppercase tracking-wider mb-1">영향 범위</p>
                                                    <p className="text-[11px] text-text leading-snug line-clamp-3">{rd.impactArea}</p>
                                                  </div>
                                                </div>

                                                {/* ── C/O Possibility gauge bar ── */}
                                                <div className="px-5 pb-3">
                                                  <div className="bg-white rounded-[10px] border border-border p-2.5 flex items-center gap-4">
                                                    <div className="shrink-0">
                                                      <p className="text-[9px] font-bold text-text-subtle uppercase tracking-wider">향후 C/O 전환 가능성</p>
                                                    </div>
                                                    <div className="flex-1">
                                                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: coPossWidth[rd.coPossibility], backgroundColor: coPossColor[rd.coPossibility] }} />
                                                      </div>
                                                    </div>
                                                    <span className="text-xs font-black shrink-0" style={{ color: coPossColor[rd.coPossibility] }}>
                                                      {coPossLabels[rd.coPossibility]}
                                                    </span>
                                                    {rd.coCondition && (
                                                      <span className="text-[10px] text-text-muted shrink-0 max-w-[280px] truncate" title={rd.coCondition}>
                                                        {rd.coCondition}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>

                                              </div>
                                            </td>
                                          </tr>
                                          )
                                        })()}
                                      </Fragment>
                                    )
                                  })}
                                </tbody>
                                <tfoot>
                                  <tr className="bg-[#EEF2FF] border-t border-primary/10">
                                    <td colSpan={3} className="px-4 py-2.5 font-bold text-text">
                                      소계
                                    </td>
                                    <td className="px-3 py-2.5 text-center font-bold">
                                      <span className="text-success">{part.details!.filter(d => d.isCo).length}</span>
                                      <span className="text-text-subtle"> / {part.details!.length}</span>
                                    </td>
                                    <td colSpan={2} className="px-3 py-2.5 text-[11px] text-text-muted">
                                      C/O율 {Math.round((part.details!.filter(d => d.isCo).length / part.details!.length) * 100)}%
                                      {' | '}비C/O {part.details!.filter(d => !d.isCo).length}건
                                    </td>
                                    <td className="px-3 py-2.5" />
                                    <td className="px-4 py-2.5 text-right font-mono font-bold">
                                      ${part.details!.reduce((s, d) => s + d.materialCost, 0).toFixed(1)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#FAFBFC] border-t-2 border-border">
                <td className="px-6 py-4" colSpan={2}>
                  <span className="font-bold">합계 (1대분)</span>
                  <span className="text-text-muted text-xs ml-2">({filtered.length}개 시스템)</span>
                </td>
                <td className="px-4 py-4" /><td className="px-4 py-4" />
                <td className="px-4 py-4 text-center font-medium">
                  {filtered.reduce((s, p) => s + p.coSubParts, 0)}/{filtered.reduce((s, p) => s + p.subParts, 0)}
                </td>
                <td className="px-4 py-4 text-right font-mono font-bold">${filteredCoCost.toFixed(1)}</td>
                <td className="px-4 py-4 text-right font-mono font-bold">${filteredNewCost.toFixed(1)}</td>
                <td className="px-6 py-4 text-right font-mono font-bold text-success">${filteredEffect.toFixed(1)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  )
}

/* ─── Dashboard View ─── */
function DashboardView() {
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard icon={Target} label="C/O Effect (NX8)" value="$412" change="+22.6%" positive={true} />
        <StatCard icon={Wrench} label="Pre-SR 절감" value="$581" change="+21.8%" positive={true} />
        <StatCard icon={FolderKanban} label="Active Projects" value="5" change="+2" positive={true} suffix="건" />
        <StatCard icon={Calendar} label="일정 준수율" value="94" change="-1.2%" positive={false} suffix="%" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Area Chart */}
        <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold">C/O 절감 추이</h3>
              <p className="text-sm text-text-muted mt-0.5">월별 실적 vs 목표 ($)</p>
            </div>
            <button className="flex items-center gap-1.5 text-sm text-text-muted bg-secondary px-3 py-1.5 rounded-[var(--radius-button)] hover:bg-secondary-hover transition-colors">
              최근 8개월 <ChevronDown size={14} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3182F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3182F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Area type="monotone" dataKey="actual" stroke="#3182F6" strokeWidth={2.5} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="target" stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="6 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">C/O 구성 비율</h3>
          <p className="text-sm text-text-muted mb-4">전체 부품 기준</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-muted">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">차종별 C/O Rate</h3>
          <p className="text-sm text-text-muted mb-4">%</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={coData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
              <Bar dataKey="rate" fill="#3182F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Projects Table */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">Active Projects</h3>
            <button className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {projects.map((p, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{p.code}</span>
                    <span className="text-xs text-text-subtle bg-secondary px-2 py-0.5 rounded-full">
                      {p.date} {p.stage}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-text-muted">{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{item.action}</p>
                  <p className="text-xs text-text-subtle mt-0.5">{item.user} &middot; {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Page titles ─── */
const pageTitles: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: '2026년 2월 16일 (일)' },
  projects: { title: '부품 공용화 마스터리스트', sub: "H1 양산차 DB 구축 → H2 개발차 C/O 분석 | 차종 간 관계 매트릭스" },
  analytics: { title: 'Analytics', sub: '준비 중' },
  team: { title: 'Team', sub: '준비 중' },
  settings: { title: 'Settings', sub: '준비 중' },
}

/* ─── App ─── */
export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const page = pageTitles[activeNav] || pageTitles.dashboard

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects', icon: FolderKanban, label: 'C/O 마스터리스트' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-surface border-r border-border flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-[10px] flex items-center justify-center">
            <Car size={16} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">AutoDev R&D</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.id}
              onClick={() => setActiveNav(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary-dim rounded-full flex items-center justify-center text-sm font-bold text-primary">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">J. Park</p>
              <p className="text-xs text-text-subtle truncate">Interior Design</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-lg font-bold tracking-tight">{page.title}</h1>
            <p className="text-xs text-text-subtle">{page.sub}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-56 pl-9 pr-4 rounded-[var(--radius-button)] bg-secondary border-none text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="relative w-9 h-9 rounded-[var(--radius-button)] bg-secondary flex items-center justify-center hover:bg-secondary-hover transition-colors">
              <Bell size={16} className="text-text-muted" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeNav === 'dashboard' && <DashboardView />}
          {activeNav === 'projects' && <ProjectsView />}
          {activeNav !== 'dashboard' && activeNav !== 'projects' && (
            <div className="flex items-center justify-center h-64 text-text-muted">
              준비 중입니다
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
