import type { VehicleInfo } from '@/types'

export const vehicles: VehicleInfo[] = [
// ─── H1 양산차 (베이스 DB 구축) ───
{
  code: 'VN3', name: 'AY (Sedan-A)', stage: '양산', date: "'24.6", half: 'H1', type: '양산', salesVolume: 120000,
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
  code: 'CT5i', name: 'CT5i (SUV-B)', stage: '양산', date: "'24.1", half: 'H1', type: '양산', salesVolume: 85000,
  parts: [
    { system: 'IP (Crash Pad)', baseVehicle: '-', coType: '신규개발', subParts: 18, coSubParts: 0, coCost: 0, newDevCost: 132.5 },
    { system: 'Console', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 5, coCost: 48.2, newDevCost: 62.4, details: [
      { partName: 'Console Housing Assy', partNo: 'CT-CN-001', isCo: true, coSource: 'VN3', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 8.4 },
      { partName: 'Armrest Assy', partNo: 'CT-CN-002', isCo: true, coSource: 'VN3', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 4.6 },
      { partName: 'Cup Holder Assy', partNo: 'CT-CN-003', isCo: true, coSource: 'VN3', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 2.8 },
      { partName: 'Console Side Cover LH', partNo: 'CT-CN-004', isCo: true, coSource: 'VN3', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 1.8 },
      { partName: 'Console Side Cover RH', partNo: 'CT-CN-005', isCo: true, coSource: 'VN3', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 1.8 },
      { partName: 'Shift Knob Assy', partNo: 'CT-CN-006', isCo: false, nonCoReason: 'SUV 전용 크롬 가니쉬 적용으로 형상 차이', reasonDetail: {
        category: '디자인', baseSpec: 'VN3: 세단용 슬림 레버, 상단 새틴크롬 버튼, 높이 H 92mm', newSpec: 'CT5i: SUV 전용 굵은 그립, 풀크롬 가니쉬 + 가죽 래핑, 높이 H 105mm',
        diffDescription: '세단→SUV 전환에 따라 변속 노브 그립 직경 Ø 38→Ø 44mm 확대. 크롬 가니쉬가 버튼 부분→전체 상단부로 확장되어 다이캐스팅 금형 신규. 가죽 래핑 추가로 봉제 공정 1단계 추가.',
        designIntent: 'SUV 포지셔닝에 맞는 견고하고 프리미엄한 변속 그립감 제공. 세단 대비 남성적/역동적 이미지 차별화.',
        impactArea: '크롬 가니쉬 다이캐스팅 금형 신규, 가죽 래핑 봉제 공정 추가, 조작감 주관평가 재실시',
        coPossibility: 'low', coCondition: 'VN3 F/L에서 SUV 스타일 노브 적용 시 역C/O 가능하나 세단 디자인 방향과 상이',
        additionalCost: 1.2
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 3.4 },
      { partName: 'Console Upper Pad', partNo: 'CT-CN-007', isCo: false, nonCoReason: 'SUV 콘솔 높이 변경에 따른 패드 형상 차이', reasonDetail: {
        category: '형상차이', baseSpec: 'VN3: 콘솔 상면 높이 H 248mm(바닥 기준), 패드 W 180 × L 320mm, 두께 8mm', newSpec: 'CT5i: 콘솔 상면 높이 H 268mm(+20mm), 패드 W 195 × L 340mm, 두께 10mm',
        diffDescription: 'SUV 시트 착좌 H-point 20mm 상승에 연동하여 콘솔 높이도 20mm 상승. 이에 따라 어퍼 패드 면적이 폭 15mm, 길이 20mm 확대되고 두께도 8→10mm 변경. 폼 쿠션 경도도 45HA→50HA로 변경.',
        designIntent: 'SUV 높은 착좌 자세에서의 암레스트 높이 최적화. 팔꿈치 지지 각도 정합성 확보.',
        impactArea: '패드 발포 금형 신규, 폼 경도 변경에 따른 발포 조건 변경',
        coPossibility: 'medium', coCondition: 'H-point 동일한 타 SUV 차종(DX4i 등)과 패드 공용화 가능. 치수 표준화 시 금형 C/O.',
        additionalCost: 0.8
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.6 },
      { partName: 'Coin Tray Assy', partNo: 'CT-CN-008', isCo: false, nonCoReason: 'SUV 전용 수납 레이아웃 변경', reasonDetail: {
        category: '사양변경', baseSpec: 'VN3: 원형 코인 트레이 Ø 65mm, 콘솔 전방 배치', newSpec: 'CT5i: 직사각 다용도 트레이 W 90 × L 120mm, 콘솔 중앙 배치, 미끄럼 방지 TPE 매트 적용',
        diffDescription: '세단의 단순 코인 트레이→SUV의 다용도 트레이로 변경. 인도 시장에서 유료 도로(톨게이트) FASTag 카드 + 소지품 수납 수요 대응. 위치도 전방→중앙으로 이동되어 콘솔 하우징 내 리브 위치 변경.',
        designIntent: '인도 SUV 사용자의 소지품 수납 편의성 극대화. FASTag + 열쇠 + 동전 통합 수납.',
        impactArea: '콘솔 하우징 금형 국소 변경(리브 위치), 트레이 금형 신규, TPE 매트 재단 금형',
        coPossibility: 'high', coCondition: '트레이 외곽 치수만 표준화하면 콘솔 하우징 금형 변경 최소화하여 타 SUV 차종 공용 가능.',
        additionalCost: 0.4
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
      { partName: 'USB Charging Port', partNo: 'CT-CN-009', isCo: false, nonCoReason: 'USB-A→USB-C 타입 변경', reasonDetail: {
        category: '사양변경', baseSpec: 'VN3: USB-A 2.0 × 2포트, 5V/2.1A, 브래킷 W 48 × H 24mm', newSpec: 'CT5i: USB-C × 2포트, PD 27W, 브래킷 W 52 × H 22mm, LED 인디케이터 추가',
        diffDescription: 'USB 포트 규격이 A→C 타입으로 완전 전환. 충전 규격도 5V/2.1A→PD 27W로 업그레이드되면서 PCB 회로 재설계 및 열관리 방열판 추가. 브래킷 개구부 치수도 상이.',
        designIntent: '인도 시장 스마트폰 USB-C 전환 대응 (2025년 이후 USB-C 의무화 법규). 급속충전 지원으로 경쟁사 패리티 확보.',
        impactArea: 'PCB 재설계, 브래킷 금형 변경, 방열판 추가, 충전 호환성 DV 시험',
        coPossibility: 'high', coCondition: 'USB-C PD 27W가 플랫폼 표준으로 확정되면 전 차종 공용 가능. 브래킷 외곽만 통일 필요.',
        additionalCost: 0.6
      }, supplier: 'Aptiv', supplierRegion: 'Pune', materialCost: 3.8 },
      { partName: 'Console Lid Hinge', partNo: 'CT-CN-010', isCo: false, nonCoReason: '개폐 각도 변경(45→60°)에 따른 힌지 규격 변경', reasonDetail: {
        category: '형상차이', baseSpec: 'VN3: 개폐 각도 45°, 토크 0.3Nm, 2절 링크', newSpec: 'CT5i: 개폐 각도 60°(+15°), 토크 0.4Nm, 4절 링크 + 댐퍼',
        diffDescription: 'SUV 높은 착좌 H-point에서 콘솔 리드 접근성 확보를 위해 개폐 각도 45→60° 확대. 4절 링크 + 댐퍼 적용으로 부드러운 개폐감 확보. 힌지 장착 브래킷 간격도 변경.',
        designIntent: 'SUV 운전자 팔 길이/각도에서의 콘솔 수납함 접근 편의 최적화.',
        impactArea: '힌지 금형 신규, 댐퍼 부품 추가, 개폐감 주관평가',
        coPossibility: 'medium', coCondition: '60° 힌지를 SUV 공용 표준으로 채택하면 DX4i/TX6i와 C/O 가능.',
        additionalCost: 0.4
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.0 },
      { partName: 'Console Tray (Storage)', partNo: 'CT-CN-011', isCo: false, nonCoReason: 'SUV 콘솔 내부 깊이 변경', reasonDetail: {
        category: '형상차이', baseSpec: 'VN3: 트레이 깊이 D 68mm, W 96 × L 172mm', newSpec: 'CT5i: 트레이 깊이 D 82mm(+14mm), W 100 × L 180mm',
        diffDescription: '콘솔 높이 20mm 상승에 따라 내부 수납 깊이가 14mm 증가. 폭/길이도 소폭 확대되어 트레이 금형 변경 필요.',
        designIntent: 'SUV 콘솔 수납 용량 확대. 500ml 텀블러 수납 대응.',
        impactArea: '트레이 사출 금형 변경, 내부 미끄럼 방지 매트 사이즈 변경',
        coPossibility: 'high', coCondition: '동일 H-point SUV 차종 간 콘솔 깊이 통일 시 트레이 금형 공용 가능.',
        additionalCost: 0.2
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.6 },
      { partName: 'Console Mat', partNo: 'CT-CN-012', isCo: false, nonCoReason: '트레이 사이즈 변경에 따른 매트 사이즈 불일치', reasonDetail: {
        category: '형상차이', baseSpec: 'VN3: W 92 × L 168mm, 실리콘', newSpec: 'CT5i: W 96 × L 176mm, 실리콘',
        diffDescription: '트레이 사이즈 변경에 연동하여 매트도 폭 4mm, 길이 8mm 확대. 소재 동일.',
        designIntent: '트레이 내부 빈틈 없는 매트 적용으로 NVH(소음) 방지.',
        impactArea: '매트 재단 금형 변경 (저비용)',
        coPossibility: 'high', coCondition: '트레이 금형 통일 시 자동으로 매트도 공용화.',
        additionalCost: 0.1
      }, supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 0.6 },
    ]},
    { system: 'Door Trim', baseVehicle: '-', coType: '신규개발', subParts: 24, coSubParts: 0, coCost: 0, newDevCost: 124.8 },
    { system: 'Seat (Fr/Rr)', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 38, coSubParts: 12, coCost: 242.6, newDevCost: 298.4, details: [
      { partName: 'Fr Seat Frame LH', partNo: 'CT-ST-001', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 12.8 },
      { partName: 'Fr Seat Frame RH', partNo: 'CT-ST-002', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 12.8 },
      { partName: 'Recliner LH', partNo: 'CT-ST-003', isCo: true, coSource: 'VN3', supplier: 'Faurecia', supplierRegion: 'Pune', materialCost: 4.8 },
      { partName: 'Recliner RH', partNo: 'CT-ST-004', isCo: true, coSource: 'VN3', supplier: 'Faurecia', supplierRegion: 'Pune', materialCost: 4.8 },
      { partName: 'Slide Rail LH', partNo: 'CT-ST-005', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 6.2 },
      { partName: 'Slide Rail RH', partNo: 'CT-ST-006', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 6.2 },
      { partName: 'Headrest Fr', partNo: 'CT-ST-007', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 2.6 },
      { partName: 'Rr Seat Frame', partNo: 'CT-ST-008', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 8.2 },
      { partName: 'Rr Seat Pad', partNo: 'CT-ST-009', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 4.6 },
      { partName: 'Rr Headrest', partNo: 'CT-ST-010', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 2.6 },
      { partName: 'Seat Belt Buckle Set', partNo: 'CT-ST-011', isCo: true, coSource: 'VN3', supplier: 'Autoliv', supplierRegion: 'Bangalore', materialCost: 6.4 },
      { partName: 'Rr Armrest', partNo: 'CT-ST-012', isCo: true, coSource: 'VN3', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.4 },
      { partName: 'Fr Cushion Cover LH', partNo: 'CT-ST-013', isCo: false, nonCoReason: 'SUV 전용 볼스터 확대 + 컬러 차별화', reasonDetail: {
        category: '디자인', baseSpec: 'VN3: 직물 그레이, 볼스터 폭 W 55mm, 플랫 패턴', newSpec: 'CT5i: 직물+합피 콤비, 볼스터 폭 W 68mm(+13mm), 스포츠 스티치 패턴',
        diffDescription: 'SUV 고속 코너링 시 횡지지력 확보를 위해 볼스터 폭 13mm 확대. 커버 소재가 직물 단일→직물+합피 콤비로 변경되어 봉제 패턴/재단 다이 전면 변경.',
        designIntent: 'SUV 동적 성능 이미지에 맞는 스포티한 시트 디자인. 볼스터 확대로 인도 비포장 도로 주행 시 승객 안정감 향상.',
        impactArea: '재단 다이 신규, 봉제 라인 변경, 합피 소재 접착 공정 추가',
        coPossibility: 'none', coCondition: '볼스터 폭이 차종 고유 디자인이므로 C/O 불가. 커버는 차종별 전용.',
        additionalCost: 1.8
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 4.2 },
      { partName: 'Fr Cushion Cover RH', partNo: 'CT-ST-014', isCo: false, nonCoReason: 'SUV 전용 볼스터 확대 + 컬러 차별화', reasonDetail: {
        category: '디자인', baseSpec: 'VN3: LH와 대칭', newSpec: 'CT5i: LH와 대칭, 동일 사양',
        diffDescription: 'LH와 동일한 볼스터 확대 및 소재/패턴 변경. 대칭 구조.',
        designIntent: 'LH와 동일.',
        impactArea: 'LH와 동일',
        coPossibility: 'none', coCondition: 'LH와 동일 사유.',
        additionalCost: 1.8
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 4.2 },
      { partName: 'Fr Back Cover LH', partNo: 'CT-ST-015', isCo: false, nonCoReason: 'SUV 등판 컬러/패턴 차별화', reasonDetail: {
        category: '디자인', baseSpec: 'VN3: 직물 그레이, 등판 포켓 미적용', newSpec: 'CT5i: 직물+합피 콤비, 등판 메쉬 포켓 1개 추가',
        diffDescription: '커버 소재/컬러 변경(쿠션 커버와 동일)에 더해 등판에 메쉬 포켓 봉제 추가. 재단 패턴 전면 변경.',
        designIntent: 'SUV 후석 승객 편의를 위한 1열 시트백 수납 포켓 제공.',
        impactArea: '재단 다이 신규, 메쉬 포켓 봉제 공정 추가',
        coPossibility: 'none', coCondition: '커버류 차종 고유.',
        additionalCost: 1.4
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.6 },
      { partName: 'Fr Back Cover RH', partNo: 'CT-ST-016', isCo: false, nonCoReason: 'SUV 등판 컬러/패턴 차별화', reasonDetail: {
        category: '디자인', baseSpec: 'VN3: LH와 대칭', newSpec: 'CT5i: LH와 대칭',
        diffDescription: 'LH와 동일.', designIntent: 'LH와 동일.', impactArea: 'LH와 동일',
        coPossibility: 'none', coCondition: 'LH와 동일.', additionalCost: 1.4
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.6 },
      { partName: 'Rr Cushion Cover', partNo: 'CT-ST-017', isCo: false, nonCoReason: 'SUV 후석 컬러/소재 차별화', reasonDetail: {
        category: '디자인', baseSpec: 'VN3: 직물 단색 그레이, 플랫', newSpec: 'CT5i: 직물+합피 콤비, 스포츠 스티치',
        diffDescription: '전석 커버와 동일한 소재/컬러 통일감 적용. 봉제 패턴 전면 변경.',
        designIntent: '전후석 인테리어 통일 감성. SUV 스포티 이미지 일관성 확보.',
        impactArea: '재단 다이 신규, 봉제 라인 변경',
        coPossibility: 'none', coCondition: '커버류 차종 고유.',
        additionalCost: 1.6
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.8 },
      { partName: 'Rr Back Cover', partNo: 'CT-ST-018', isCo: false, nonCoReason: 'SUV 후석 컬러/소재 차별화', reasonDetail: {
        category: '디자인', baseSpec: 'VN3: 직물 단색 그레이', newSpec: 'CT5i: 직물+합피 콤비',
        diffDescription: '전석과 동일 소재 통일 적용.', designIntent: '전후석 통일 감성.',
        impactArea: '재단 다이 신규',
        coPossibility: 'none', coCondition: '커버류 차종 고유.',
        additionalCost: 1.4
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.2 },
      { partName: 'Fr Seat Cushion Pad LH', partNo: 'CT-ST-019', isCo: false, nonCoReason: 'SUV 쿠션각/볼스터 형상 차이', reasonDetail: {
        category: '형상차이', baseSpec: 'VN3: 쿠션각 11°, 볼스터 H 35mm, 밀도 42kg/m³', newSpec: 'CT5i: 쿠션각 13°(+2°), 볼스터 H 42mm(+7mm), 밀도 45kg/m³',
        diffDescription: 'SUV H-point 상승에 따라 쿠션각 2° 증가. 볼스터 높이 7mm 확대로 코너링 횡지지력 강화. 발포 금형 캐비티 전면 변경.',
        designIntent: 'SUV 높은 착좌점에서의 허벅지 지지 및 안정감 확보.',
        impactArea: '발포 금형 신규 1벌, 발포 조건 변경',
        coPossibility: 'medium', coCondition: '동일 H-point SUV 차종(DX4i, TX6i) 간 쿠션각 통일 시 발포 금형 공용 가능.',
        additionalCost: 0.8
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.4 },
      { partName: 'Fr Seat Cushion Pad RH', partNo: 'CT-ST-020', isCo: false, nonCoReason: 'SUV 쿠션각/볼스터 형상 차이', reasonDetail: {
        category: '형상차이', baseSpec: 'LH와 동일', newSpec: 'LH와 동일',
        diffDescription: 'LH와 동일.', designIntent: 'LH와 동일.', impactArea: 'LH와 동일',
        coPossibility: 'medium', coCondition: 'LH와 동일.', additionalCost: 0.8
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.4 },
    ]},
    { system: 'HVAC / Air Vent', baseVehicle: '-', coType: '신규개발', subParts: 16, coSubParts: 0, coCost: 0, newDevCost: 101.0 },
    { system: 'Headliner', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 52.6 },
    { system: 'Pillar Trim', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 28.6 },
    { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 34.8, newDevCost: 38.2 },
    { system: 'Carpet / Floor', baseVehicle: '-', coType: '신규개발', subParts: 6, coSubParts: 0, coCost: 0, newDevCost: 32.6 },
    { system: 'Garnish / Molding', baseVehicle: '-', coType: '신규개발', subParts: 10, coSubParts: 0, coCost: 0, newDevCost: 21.8 },
  ],
},
{
  code: 'AZ7i', name: 'AZ7i (MPV-C)', stage: '양산', date: "'25.12", half: 'H1', type: '양산', salesVolume: 65000,
  parts: [
    { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 12, coCost: 98.4, newDevCost: 138.2, details: [
      { partName: 'IP Frame Assy', partNo: 'AZ-IP-001', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 12.4 },
      { partName: 'IP Upper Pad', partNo: 'AZ-IP-002', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 8.6 },
      { partName: 'IP Lower Cover', partNo: 'AZ-IP-003', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.2 },
      { partName: 'Glove Box Assy', partNo: 'AZ-IP-004', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 4.8 },
      { partName: 'Center Vent Assy', partNo: 'AZ-IP-005', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 3.2 },
      { partName: 'Side Vent LH/RH', partNo: 'AZ-IP-006', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 4.8 },
      { partName: 'Cowl Cross Bar', partNo: 'AZ-IP-007', isCo: true, coSource: 'CT5i', supplier: 'Sungwoo', supplierRegion: 'Chennai', materialCost: 8.2 },
      { partName: 'Fuse Box Cover', partNo: 'AZ-IP-008', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
      { partName: 'Hood Latch Cable', partNo: 'AZ-IP-009', isCo: true, coSource: 'CT5i', supplier: 'Hi-Lex', supplierRegion: 'Gurgaon', materialCost: 1.4 },
      { partName: 'Knee Bolster', partNo: 'AZ-IP-010', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.8 },
      { partName: 'Speaker Grille (IP)', partNo: 'AZ-IP-011', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
      { partName: 'Defroster Duct', partNo: 'AZ-IP-012', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 1.8 },
      { partName: 'Cluster Hood', partNo: 'AZ-IP-013', isCo: false, nonCoReason: 'MPV 전용 와이드 클러스터 형상', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 10.25" 부분 디지털, 후드 개구부 W 275mm × H 125mm', newSpec: 'AZ7i: 10.25" 풀디지털, 후드 개구부 W 290mm × H 115mm (와이드형), 상부 선바이저 일체형',
        diffDescription: '클러스터 디스플레이는 동일 10.25"이나 MPV 높은 착좌점에서의 시인성 확보를 위해 후드 상부에 선바이저 구조가 일체 성형됨. 개구부 폭 15mm 확대, 높이 10mm 축소. 금형 상부 형상 전면 변경.',
        designIntent: 'MPV 운전 자세(높은 H-point)에서 외부 반사광 차단 및 클러스터 시인성 극대화.',
        impactArea: '사출 금형 신규 1벌, 선바이저 일체 성형으로 금형 복잡도 증가',
        coPossibility: 'low', coCondition: 'CT5i F/L에서 동일 선바이저 일체 구조 적용 시 역C/O 검토 가능.',
        additionalCost: 1.8
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.6 },
      { partName: 'Center Fascia Panel', partNo: 'AZ-IP-014', isCo: false, nonCoReason: 'MPV 전용 에어컨 조작부 레이아웃 변경', reasonDetail: {
        category: '사양변경', baseSpec: 'CT5i: 물리 다이얼 3개 + 버튼 6개, 파시아 W 260 × H 160mm', newSpec: 'AZ7i: 물리 다이얼 2개 + 터치 버튼 8개, 후석 에어컨 독립 조절 버튼 추가, 파시아 W 268 × H 175mm',
        diffDescription: 'MPV 3열 독립 공조 조절을 위한 Rear Climate 버튼 2개 추가되면서 파시아 높이 15mm 확대. 터치 버튼 전환으로 PCB 레이아웃 재설계. 백라이트 LED 도광판 신규.',
        designIntent: 'MPV 2/3열 승객의 독립 공조 제어 편의 확보. 인도 고온 환경에서 후석 냉방 제어는 핵심 상품성.',
        impactArea: '파시아 금형 신규, PCB 재설계, 도광판 금형 추가, 공조 ECU 소프트웨어 변경',
        coPossibility: 'low', coCondition: '후석 독립 공조 버튼은 MPV/대형 SUV 전용. CT5i SUV-B에는 불필요하여 공용 어려움.',
        additionalCost: 2.8
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 5.8 },
      { partName: 'IP Garnish Set', partNo: 'AZ-IP-015', isCo: false, nonCoReason: 'MPV 전용 컬러/텍스처 차별화', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 단색 다크그레이 그레인 #G-108, SUV 스포티 패턴', newSpec: 'AZ7i: 투톤 베이지+브라운, 그레인 #G-142 (우드 패턴), 모던 패밀리 감성',
        diffDescription: '그레인 패턴이 SUV 스포츠→MPV 우드 감성으로 완전 변경. 투톤 적용으로 도장 마스킹 공정 추가. 그레인 전사 조건도 다르므로 금형 러너 위치 재설계.',
        designIntent: 'MPV 패밀리 실내 분위기 — 따뜻하고 모던한 우드 패턴으로 SUV 대비 차별화.',
        impactArea: '그레인 전사 금형 변경, 도장 공정 추가 (투톤 마스킹), 컬러 매칭 검증',
        coPossibility: 'high', coCondition: '가니쉬 외곽 형상은 CT5i와 동일 유지 가능. 그레인/컬러만 차별화 시 "금형 공용 + 그레인/도장 별도" 방식으로 금형비 약 60% 절감.',
        additionalCost: 1.2
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 4.0 },
      { partName: 'Passenger Airbag Door', partNo: 'AZ-IP-016', isCo: false, nonCoReason: 'MPV 전용 에어백 전개 각도 변경 (법규)', reasonDetail: {
        category: '법규', baseSpec: 'CT5i: PAB 전개 각도 48°, 도어 힌지 2점, 티어 라인 W 280mm', newSpec: 'AZ7i: PAB 전개 각도 52°(+4°), 도어 힌지 3점, 티어 라인 W 295mm, 고온 전개 보강 리브 추가',
        diffDescription: 'MPV 조수석 H-point 변경(+18mm)에 따라 에어백 전개 각도 4° 상향 조정. BNVSAP 충돌 법규 적합성 위해 티어 라인 폭 15mm 확대, 힌지 3점 구조로 변경. 인도 고온 환경(80°C+)에서의 안정적 전개를 위한 보강 리브 추가.',
        designIntent: 'BNVSAP/GNCAP 충돌 안전 법규 필수 대응. MPV 착좌점 변경에 따른 PAB 성능 최적화.',
        impactArea: '에어백 도어 금형 신규, 힌지 부품 변경, 충돌 시험(고온/저온/상온) 3조건 재실시',
        coPossibility: 'none', coCondition: '에어백 전개 각도/티어 라인은 차종 고유 충돌 설계 파라미터. H-point 동일 시에만 공용 검토 가능.',
        additionalCost: 2.4
      }, supplier: 'Autoliv', supplierRegion: 'Bangalore', materialCost: 5.2 },
      { partName: 'Side Defroster Nozzle', partNo: 'AZ-IP-017', isCo: false, nonCoReason: 'MPV 윈드실드 경사각 차이로 노즐 각도 변경', reasonDetail: {
        category: '형상차이', baseSpec: 'CT5i: 노즐 토출 각도 32°, 3구 슬롯, W 84mm', newSpec: 'AZ7i: 노즐 토출 각도 28°(−4°), 5구 슬롯, W 96mm (+12mm)',
        diffDescription: 'MPV 윈드실드 경사각이 SUV 대비 더 수직적이어서 디프로스터 노즐 토출 각도 4° 하향 조정. 와이드 윈드실드 대응으로 슬롯 3→5구 확대, 폭 12mm 증가.',
        designIntent: '넓은 MPV 윈드실드의 균일한 성에 제거 성능 확보.',
        impactArea: '노즐 금형 신규, 풍량 분배 CFD 해석 재실시',
        coPossibility: 'medium', coCondition: '동일 윈드실드 경사각 차종 간 노즐 공용 가능. 각도 조절 어댑터 적용 시 금형 공용 검토.',
        additionalCost: 0.6
      }, supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 1.8 },
      { partName: 'Glove Box Striker', partNo: 'AZ-IP-018', isCo: false, nonCoReason: 'MPV 전용 댐퍼 장착으로 스트라이커 규격 변경', reasonDetail: {
        category: '사양변경', baseSpec: 'CT5i: 스트라이커 단순 래치, 댐퍼 미적용', newSpec: 'AZ7i: 스트라이커 + 오일 댐퍼 일체형, 저속 개폐',
        diffDescription: 'MPV 프리미엄 감성을 위해 글로브 박스에 오일 댐퍼 추가. 스트라이커가 댐퍼 마운트 일체형으로 변경되어 부품 형상 완전 변경.',
        designIntent: '프리미엄 감성 — 글로브 박스 저속 자동 개폐로 고급차 느낌 연출.',
        impactArea: '스트라이커 금형 신규, 댐퍼 부품 추가, 개폐 토크 DV 시험',
        coPossibility: 'high', coCondition: '댐퍼 일체형 스트라이커를 플랫폼 표준으로 채택하면 전 차종 확대 가능. 비용 증가 미미($0.3).',
        additionalCost: 0.3
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 0.9 },
    ]},
    { system: 'Console', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 8, coCost: 48.6, newDevCost: 68.4, details: [
      { partName: 'Console Housing Assy', partNo: 'AZ-CN-001', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 8.4 },
      { partName: 'Armrest Assy', partNo: 'AZ-CN-002', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 4.6 },
      { partName: 'Cup Holder Assy', partNo: 'AZ-CN-003', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 2.8 },
      { partName: 'Console Lid Hinge', partNo: 'AZ-CN-004', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.0 },
      { partName: 'USB Charging Port', partNo: 'AZ-CN-005', isCo: true, coSource: 'CT5i', supplier: 'Aptiv', supplierRegion: 'Pune', materialCost: 3.8 },
      { partName: 'Console Side Cover LH/RH', partNo: 'AZ-CN-006', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.6 },
      { partName: 'Console Tray', partNo: 'AZ-CN-007', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.6 },
      { partName: 'Console Upper Pad', partNo: 'AZ-CN-008', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.6 },
      { partName: 'Rear Console Vent', partNo: 'AZ-CN-009', isCo: false, nonCoReason: 'MPV 후석 독립 공조 벤트 신규 적용', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 후석 공조 벤트 미적용. 콘솔 후면 블랭크 패널.', newSpec: 'AZ7i: 후석 독립 공조 벤트 2구, 풍량 조절 다이얼, 온도 표시 LED, W 148 × H 72mm',
        diffDescription: 'MPV 2/3열 독립 공조를 위한 콘솔 후면 공조 벤트 신규 적용. 콘솔 하우징 후면부에 덕트 연결 구멍(Ø 65mm × 2)과 벤트 장착 클립 4개소 추가. HVAC 덕트 라우팅도 연동 변경.',
        designIntent: 'MPV 핵심 상품성 — 인도 고온 환경에서 2/3열 승객 독립 냉방 필수. 경쟁차(Innova, Ertiga) 전 모델 적용 중.',
        impactArea: '콘솔 하우징 후면 금형 변경, 벤트 모듈 금형 신규, HVAC 덕트 추가, 풍량 분배 시험',
        coPossibility: 'low', coCondition: 'MPV/대형 SUV 전용 사양. CT5i SUV-B 사이즈에서는 불필요.',
        additionalCost: 2.8
      }, supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 4.2 },
      { partName: 'Rear USB Port (Console)', partNo: 'AZ-CN-010', isCo: false, nonCoReason: 'MPV 후석 전용 USB-C 충전 포트 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 후석 USB 미적용', newSpec: 'AZ7i: USB-C × 2포트 (PD 27W), 콘솔 후면 장착, LED 인디케이터',
        diffDescription: '후석 승객 충전 편의를 위한 USB-C 2포트 추가. 콘솔 후면에 브래킷+PCB 모듈 신규 장착. 전원 하네스 콘솔 내부 라우팅.',
        designIntent: 'MPV 후석 가족 승객의 디바이스 충전 편의. 장거리 이동 필수.',
        impactArea: '콘솔 후면 개구부 가공, USB 모듈 브래킷 금형, 하네스 추가, EMC 시험',
        coPossibility: 'medium', coCondition: '후석 USB 포트를 표준 모듈화하면 TX6i/NX8 등 2+3열 차종에 확대 적용 가능.',
        additionalCost: 1.2
      }, supplier: 'Aptiv', supplierRegion: 'Pune', materialCost: 3.8 },
      { partName: 'Shift Knob Garnish', partNo: 'AZ-CN-011', isCo: false, nonCoReason: 'MPV 전용 크롬 패턴 차별화', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 새틴 크롬 + 스포츠 그립', newSpec: 'AZ7i: 하이글로시 크롬 + 우드 패턴 인서트',
        diffDescription: '시프트 노브 가니쉬의 표면 처리가 새틴→하이글로시로 변경되고, 우드 패턴 인서트가 추가됨. IP 가니쉬와 통일된 MPV 우드 감성 적용.',
        designIntent: 'IP~콘솔 인테리어 우드 테마 통일.',
        impactArea: '가니쉬 도금 공정 변경, 우드 인서트 금형 추가',
        coPossibility: 'high', coCondition: '가니쉬 외곽 형상 동일 유지 시 표면 처리만 차별화 가능. 금형 C/O.',
        additionalCost: 0.6
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 2.4 },
      { partName: 'Console Mat', partNo: 'AZ-CN-012', isCo: false, nonCoReason: 'CT5i 대비 트레이 사이즈 동일하나 TPE 소재 변경', reasonDetail: {
        category: '성능', baseSpec: 'CT5i: 실리콘 매트, 내열 60°C', newSpec: 'AZ7i: TPE 매트, 내열 85°C, 항균 코팅',
        diffDescription: '인도 고온 환경 대응으로 매트 소재를 실리콘→TPE로 변경. 항균 코팅 추가. 사이즈는 CT5i와 동일.',
        designIntent: '인도 고온 환경(차량 내부 80°C+)에서 매트 변형 방지.',
        impactArea: '소재 변경, 항균 코팅 검증',
        coPossibility: 'high', coCondition: 'TPE 매트를 전 차종 표준으로 채택하면 즉시 공용화.',
        additionalCost: 0.2
      }, supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 0.8 },
    ]},
    { system: 'Door Trim', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 16, coCost: 92.4, newDevCost: 132.8, details: [
      { partName: 'Door Trim Board Fr LH', partNo: 'AZ-DT-001', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 6.8 },
      { partName: 'Door Trim Board Fr RH', partNo: 'AZ-DT-002', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 6.8 },
      { partName: 'Door Trim Board Rr LH', partNo: 'AZ-DT-003', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.4 },
      { partName: 'Door Trim Board Rr RH', partNo: 'AZ-DT-004', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.4 },
      { partName: 'Armrest Pad Set (4ea)', partNo: 'AZ-DT-005', isCo: true, coSource: 'CT5i', supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 9.6 },
      { partName: 'Map Pocket Set (4ea)', partNo: 'AZ-DT-006', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 4.8 },
      { partName: 'Inner Handle Escutcheon Set', partNo: 'AZ-DT-007', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 3.2 },
      { partName: 'Speaker Grille Set (4ea)', partNo: 'AZ-DT-008', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 2.4 },
      { partName: 'Window Switch Panel Fr LH', partNo: 'AZ-DT-009', isCo: true, coSource: 'CT5i', supplier: 'Alps Alpine', supplierRegion: 'Pune', materialCost: 3.8 },
      { partName: 'Window Switch Panel Fr RH', partNo: 'AZ-DT-010', isCo: true, coSource: 'CT5i', supplier: 'Alps Alpine', supplierRegion: 'Pune', materialCost: 2.8 },
      { partName: 'Window Switch Panel Rr LH', partNo: 'AZ-DT-011', isCo: true, coSource: 'CT5i', supplier: 'Alps Alpine', supplierRegion: 'Pune', materialCost: 2.4 },
      { partName: 'Window Switch Panel Rr RH', partNo: 'AZ-DT-012', isCo: true, coSource: 'CT5i', supplier: 'Alps Alpine', supplierRegion: 'Pune', materialCost: 2.4 },
      { partName: 'Door Pocket Bottle Holder Set', partNo: 'AZ-DT-013', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 3.2 },
      { partName: 'Door Scuff Plate Set', partNo: 'AZ-DT-014', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 4.4 },
      { partName: 'Tweeter Grille Set', partNo: 'AZ-DT-015', isCo: true, coSource: 'CT5i', supplier: 'Harman', supplierRegion: 'Pune', materialCost: 2.4 },
      { partName: 'Door Belt Weatherstrip Set', partNo: 'AZ-DT-016', isCo: true, coSource: 'CT5i', supplier: 'Hwaseung', supplierRegion: 'Chennai', materialCost: 5.8 },
      { partName: 'Door Garnish Upper Fr LH', partNo: 'AZ-DT-017', isCo: false, nonCoReason: 'MPV 벨트라인 변경에 따른 가니쉬 형상 차이', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 벨트라인 H 905mm, 가니쉬 단면 L자형, 단색 다크그레이', newSpec: 'AZ7i: 벨트라인 H 888mm(−17mm), 가니쉬 단면 J자형, 우드 패턴 인서트',
        diffDescription: 'MPV 글래스 면적 확대(개방감)를 위해 벨트라인 17mm 하향. 가니쉬 단면이 L→J자형으로 변경. IP/콘솔과 통일된 우드 패턴 인서트 적용으로 이중 사출 필요.',
        designIntent: 'MPV 개방적 실내감 확보 + 도어~IP~콘솔 우드 테마 통일 인테리어 감성.',
        impactArea: '사출 금형 신규, 우드 인서트 금형, 이중 사출 공정',
        coPossibility: 'none', coCondition: '벨트라인은 차종 고유 디자인. C/O 불가.',
        additionalCost: 1.8
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.4 },
      { partName: 'Door Garnish Upper Fr RH', partNo: 'AZ-DT-018', isCo: false, nonCoReason: 'MPV 벨트라인 변경 (Fr LH 대칭)', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: Fr LH 대칭', newSpec: 'AZ7i: Fr LH 대칭',
        diffDescription: 'Fr LH와 대칭 구조. 동일 사유.', designIntent: 'Fr LH와 동일.', impactArea: 'Fr LH와 동일',
        coPossibility: 'none', coCondition: 'Fr LH와 동일.', additionalCost: 1.8
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.4 },
      { partName: 'Door Garnish Upper Rr LH', partNo: 'AZ-DT-019', isCo: false, nonCoReason: 'MPV 후석 벨트라인 + 쿼터 글래스 형상', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 후석 가니쉬 L 420mm, 직선형', newSpec: 'AZ7i: 후석 가니쉬 L 480mm(+60mm), 쿼터 글래스 연결부 곡선형',
        diffDescription: 'MPV 후석 쿼터 글래스가 CT5i 대비 더 후방으로 연장되면서 가니쉬 길이 60mm 증가. 쿼터 글래스 접합부에 곡선 형상이 추가되어 사출 금형 전면 재설계.',
        designIntent: 'MPV 3열까지의 개방감 확보. 쿼터 글래스 확대로 측면 시야 개선.',
        impactArea: '사출 금형 신규, 쿼터 글래스 접합부 수밀 검증',
        coPossibility: 'none', coCondition: '차종 고유 차체 형상에 종속. C/O 불가.',
        additionalCost: 1.6
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.0 },
      { partName: 'Door Garnish Upper Rr RH', partNo: 'AZ-DT-020', isCo: false, nonCoReason: 'MPV 후석 벨트라인 (Rr LH 대칭)', reasonDetail: {
        category: '디자인', baseSpec: 'Rr LH 대칭', newSpec: 'Rr LH 대칭',
        diffDescription: 'Rr LH와 대칭.', designIntent: 'Rr LH와 동일.', impactArea: 'Rr LH와 동일',
        coPossibility: 'none', coCondition: 'Rr LH와 동일.', additionalCost: 1.6
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.0 },
      { partName: 'Rear Door Pocket Ext. LH', partNo: 'AZ-DT-021', isCo: false, nonCoReason: 'MPV 후석 우산 수납 포켓 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 표준 보틀 홀더만 적용', newSpec: 'AZ7i: 보틀 홀더 + 접이식 우산 포켓(L 320 × W 80mm) 추가',
        diffDescription: 'MPV 인도 몬순 시즌 대응 — 후석 도어에 접이식 우산 전용 포켓 신규 추가. 도어트림 보드 하단에 포켓 장착 리브 및 드레인 홀(Ø 8mm) 추가 필요.',
        designIntent: '인도 우기(6~9월) 실사용 편의 — 젖은 우산 별도 수납으로 실내 오염 방지. 드레인 홀로 자동 배수.',
        impactArea: '도어트림 보드 금형 국소 변경(리브+드레인), 우산 포켓 금형 신규',
        coPossibility: 'medium', coCondition: '우산 포켓을 인도 전 차종 표준 사양으로 채택하면 포켓 모듈 공용화 가능. 도어트림 보드 금형만 차종별 국소 대응.',
        additionalCost: 0.8
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.4 },
      { partName: 'Rear Door Pocket Ext. RH', partNo: 'AZ-DT-022', isCo: false, nonCoReason: 'MPV 후석 우산 수납 포켓 신규 (RH)', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: LH와 동일', newSpec: 'AZ7i: LH와 대칭',
        diffDescription: 'LH와 대칭 구조.', designIntent: 'LH와 동일.', impactArea: 'LH와 동일',
        coPossibility: 'medium', coCondition: 'LH와 동일.',
        additionalCost: 0.8
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.4 },
      { partName: 'Sliding Door Guide Rail Cover LH', partNo: 'AZ-DT-023', isCo: false, nonCoReason: 'MPV 슬라이딩 도어 전용 신규 부품', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 일반 힌지 도어 — 해당 부품 없음', newSpec: 'AZ7i: 2열 슬라이딩 도어용 가이드 레일 커버, L 580mm, ABS 사출+새틴 크롬 도금',
        diffDescription: 'MPV 2열 슬라이딩 도어 적용에 따라 가이드 레일 노출부를 커버하는 신규 부품. CT5i의 힌지 도어에는 존재하지 않는 MPV 전용 부품.',
        designIntent: '슬라이딩 도어 가이드 레일 미관 확보 및 이물 유입 방지.',
        impactArea: '커버 사출 금형 신규, 크롬 도금, 레일 간섭 검증',
        coPossibility: 'none', coCondition: '슬라이딩 도어 차종에서만 필요. 일반 힌지 도어 차종과 공용 불가.',
        additionalCost: 1.4
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.6 },
      { partName: 'Sliding Door Guide Rail Cover RH', partNo: 'AZ-DT-024', isCo: false, nonCoReason: 'MPV 슬라이딩 도어 전용 (RH)', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 해당 부품 없음', newSpec: 'AZ7i: LH와 대칭',
        diffDescription: 'LH와 대칭 구조.', designIntent: 'LH와 동일.', impactArea: 'LH와 동일',
        coPossibility: 'none', coCondition: 'LH와 동일.',
        additionalCost: 1.4
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.6 },
    ]},
    { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 38, coSubParts: 24, coCost: 228.6, newDevCost: 312.4, details: [
      { partName: 'Fr Seat Frame Set (LH/RH)', partNo: 'AZ-ST-001', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 25.6 },
      { partName: 'Fr Recliner Set', partNo: 'AZ-ST-002', isCo: true, coSource: 'CT5i', supplier: 'Faurecia', supplierRegion: 'Pune', materialCost: 9.6 },
      { partName: 'Fr Slide Rail Set', partNo: 'AZ-ST-003', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 12.4 },
      { partName: 'Fr Headrest Set', partNo: 'AZ-ST-004', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 5.2 },
      { partName: 'Fr Cushion Pad Set', partNo: 'AZ-ST-005', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 6.8 },
      { partName: 'Rr Seat Frame', partNo: 'AZ-ST-006', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 8.2 },
      { partName: 'Rr Seat Pad Set', partNo: 'AZ-ST-007', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 4.6 },
      { partName: 'Rr Headrest Set', partNo: 'AZ-ST-008', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 5.2 },
      { partName: 'Rr Armrest', partNo: 'AZ-ST-009', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.4 },
      { partName: 'Seat Belt Set (Fr/Rr)', partNo: 'AZ-ST-010', isCo: true, coSource: 'CT5i', supplier: 'Autoliv', supplierRegion: 'Bangalore', materialCost: 12.8 },
      { partName: 'Fr Seat Back Cover Set', partNo: 'AZ-ST-011', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 7.2 },
      { partName: 'Fr Cushion Cover Set', partNo: 'AZ-ST-012', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 8.4 },
      { partName: 'Rr Cushion Cover', partNo: 'AZ-ST-013', isCo: false, nonCoReason: 'MPV 전용 컬러/소재 차별화 (우드 테마)', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 직물+합피 콤비, 다크그레이 스포츠 패턴', newSpec: 'AZ7i: 합성피혁 풀커버, 베이지+브라운 투톤, 다이아몬드 퀼팅',
        diffDescription: '커버 소재가 직물+합피 콤비→합성피혁 풀커버로 변경. MPV 패밀리 인테리어 따뜻한 톤(베이지+브라운) 적용. 퀼팅 패턴으로 프리미엄감 강화.',
        designIntent: 'MPV 프리미엄 패밀리 인테리어. IP/도어/콘솔 우드 테마와 통일된 따뜻한 컬러 톤.',
        impactArea: '재단 다이 신규, 봉제 라인 전면 변경, 합성피혁 접착 공정',
        coPossibility: 'none', coCondition: '커버류 차종 고유. 소재/컬러 차별화 필수.',
        additionalCost: 1.6
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.8 },
      { partName: 'Rr Back Cover', partNo: 'AZ-ST-014', isCo: false, nonCoReason: 'MPV 전용 컬러/소재 차별화', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 직물+합피 다크그레이', newSpec: 'AZ7i: 합성피혁 베이지+브라운, 등판 포켓 추가',
        diffDescription: '쿠션 커버와 동일 소재/컬러 + 등판 메쉬 포켓 추가.',
        designIntent: '전후석 통일 감성 + 후석 수납 편의.',
        impactArea: '재단 다이 신규, 포켓 봉제 추가',
        coPossibility: 'none', coCondition: '커버류 차종 고유.',
        additionalCost: 1.4
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.2 },
      { partName: '3rd Row Seat Frame', partNo: 'AZ-ST-015', isCo: false, nonCoReason: 'MPV 3열 시트 신규 — 기존 차종 미적용', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 2열까지만 적용. 3열 시트 없음.', newSpec: 'AZ7i: 3열 50:50 분할 폴딩 시트, 쿠션 높이 H 280mm, 슬라이드 120mm, 리클라이닝 12°',
        diffDescription: 'MPV 전용 3열 시트 전체가 신규 개발. 프레임, 패드, 커버, 벨트, 헤드레스트, 폴딩 메커니즘 전부 신규. CT5i에 해당 부품 자체가 없음.',
        designIntent: 'MPV 핵심 — 7인승 레이아웃 구현. 인도 시장 대가족 이동 필수.',
        impactArea: '프레임 금형 4벌(좌/우 + 쿠션/백), 패드 발포 금형 2벌, 폴딩 메커니즘 전용 개발, 충돌 안전 시험(후면 충돌)',
        coPossibility: 'low', coCondition: 'NX8 MPV에서 동일 3열 사이즈 채택 시 프레임 C/O 가능. 현재 NX8도 7인승 검토 중.',
        additionalCost: 18.4
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 28.6 },
      { partName: '3rd Row Seat Pad Set', partNo: 'AZ-ST-016', isCo: false, nonCoReason: '3열 시트 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 해당 없음', newSpec: 'AZ7i: 3열 전용 쿠션/백 패드, 밀도 40kg/m³, 두께 60mm',
        diffDescription: '3열 시트 프레임에 연동하는 신규 패드. 3열 공간 제약으로 패드 두께를 최소화(60mm)하되 밀도 조절로 착좌감 확보.',
        designIntent: '제한된 3열 공간에서 최적 착좌감 확보.',
        impactArea: '발포 금형 2벌 신규',
        coPossibility: 'low', coCondition: '3열 프레임과 연동. 프레임 C/O 시 패드도 자동 C/O.',
        additionalCost: 3.2
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 5.4 },
      { partName: '3rd Row Cover Set', partNo: 'AZ-ST-017', isCo: false, nonCoReason: '3열 시트 커버 신규 + MPV 컬러', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 해당 없음', newSpec: 'AZ7i: 합성피혁 베이지 단색, 플랫 패턴 (원가 최적화)',
        diffDescription: '3열 커버는 원가 감안 단색 합성피혁 적용. 2열 대비 퀼팅 미적용으로 원가 절감.',
        designIntent: '3열은 단거리/보조 착석 용도로 원가 최적화하되 최소한의 프리미엄 감성 유지.',
        impactArea: '재단 다이 신규, 봉제 라인 변경',
        coPossibility: 'low', coCondition: 'NX8 3열과 프레임 공유 시 커버 사이즈도 공유 가능.',
        additionalCost: 2.8
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 4.6 },
      { partName: '3rd Row Belt Set', partNo: 'AZ-ST-018', isCo: false, nonCoReason: '3열 시트 벨트 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 해당 없음', newSpec: 'AZ7i: 3열 3점식 벨트 × 3인분, ELR 타입',
        diffDescription: '3열 시트에 필수적인 안전벨트 3세트 신규 적용. C필라 마운트 포인트 3개소 + 버클 3세트.',
        designIntent: 'MPV 7인승 법규 필수 — 3열 전 좌석 3점식 벨트.',
        impactArea: 'C필라 보강판 추가, 벨트 리트랙터 마운트, 충돌 시험',
        coPossibility: 'low', coCondition: 'NX8과 C필라 구조 동일 시 마운트 공용 가능.',
        additionalCost: 4.8
      }, supplier: 'Autoliv', supplierRegion: 'Bangalore', materialCost: 8.4 },
      { partName: '3rd Row Headrest Set', partNo: 'AZ-ST-019', isCo: false, nonCoReason: '3열 시트 헤드레스트 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 해당 없음', newSpec: 'AZ7i: 3열 헤드레스트 × 3ea, 2단 높이 조절, H 120mm(최소)~180mm(최대)',
        diffDescription: '3열 전 좌석 헤드레스트 신규. 3열 천정 간섭 고려하여 최대 높이 180mm로 제한.',
        designIntent: '3열 승객 안전(후면 충돌 시 경추 보호).',
        impactArea: '헤드레스트 금형 신규, 시트백 가이드 로드 삽입 구조',
        coPossibility: 'medium', coCondition: 'NX8 3열에 동일 사이즈 적용 시 C/O 가능.',
        additionalCost: 1.8
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.0 },
      { partName: 'Rr Bolster Foam (Cushion)', partNo: 'AZ-ST-020', isCo: false, nonCoReason: 'MPV 2열 쿠션각 변경에 따른 볼스터 형상 차이', reasonDetail: {
        category: '형상차이', baseSpec: 'CT5i: 쿠션각 13°, 볼스터 H 42mm, 폼 밀도 45kg/m³', newSpec: 'AZ7i: 쿠션각 14.5°(+1.5°), 볼스터 H 44mm(+2mm), 폼 밀도 48kg/m³',
        diffDescription: 'MPV 착좌 최적화를 위해 CT5i 대비 쿠션각 1.5° 증가, 볼스터 소폭 확대. 발포 금형 캐비티 변경 필요.',
        designIntent: 'MPV 장거리 가족 이동 시 2열 착좌 안정감 확보.',
        impactArea: '발포 금형 변경, 착좌감 주관평가',
        coPossibility: 'high', coCondition: 'NX8과 동일 쿠션각 적용 시 발포 금형 C/O 가능. 현재 NX8은 15.5°로 차이 있음.',
        additionalCost: 0.8
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 2.8 },
    ]},
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
  code: 'DX4i', name: 'DX4i (Crossover)', stage: 'ALL도', date: "'27.8", half: 'H2', type: '개발', salesVolume: 35000,
  parts: [
    { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 13, coCost: 92.4, newDevCost: 135.6, details: [
      { partName: 'IP Frame Assy', partNo: 'DX-IP-001', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 12.4 },
      { partName: 'IP Upper Pad', partNo: 'DX-IP-002', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 8.6 },
      { partName: 'IP Lower Cover', partNo: 'DX-IP-003', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.2 },
      { partName: 'Glove Box Assy', partNo: 'DX-IP-004', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 4.8 },
      { partName: 'Center Vent Assy', partNo: 'DX-IP-005', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 3.2 },
      { partName: 'Side Vent Set', partNo: 'DX-IP-006', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 4.8 },
      { partName: 'Cowl Cross Bar', partNo: 'DX-IP-007', isCo: true, coSource: 'CT5i', supplier: 'Sungwoo', supplierRegion: 'Chennai', materialCost: 8.2 },
      { partName: 'Knee Bolster', partNo: 'DX-IP-008', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.8 },
      { partName: 'Speaker Grille (IP)', partNo: 'DX-IP-009', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
      { partName: 'Defroster Duct', partNo: 'DX-IP-010', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 1.8 },
      { partName: 'Fuse Box Cover', partNo: 'DX-IP-011', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
      { partName: 'Hood Latch Cable', partNo: 'DX-IP-012', isCo: true, coSource: 'CT5i', supplier: 'Hi-Lex', supplierRegion: 'Gurgaon', materialCost: 1.4 },
      { partName: 'Glove Box Striker', partNo: 'DX-IP-013', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 0.6 },
      { partName: 'Cluster Hood', partNo: 'DX-IP-014', isCo: false, nonCoReason: 'Crossover 전용 연결형 디스플레이 하우징 변경', reasonDetail: {
        category: '사양변경', baseSpec: 'CT5i: 분리형 클러스터+AVN, 후드 개구부 W 275mm', newSpec: 'DX4i: 연결형 파노라마 디스플레이(12.3"+12.3"), 후드 일체형 W 580mm, 하부 앰비언트 LED 바',
        diffDescription: '클러스터와 AVN이 하나의 파노라마 디스플레이로 연결되면서 후드가 완전히 새로운 와이드 형상으로 변경. 하부에 앰비언트 LED 바가 추가되어 금형 구조 전면 재설계. CT5i의 분리형과 호환 불가.',
        designIntent: 'Crossover 젊은 타겟층 대상 "테크 감성" 파노라마 디스플레이. 인도 시장 디지털 경험 중시 트렌드 대응.',
        impactArea: '후드 금형 전면 신규, LED 바 도광판 금형, 디스플레이 장착 브래킷 3종 신규',
        coPossibility: 'none', coCondition: '파노라마 디스플레이는 DX4i 전용 핵심 USP. 분리형 CT5i와 구조적 호환 불가.',
        additionalCost: 3.2
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.8 },
      { partName: 'Center Fascia Panel', partNo: 'DX-IP-015', isCo: false, nonCoReason: '파노라마 디스플레이 연동 파시아 전면 재설계', reasonDetail: {
        category: '사양변경', baseSpec: 'CT5i: 분리형 AVN 10.25", 파시아 W 260mm, 물리 다이얼 3개', newSpec: 'DX4i: 연결형 12.3" AVN, 파시아 하단 풀터치, 물리 버튼 제거, W 580mm 파노라마 연속면',
        diffDescription: '파노라마 디스플레이 하단의 에어컨 조작이 풀터치로 전환되면서 파시아 전체가 터치 일체형으로 변경. 물리 버튼/다이얼 완전 제거. 파시아-디스플레이-후드가 하나의 연속면을 이루는 신규 설계.',
        designIntent: 'Crossover 미니멀 인테리어 — 물리 버튼 제거 트렌드. 깔끔한 터치 기반 UX.',
        impactArea: '파시아 금형 전면 신규, 터치 PCB 대형화, 햅틱 피드백 모듈, EMC 재검증',
        coPossibility: 'none', coCondition: '파노라마 디스플레이 구조와 일체. CT5i 분리형과 호환 불가.',
        additionalCost: 4.2
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 7.4 },
      { partName: 'IP Garnish Set', partNo: 'DX-IP-016', isCo: false, nonCoReason: 'Crossover 전용 컬러/메탈 텍스처', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 다크그레이 그레인 #G-108', newSpec: 'DX4i: 건메탈 메탈릭 그레인 #G-225 + 오렌지 액센트 라인',
        diffDescription: 'Crossover 스포티+영 이미지 반영. 건메탈 메탈릭 그레인 + 오렌지 액센트 조합. 액센트 라인 인서트 몰딩으로 이중 사출.',
        designIntent: 'Crossover 활동적/역동적 인테리어 감성. 경쟁차(Creta N Line) 대비 차별화.',
        impactArea: '그레인 전사 금형 변경, 오렌지 액센트 인서트 금형, 이중 사출 공정',
        coPossibility: 'high', coCondition: '가니쉬 외곽 형상은 CT5i와 동일 가능. 그레인/컬러만 차별화 시 금형 C/O + 후가공 별도.',
        additionalCost: 1.4
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 4.2 },
      { partName: 'PAB Door', partNo: 'DX-IP-017', isCo: false, nonCoReason: 'Crossover H-point 변경에 따른 에어백 전개 각도 변경', reasonDetail: {
        category: '법규', baseSpec: 'CT5i: PAB 전개 각도 48°, 티어 라인 W 280mm', newSpec: 'DX4i: PAB 전개 각도 46°(−2°), 티어 라인 W 275mm, 파노라마 디스플레이 간섭 회피 형상',
        diffDescription: 'Crossover H-point가 CT5i 대비 10mm 하향되어 PAB 전개 각도 2° 하향 조정. 파노라마 디스플레이 하단 간섭 회피를 위한 에어백 도어 좌측 형상 변경.',
        designIntent: 'BNVSAP 충돌 안전 필수 대응 + 파노라마 디스플레이와의 간섭 방지.',
        impactArea: '에어백 도어 금형 신규, 충돌 시험 3조건, 디스플레이 간섭 검증',
        coPossibility: 'low', coCondition: 'H-point 및 디스플레이 구조가 차종 고유. 동일 파노라마 적용 차종에서만 공용 검토.',
        additionalCost: 2.2
      }, supplier: 'Autoliv', supplierRegion: 'Bangalore', materialCost: 5.0 },
      { partName: 'USB-C Hub Panel', partNo: 'DX-IP-018', isCo: false, nonCoReason: 'Crossover 전용 IP 하단 USB-C 허브 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: IP 하단 USB 포트 없음 (콘솔에만 배치)', newSpec: 'DX4i: IP 하단 USB-C × 2포트 + 12V 소켓, 패널 W 96 × H 44mm',
        diffDescription: 'Crossover 젊은 사용자 디바이스 충전 편의를 위해 IP 하단에 추가 USB-C 허브 배치. CT5i에는 없던 신규 개구부 및 모듈.',
        designIntent: '다수 디바이스 동시 충전 편의. Crossover 타겟 20~30대 디지털 네이티브 대응.',
        impactArea: 'IP 하단 패널 개구부 가공, USB 모듈 브래킷, 하네스 추가',
        coPossibility: 'medium', coCondition: 'IP 하단 USB 허브를 표준 모듈화하면 EV2i/TX6i에도 확대 적용 가능.',
        additionalCost: 0.8
      }, supplier: 'Aptiv', supplierRegion: 'Pune', materialCost: 3.6 },
    ]},
    { system: 'Console', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 12, coSubParts: 12, coCost: 62.4, newDevCost: 72.8 },
    { system: 'Door Trim', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 18, coCost: 96.4, newDevCost: 138.2, details: [
      { partName: 'Door Trim Board Set (Fr/Rr 4ea)', partNo: 'DX-DT-001', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 24.4 },
      { partName: 'Armrest Pad Set (4ea)', partNo: 'DX-DT-002', isCo: true, coSource: 'CT5i', supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 9.6 },
      { partName: 'Map Pocket Set (4ea)', partNo: 'DX-DT-003', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 4.8 },
      { partName: 'Handle Escutcheon Set', partNo: 'DX-DT-004', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 3.2 },
      { partName: 'Speaker Grille Set', partNo: 'DX-DT-005', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 2.4 },
      { partName: 'Window Switch Panel Set', partNo: 'DX-DT-006', isCo: true, coSource: 'CT5i', supplier: 'Alps Alpine', supplierRegion: 'Pune', materialCost: 11.4 },
      { partName: 'Bottle Holder Set', partNo: 'DX-DT-007', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 3.2 },
      { partName: 'Door Scuff Plate Set', partNo: 'DX-DT-008', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 4.4 },
      { partName: 'Belt Weatherstrip Set', partNo: 'DX-DT-009', isCo: true, coSource: 'CT5i', supplier: 'Hwaseung', supplierRegion: 'Chennai', materialCost: 5.8 },
      { partName: 'Door Garnish Fr LH', partNo: 'DX-DT-010', isCo: false, nonCoReason: 'Crossover 쿠페형 루프라인 변경에 따른 벨트라인 차이', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 벨트라인 H 905mm, 직선형 가니쉬', newSpec: 'DX4i: 벨트라인 H 895mm(−10mm), 후방 상승 기울기 3°(쿠페형), 건메탈 인서트',
        diffDescription: 'Crossover 쿠페형 루프라인에 따라 벨트라인이 전방 10mm 하향 + 후방으로 3° 상승하는 기울기 적용. 가니쉬가 직선→경사형으로 변경. 건메탈 인서트로 스포티 감성.',
        designIntent: 'Crossover 쿠페형 사이드 프로포션. 역동적 벨트라인으로 스포티 이미지 극대화.',
        impactArea: '사출 금형 신규, 건메탈 인서트 금형, 풍절음 NVH 재검증',
        coPossibility: 'none', coCondition: '벨트라인은 차종 고유 디자인. 루프라인 종속.',
        additionalCost: 1.8
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.4 },
      { partName: 'Door Garnish Fr RH', partNo: 'DX-DT-011', isCo: false, nonCoReason: 'Crossover 쿠페형 벨트라인 (LH 대칭)', reasonDetail: {
        category: '디자인', baseSpec: 'LH 대칭', newSpec: 'LH 대칭',
        diffDescription: 'LH와 대칭.', designIntent: 'LH와 동일.', impactArea: 'LH와 동일',
        coPossibility: 'none', coCondition: 'LH와 동일.', additionalCost: 1.8
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.4 },
      { partName: 'Door Garnish Rr LH', partNo: 'DX-DT-012', isCo: false, nonCoReason: 'Crossover 쿠페형 후방 가니쉬 곡률 변경', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 후석 가니쉬 직선형, L 420mm', newSpec: 'DX4i: 후방 상승 곡선형, L 385mm(−35mm), 쿼터 글래스 축소 대응',
        diffDescription: 'Crossover 쿠페형 루프가 후방으로 내려오면서 후석 쿼터 글래스 면적 축소. 가니쉬 길이 35mm 단축 + 곡선 형상으로 변경.',
        designIntent: 'Crossover 쿠페 루프라인 연속성. 후방 스포일러 라인과의 시각적 조화.',
        impactArea: '사출 금형 신규, 수밀 검증',
        coPossibility: 'none', coCondition: '차체 루프라인 종속. C/O 불가.', additionalCost: 1.4
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.8 },
      { partName: 'Door Garnish Rr RH', partNo: 'DX-DT-013', isCo: false, nonCoReason: 'Crossover 쿠페형 (Rr LH 대칭)', reasonDetail: {
        category: '디자인', baseSpec: 'Rr LH 대칭', newSpec: 'Rr LH 대칭',
        diffDescription: 'Rr LH와 대칭.', designIntent: 'Rr LH와 동일.', impactArea: 'Rr LH와 동일',
        coPossibility: 'none', coCondition: 'Rr LH와 동일.', additionalCost: 1.4
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.8 },
      { partName: 'Ambient Light Module Set (Fr)', partNo: 'DX-DT-014', isCo: false, nonCoReason: 'Crossover 전용 RGB 앰비언트 라이트 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 앰비언트 라이트 미적용', newSpec: 'DX4i: RGB LED 앰비언트, 도광판 L 650mm × 2ea, 파노라마 디스플레이 색상 연동',
        diffDescription: 'NX8과 유사한 앰비언트 라이트이나 파노라마 디스플레이 색상과 연동하는 RGB 방식 적용. 도광판 길이/경로가 DX4i 도어트림 형상에 맞춰 전용 설계.',
        designIntent: 'Crossover 테크 감성 강화. 파노라마 디스플레이~도어 조명 통합 UX.',
        impactArea: '도어트림 도광판 홈 가공, RGB LED 모듈 신규, 바디 ECU 연동',
        coPossibility: 'medium', coCondition: 'LED 모듈은 NX8과 공용 가능. 도광판 경로만 차종별 전용.',
        additionalCost: 4.2
      }, supplier: 'Hella', supplierRegion: 'Pune', materialCost: 5.8 },
      { partName: 'Cargo Net Hook Set (Rr)', partNo: 'DX-DT-015', isCo: false, nonCoReason: 'Crossover 전용 카고 네트 후크 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 후석 도어트림 카고 후크 미적용', newSpec: 'DX4i: 접이식 카고 네트 후크 × 4ea, 내하중 5kg/개, 도어트림 보드 보강판 매입',
        diffDescription: 'Crossover 적재 편의를 위한 접이식 카고 후크 신규. 도어트림 보드에 보강 금속판(SUS 1.0t) 매입하여 하중 지지. CT5i에 없는 Crossover 전용.',
        designIntent: 'Crossover 아웃도어 활동 타겟. 카고 네트 장착으로 소형 화물 고정 편의.',
        impactArea: '도어트림 보드 금형 국소 변경(보강판 인서트), 후크 금형 신규',
        coPossibility: 'medium', coCondition: '카고 후크를 Crossover/SUV 표준 옵션으로 채택하면 후크 모듈 공용 가능.',
        additionalCost: 0.6
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
    ]},
    { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 36, coSubParts: 22, coCost: 218.4, newDevCost: 308.6, details: [
      { partName: 'Fr Seat Frame Set', partNo: 'DX-ST-001', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 25.6 },
      { partName: 'Fr Recliner Set', partNo: 'DX-ST-002', isCo: true, coSource: 'CT5i', supplier: 'Faurecia', supplierRegion: 'Pune', materialCost: 9.6 },
      { partName: 'Fr Slide Rail Set', partNo: 'DX-ST-003', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 12.4 },
      { partName: 'Fr Headrest Set', partNo: 'DX-ST-004', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 5.2 },
      { partName: 'Fr Cushion Pad Set', partNo: 'DX-ST-005', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 6.8 },
      { partName: 'Fr Back Cover Set', partNo: 'DX-ST-006', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 7.2 },
      { partName: 'Rr Seat Frame', partNo: 'DX-ST-007', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 8.2 },
      { partName: 'Rr Seat Pad Set', partNo: 'DX-ST-008', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 4.6 },
      { partName: 'Rr Headrest Set', partNo: 'DX-ST-009', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 5.2 },
      { partName: 'Rr Armrest', partNo: 'DX-ST-010', isCo: true, coSource: 'CT5i', supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.4 },
      { partName: 'Seat Belt Set', partNo: 'DX-ST-011', isCo: true, coSource: 'CT5i', supplier: 'Autoliv', supplierRegion: 'Bangalore', materialCost: 12.8 },
      { partName: 'Fr Cushion Cover Set', partNo: 'DX-ST-012', isCo: false, nonCoReason: 'Crossover 전용 스포츠 볼스터 + 메쉬 인서트', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 직물+합피, 볼스터 W 68mm, 스포츠 스티치', newSpec: 'DX4i: 합피+메쉬 통기 인서트, 볼스터 W 75mm(+7mm), 건메탈 스티치, 오렌지 파이핑',
        diffDescription: 'Crossover 스포츠 지향 시트. 볼스터 7mm 추가 확대, 메쉬 통기 인서트(인도 고온 대응), 오렌지 파이핑으로 IP 가니쉬와 컬러 통일. 재단 패턴 전면 변경.',
        designIntent: 'Crossover 스포티+쿨링 콤비네이션. 인도 고온 + 역동적 주행 모두 대응.',
        impactArea: '재단 다이 신규, 메쉬 소재 접합 공정, 파이핑 봉제 추가',
        coPossibility: 'none', coCondition: '커버류 차종 고유 디자인.', additionalCost: 2.2
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 5.0 },
      { partName: 'Rr Cushion Cover', partNo: 'DX-ST-013', isCo: false, nonCoReason: 'Crossover 전용 컬러/소재 통일', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: 직물+합피 다크그레이', newSpec: 'DX4i: 합피+메쉬, 건메탈+오렌지 파이핑',
        diffDescription: '전석과 동일 소재/컬러 통일. 봉제 패턴 변경.',
        designIntent: '전후석 인테리어 통일.', impactArea: '재단 다이 신규',
        coPossibility: 'none', coCondition: '커버류 차종 고유.', additionalCost: 1.8
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 4.2 },
      { partName: 'Rr Back Cover', partNo: 'DX-ST-014', isCo: false, nonCoReason: 'Crossover 컬러 통일 + 카고 접근 레버 추가', reasonDetail: {
        category: '사양변경', baseSpec: 'CT5i: 직물+합피, 등판 포켓 1개', newSpec: 'DX4i: 합피+메쉬, 등판 포켓 + 60:40 분할 폴딩 레버(트렁크 측 접근)',
        diffDescription: '소재/컬러 변경에 더해 Crossover 적재 편의를 위한 후석 폴딩 레버가 시트백 후면에 추가. 레버 마운트 보강판 매입.',
        designIntent: 'Crossover 적재공간 활용 극대화. 트렁크에서 한 손으로 후석 폴딩.',
        impactArea: '재단 다이 신규, 폴딩 레버 모듈 추가, 보강판 인서트',
        coPossibility: 'medium', coCondition: '60:40 폴딩 레버를 SUV/Crossover 표준으로 채택하면 레버 모듈 공용 가능.',
        additionalCost: 1.6
      }, supplier: 'Dymos', supplierRegion: 'Chennai', materialCost: 3.8 },
      { partName: 'Ventilation Fan Module (Fr)', partNo: 'DX-ST-015', isCo: false, nonCoReason: 'Crossover 전석 통풍시트 신규 적용', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 통풍시트 미적용', newSpec: 'DX4i: 쿠션+백 통풍(흡입식), 팬 모터 Ø 80mm × 4ea, 3단계 풍량, 메쉬 인서트 연동',
        diffDescription: '인도 고온 환경 대응 핵심 사양으로 전석 통풍시트 신규 적용. 쿠션/백 각 2개씩 총 4개 팬 모터. 시트 쿠션 폼에 에어 채널 가공 필요. 전용 하네스 + 스위치.',
        designIntent: '인도 40°C+ 외기 환경에서 운전자/조수석 쿨링 필수 사양. 경쟁차 선탑재에 대한 패리티 확보.',
        impactArea: '쿠션/백 패드 에어채널 금형 변경, 팬 모터 4ea + 하네스, 통풍 성능 DV 시험, NVH(팬 소음) 시험',
        coPossibility: 'high', coCondition: '통풍 팬 모듈을 플랫폼 표준 모듈로 개발하면 EV2i/TX6i/NX8 전 차종 확대 가능. 시트 패드 에어채널 규격만 통일 필요.',
        additionalCost: 6.8
      }, supplier: 'Gentherm', supplierRegion: 'Import (US)', materialCost: 12.4 },
      { partName: 'Lumbar Support Module', partNo: 'DX-ST-016', isCo: false, nonCoReason: 'Crossover 전동 럼버 서포트 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: 럼버 서포트 미적용', newSpec: 'DX4i: 4방향 전동 럼버 서포트, 에어백 방식, 펌프 모터 1ea',
        diffDescription: '장거리 주행 편의를 위한 전동 럼버 서포트 신규 적용. 시트백 프레임 후면에 에어백+펌프 모듈 장착. 전용 스위치 1개 + 하네스.',
        designIntent: 'Crossover 장거리 아웃도어 여행 시 요추 지지 편의.',
        impactArea: '시트백 프레임 마운트 변경, 에어백 모듈+펌프+하네스 추가, 스위치 패널 변경',
        coPossibility: 'high', coCondition: '럼버 모듈을 시트 프레임 공용 마운트에 장착하는 표준 설계로 전 차종 확대 가능.',
        additionalCost: 3.4
      }, supplier: 'Faurecia', supplierRegion: 'Pune', materialCost: 5.8 },
    ]},
    { system: 'HVAC / Air Vent', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 16, coSubParts: 16, coCost: 101.0, newDevCost: 112.4 },
    { system: 'Headliner', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 10, coSubParts: 10, coCost: 62.4, newDevCost: 68.2 },
    { system: 'Pillar Trim', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 8, coSubParts: 8, coCost: 28.6, newDevCost: 34.8 },
    { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 34.8, newDevCost: 42.2 },
    { system: 'Carpet / Floor', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 32.6, newDevCost: 38.4 },
    { system: 'Garnish / Molding', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 10, coSubParts: 7, coCost: 16.2, newDevCost: 24.6, details: [
      { partName: 'A Pillar Garnish Set', partNo: 'DX-GM-001', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.8 },
      { partName: 'B Pillar Garnish Set', partNo: 'DX-GM-002', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.2 },
      { partName: 'C Pillar Garnish Set', partNo: 'DX-GM-003', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.6 },
      { partName: 'Roof Rail Molding Set', partNo: 'DX-GM-004', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 2.4 },
      { partName: 'Trunk Sill Garnish', partNo: 'DX-GM-005', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.8 },
      { partName: 'Front Bumper Lower Molding', partNo: 'DX-GM-006', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 1.6 },
      { partName: 'Side Sill Molding Set', partNo: 'DX-GM-007', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.8 },
      { partName: 'Wheel Arch Molding Set', partNo: 'DX-GM-008', isCo: false, nonCoReason: 'Crossover 전용 오버펜더 확대 디자인', reasonDetail: {
        category: '디자인', baseSpec: 'AZ7i: 플러시형 아치몰딩, 돌출 12mm, 무도장 블랙', newSpec: 'DX4i: 오버펜더형, 돌출 28mm(+16mm), 건메탈 도장, 에어 인테이크 패턴',
        diffDescription: 'Crossover SUV 역동적 이미지를 위해 휠 아치 몰딩이 오버펜더형으로 대폭 확대. 돌출 16mm 증가, 건메탈 도장+에어 인테이크 패턴으로 스포티 감성. AZ7i MPV의 플러시형과 완전히 다른 디자인.',
        designIntent: 'Crossover "터프+스포티" 이미지. 큰 타이어+오버펜더 조합으로 아웃도어 감성.',
        impactArea: '사출 금형 4벌(Fr/Rr × LH/RH) 신규, 도장 공정 추가',
        coPossibility: 'none', coCondition: '오버펜더는 Crossover 고유 디자인 요소. 차종별 차체 형상에 종속.',
        additionalCost: 2.4
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.8 },
      { partName: 'Rear Spoiler Garnish', partNo: 'DX-GM-009', isCo: false, nonCoReason: 'Crossover 쿠페형 전용 리어 스포일러', reasonDetail: {
        category: '디자인', baseSpec: 'AZ7i: 소형 립 스포일러, L 960mm', newSpec: 'DX4i: 대형 쿠페형 스포일러, L 1080mm, 하이마운트 스톱램프 통합',
        diffDescription: 'Crossover 쿠페형 리어 디자인에 맞는 대형 스포일러. AZ7i 대비 길이 120mm 확대. 하이마운트 스톱램프가 스포일러에 통합되어 일체형 금형 필요.',
        designIntent: 'Crossover 스포티 리어뷰. 쿠페형 루프라인 마무리 디자인.',
        impactArea: '스포일러 금형 신규, LED 스톱램프 통합 배선, 공력 CFD 해석',
        coPossibility: 'none', coCondition: '쿠페형 루프라인 전용. 일반 SUV/MPV와 공용 불가.',
        additionalCost: 1.8
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.2 },
      { partName: 'Fender Signal Garnish Set', partNo: 'DX-GM-010', isCo: false, nonCoReason: 'Crossover 전용 펜더 턴시그널 가니쉬', reasonDetail: {
        category: '신규사양', baseSpec: 'AZ7i: 펜더 가니쉬 미적용', newSpec: 'DX4i: LED 턴시그널 통합 펜더 가니쉬 × 2ea, 건메탈 도금',
        diffDescription: 'Crossover 스포츠 이미지를 위한 펜더 측면 턴시그널 가니쉬 신규. AZ7i에 없는 부품. LED 모듈 + 도금 가니쉬 일체형.',
        designIntent: 'Crossover 측면 역동적 디자인 악센트.',
        impactArea: '가니쉬 금형 신규, LED 모듈, 도금 공정, 펜더 개구부 가공',
        coPossibility: 'low', coCondition: 'Crossover 전용 디자인 악센트. 일반 차종 미적용.',
        additionalCost: 1.2
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 2.2 },
    ]},
  ],
},
{
  code: 'EV2i', name: 'EV2i (Electric SUV)', stage: '시작차', date: "'27.1", half: 'H2', type: '개발', salesVolume: 25000,
  parts: [
    { system: 'IP (Crash Pad)', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 20, coSubParts: 10, coCost: 108.4, newDevCost: 168.2, details: [
      { partName: 'IP Frame Assy', partNo: 'EV-IP-001', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 12.4 },
      { partName: 'IP Upper Pad', partNo: 'EV-IP-002', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 8.6 },
      { partName: 'IP Lower Cover', partNo: 'EV-IP-003', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.2 },
      { partName: 'Glove Box Assy', partNo: 'EV-IP-004', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 4.8 },
      { partName: 'Center Vent Assy', partNo: 'EV-IP-005', isCo: true, coSource: 'AZ7i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 3.2 },
      { partName: 'Side Vent Set', partNo: 'EV-IP-006', isCo: true, coSource: 'AZ7i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 4.8 },
      { partName: 'Cowl Cross Bar', partNo: 'EV-IP-007', isCo: true, coSource: 'AZ7i', supplier: 'Sungwoo', supplierRegion: 'Chennai', materialCost: 8.2 },
      { partName: 'Knee Bolster', partNo: 'EV-IP-008', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.8 },
      { partName: 'Speaker Grille', partNo: 'EV-IP-009', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
      { partName: 'Defroster Duct', partNo: 'EV-IP-010', isCo: true, coSource: 'AZ7i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 1.8 },
      { partName: 'Cluster Hood', partNo: 'EV-IP-011', isCo: false, nonCoReason: 'EV 전용 플랫 디지털 클러스터 (7" 스탠드형)', reasonDetail: {
        category: '사양변경', baseSpec: 'AZ7i: 10.25" 매입형 클러스터, 후드 개구부 W 290mm', newSpec: 'EV2i: 7" 스탠드형 팝업 클러스터, 후드 제거 → 슬림 바이저, 폭 W 198mm',
        diffDescription: 'EV 전용 미니멀 인테리어 — 대형 매입 클러스터 대신 7" 소형 스탠드형 팝업 클러스터로 완전 변경. 기존 후드 구조 제거, 슬림 바이저만 적용. IP 상면 평탄화로 시야 확보.',
        designIntent: 'EV 미니멀 디자인 철학. 대형 센터 디스플레이 중심 UX(테슬라 스타일) + 최소한의 운전 정보만 클러스터에 표시.',
        impactArea: '후드→바이저 구조 전면 변경, IP 상면 금형 재설계, 팝업 메커니즘 신규, 스탠드 모듈',
        coPossibility: 'none', coCondition: 'EV 전용 미니멀 HMI 구조. ICE 차종과 근본적으로 다른 인터페이스.',
        additionalCost: 3.8
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 6.8 },
      { partName: 'Center Display (15.5")', partNo: 'EV-IP-012', isCo: false, nonCoReason: 'EV 전용 대형 센터 디스플레이 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'AZ7i: 10.25" AVN (가로형)', newSpec: 'EV2i: 15.5" 세로형 센터 디스플레이, 틸팅 기능(0~15°), 전용 마운트 + 배선',
        diffDescription: '기존 10.25" 가로형→15.5" 세로형으로 완전 변경. EV 차량 제어(충전/에너지/공조) 통합 인터페이스. 디스플레이 틸팅(운전석/조수석 방향 조절) 기능 추가.',
        designIntent: 'EV 통합 HMI — 충전/에너지/공조/내비 모든 기능을 하나의 대화면에서 제어. 인도 EV 시장 프리미엄 포지셔닝.',
        impactArea: '디스플레이 마운트 구조 전면 신규, 틸팅 메커니즘, 전용 ECU 연동, EMC/열관리 시험',
        coPossibility: 'none', coCondition: 'EV 전용 HMI. ICE 차종과 디스플레이 크기/방향/기능 완전히 상이.',
        additionalCost: 8.4
      }, supplier: 'LG Display', supplierRegion: 'Import (Korea)', materialCost: 14.6 },
      { partName: 'IP Garnish Set (Eco)', partNo: 'EV-IP-013', isCo: false, nonCoReason: 'EV 전용 리사이클 소재 + 그린 테마 컬러', reasonDetail: {
        category: '디자인', baseSpec: 'AZ7i: PP 사출, 우드 패턴 그레인', newSpec: 'EV2i: 리사이클 PET 50% 혼합 PP, 자연 텍스처 그레인 #G-ECO1, 민트 그린 액센트',
        diffDescription: 'EV ESG 이미지에 맞는 리사이클 소재 적용. 기존 PP→리사이클 PET 50% 혼합 PP로 소재 전환. 그레인 패턴도 우드→자연 텍스처로 변경. 민트 그린 액센트로 EV 아이덴티티.',
        designIntent: 'EV 친환경 이미지 — 리사이클 소재 사용으로 ESG 마케팅 + 실질 탄소 저감.',
        impactArea: '소재 변경(리사이클 PET 혼합 PP), 그레인 전사 금형 변경, 사출 조건 재설정, VOC 시험',
        coPossibility: 'medium', coCondition: '리사이클 PP가 전 차종 표준 소재로 채택되면 금형 C/O 가능. 다만 컬러/그레인은 차종별.',
        additionalCost: 1.6
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 4.4 },
      { partName: 'PAB Door', partNo: 'EV-IP-014', isCo: false, nonCoReason: 'EV 배터리 무게 증가에 따른 충돌 성능 재설계', reasonDetail: {
        category: '법규', baseSpec: 'AZ7i: PAB 52° 전개, 티어 라인 W 295mm', newSpec: 'EV2i: PAB 56°(+4°) 전개, 티어 라인 W 310mm(+15mm), 이중 티어 라인 구조',
        diffDescription: 'EV 배터리 무게 증가(+280kg)로 정면 충돌 감속도 증가. 이에 대응하여 PAB 전개량 확대(각도 +4°, 티어 라인 +15mm). 이중 티어 라인으로 전개 시 도어 파편 비산 방지.',
        designIntent: 'EV 중량 증가에 따른 BNVSAP/GNCAP 충돌 안전 필수 대응.',
        impactArea: '에어백 도어 금형 신규, 이중 티어 라인 가공, 충돌 시험(고온/저온/상온) + 배터리 탑재 조건 추가',
        coPossibility: 'none', coCondition: 'EV 전용 충돌 파라미터. ICE 차종과 중량/감속도 자체가 다름.',
        additionalCost: 3.2
      }, supplier: 'Autoliv', supplierRegion: 'Bangalore', materialCost: 5.8 },
      { partName: 'Wireless Charger Panel (IP)', partNo: 'EV-IP-015', isCo: false, nonCoReason: 'EV 전용 IP 통합 무선충전 패드', reasonDetail: {
        category: '신규사양', baseSpec: 'AZ7i: 콘솔에만 무선충전 배치', newSpec: 'EV2i: IP 하단 전용 무선충전 패드(Qi2 50W) + 스마트폰 MagSafe 마운트 통합',
        diffDescription: 'EV 플랫 플로어 구조에서 콘솔 공간이 축소되어 무선충전이 IP 하단으로 이동. MagSafe 호환 마운트 통합으로 스마트폰 내비 거치+충전 동시 가능.',
        designIntent: 'EV 플랫 플로어 활용 + 스마트폰 거치 편의. EV 사용자 디지털 라이프스타일 대응.',
        impactArea: 'IP 하단 개구부 가공, 무선충전 모듈+마운트 일체형 신규, 하네스, EMI 차폐',
        coPossibility: 'low', coCondition: 'EV 전용 IP 레이아웃. ICE 차종은 콘솔에 무선충전 유지.',
        additionalCost: 4.6
      }, supplier: 'Aircharge', supplierRegion: 'UK (Import)', materialCost: 8.2 },
      { partName: 'Energy Display Module', partNo: 'EV-IP-016', isCo: false, nonCoReason: 'EV 전용 에너지 흐름 디스플레이 패널', reasonDetail: {
        category: '신규사양', baseSpec: 'AZ7i: 해당 없음 (ICE 차량)', newSpec: 'EV2i: 2.4" OLED 에너지 흐름 표시 패널, IP 센터 상단, 배터리→모터→휠 실시간 에너지 플로우',
        diffDescription: 'EV 전용 부품. ICE 차량에 존재하지 않는 에너지 흐름 시각화 디스플레이. 회생 제동 에너지 표시 + 배터리 상태 + 예상 주행 거리 등.',
        designIntent: 'EV 사용자 에너지 인식 제고. 효율적 주행 유도.',
        impactArea: 'IP 상면 개구부, OLED 모듈+브래킷, 전용 ECU 연동, 소프트웨어',
        coPossibility: 'none', coCondition: 'EV 전용. ICE 차종 해당 없음.',
        additionalCost: 2.8
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 4.4 },
      { partName: 'Fuse Box Cover (HV)', partNo: 'EV-IP-017', isCo: false, nonCoReason: 'EV 고전압 퓨즈박스 별도 커버 필요', reasonDetail: {
        category: '법규', baseSpec: 'AZ7i: 12V 퓨즈박스 커버 단일', newSpec: 'EV2i: 12V + 고전압(400V) 퓨즈박스 이중 커버, 경고 라벨, 절연 구조',
        diffDescription: 'EV 400V 고전압 시스템 추가에 따라 퓨즈박스가 12V + HV 이중 구조. HV 커버에 절연 구조(ABS + 고무 패킹) 및 경고 라벨 법규 필수.',
        designIntent: 'EV 고전압 안전 법규 필수 대응.',
        impactArea: '퓨즈박스 커버 금형 신규, 절연 패킹 추가, 안전 라벨',
        coPossibility: 'none', coCondition: 'EV 전용 HV 구조.',
        additionalCost: 0.8
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.6 },
      { partName: 'Hood Latch Cable', partNo: 'EV-IP-018', isCo: false, nonCoReason: 'EV 프런트 트렁크(프렁크) 전용 래치 경로 변경', reasonDetail: {
        category: '형상차이', baseSpec: 'AZ7i: 엔진룸 후드 래치, 케이블 L 1.2m, 경로 직선', newSpec: 'EV2i: 프렁크 후드 래치, 케이블 L 0.9m(−0.3m), 경로 곡선(배터리 쿨링 라인 회피)',
        diffDescription: 'EV는 엔진 대신 프렁크(전방 트렁크). 래치 케이블 경로가 배터리 쿨링 라인을 회피하여 곡선으로 변경. 길이 0.3m 단축.',
        designIntent: 'EV 레이아웃 대응. 프렁크 접근성 확보.',
        impactArea: '케이블 길이/경로 변경, 라우팅 클립 위치 변경',
        coPossibility: 'none', coCondition: 'EV/ICE 엔진룸 구조 자체가 다름.',
        additionalCost: 0.4
      }, supplier: 'Hi-Lex', supplierRegion: 'Gurgaon', materialCost: 1.2 },
      { partName: 'Glove Box Striker (Damper)', partNo: 'EV-IP-019', isCo: false, nonCoReason: 'EV NVH 정숙성 강화 — 댐퍼 강화형', reasonDetail: {
        category: '성능', baseSpec: 'AZ7i: 오일 댐퍼 일체형, 토크 0.3Nm', newSpec: 'EV2i: 고감쇠 오일 댐퍼, 토크 0.15Nm(더 느린 개폐), 완충 고무 추가',
        diffDescription: 'EV 정숙성(엔진 소음 없음)으로 인해 글로브 박스 개폐 소음이 상대적으로 부각. 댐퍼 감쇠력 강화 + 완충 고무로 "딸깍" 소음 제거.',
        designIntent: 'EV 정숙 실내 환경에서의 NVH 세밀 관리.',
        impactArea: '댐퍼 규격 변경, 완충 고무 추가, 개폐감 주관평가',
        coPossibility: 'high', coCondition: '고감쇠 댐퍼를 전 차종 표준으로 채택하면 즉시 C/O. ICE 차종에도 품질감 향상.',
        additionalCost: 0.3
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.0 },
      { partName: 'IP Side Pad (NVH)', partNo: 'EV-IP-020', isCo: false, nonCoReason: 'EV 전용 NVH 흡음 패드 추가', reasonDetail: {
        category: '성능', baseSpec: 'AZ7i: IP 측면 흡음 패드 미적용', newSpec: 'EV2i: PU 폼 흡음 패드 × 2ea, IP 양측 A필라 접합부, 두께 15mm',
        diffDescription: 'EV 정숙 환경에서 A필라 접합부 풍절음이 부각. 이를 차단하기 위한 PU 폼 흡음 패드 신규 추가.',
        designIntent: 'EV NVH 프리미엄 품질.',
        impactArea: '패드 부착 브래킷, 풍절음 NVH 시험',
        coPossibility: 'high', coCondition: '흡음 패드를 전 차종 표준 적용하면 NVH 품질 일괄 향상.',
        additionalCost: 0.4
      }, supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 0.8 },
    ]},
    { system: 'Console', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 14, coSubParts: 6, coCost: 52.6, newDevCost: 82.4, details: [
      { partName: 'Console Housing Assy', partNo: 'EV-CN-001', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 8.4 },
      { partName: 'Cup Holder Assy', partNo: 'EV-CN-002', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 2.8 },
      { partName: 'Console Side Cover Set', partNo: 'EV-CN-003', isCo: true, coSource: 'AZ7i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 3.6 },
      { partName: 'Console Tray', partNo: 'EV-CN-004', isCo: true, coSource: 'AZ7i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.6 },
      { partName: 'Console Mat', partNo: 'EV-CN-005', isCo: true, coSource: 'AZ7i', supplier: 'Seoyon E-Hwa', supplierRegion: 'Chennai', materialCost: 0.8 },
      { partName: 'USB Port (Rear)', partNo: 'EV-CN-006', isCo: true, coSource: 'AZ7i', supplier: 'Aptiv', supplierRegion: 'Pune', materialCost: 3.8 },
      { partName: 'SBW Rotary Dial', partNo: 'EV-CN-007', isCo: false, nonCoReason: 'EV 전용 원버튼 SBW + 회생제동 패들', reasonDetail: {
        category: '사양변경', baseSpec: 'AZ7i: 기계식 레버, P/R/N/D 4단', newSpec: 'EV2i: 로터리 다이얼 SBW + 회생제동 강도 조절 패들(i-Pedal) × 2ea, 원키 파킹',
        diffDescription: '기계식 변속→EV 전용 로터리 SBW로 완전 변경. 회생제동 강도 조절 패들(스티어링 뒤)이 추가되며 콘솔에는 미니멀한 로터리 다이얼만 배치. 원키 파킹(P 버튼)으로 조작 간소화.',
        designIntent: 'EV 전용 드라이브 인터페이스. 회생제동 패들로 원페달 드라이빙 지원.',
        impactArea: '로터리 다이얼 모듈 신규, 패들 모듈 2ea, 콘솔 패널 금형, ECU 연동',
        coPossibility: 'none', coCondition: 'EV 전용 변속 시스템. ICE 차종과 근본적으로 다름.',
        additionalCost: 4.8
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 7.2 },
      { partName: 'Armrest (Sliding)', partNo: 'EV-CN-008', isCo: false, nonCoReason: 'EV 플랫 플로어 대응 슬라이딩 암레스트 신규', reasonDetail: {
        category: '사양변경', baseSpec: 'AZ7i: 고정식 암레스트, 힌지 개폐', newSpec: 'EV2i: 슬라이딩 암레스트(전후 80mm), 높이 조절 2단, 수납함 확대',
        diffDescription: 'EV 플랫 플로어로 콘솔 높이가 낮아지면서 암레스트를 슬라이딩+높이조절 방식으로 변경. 전후 80mm 슬라이드로 다양한 체형 대응. 수납함도 플랫 플로어 활용하여 깊이 확대.',
        designIntent: 'EV 플랫 플로어 활용 극대화. 다양한 체형 대응 편의.',
        impactArea: '슬라이드 레일 모듈 신규, 높이 조절 메커니즘, 콘솔 구조 재설계',
        coPossibility: 'low', coCondition: 'EV 플랫 플로어 전용 구조. ICE 차종 콘솔 높이와 다름.',
        additionalCost: 2.8
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.2 },
      { partName: 'Console Upper Pad (Eco)', partNo: 'EV-CN-009', isCo: false, nonCoReason: 'EV 리사이클 소재 + 민트 컬러', reasonDetail: {
        category: '디자인', baseSpec: 'AZ7i: PP 패드, 베이지', newSpec: 'EV2i: 리사이클 PET+PP 패드, 민트 그린 + 화이트 투톤',
        diffDescription: 'IP 가니쉬와 동일한 EV ESG 소재(리사이클 PET 50%)+컬러(민트) 적용. 패드 형상은 슬라이딩 암레스트 연동으로 변경.',
        designIntent: 'EV 친환경 인테리어 통일 테마.',
        impactArea: '소재 변경, 패드 금형(슬라이드 연동), 컬러 매칭',
        coPossibility: 'medium', coCondition: '리사이클 소재 표준화 시 소재 C/O. 형상은 암레스트 구조 종속.',
        additionalCost: 1.0
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.8 },
      { partName: 'Wireless Charger (Console)', partNo: 'EV-CN-010', isCo: false, nonCoReason: 'EV 전용 Qi2 65W + V2L 아웃렛', reasonDetail: {
        category: '사양변경', baseSpec: 'AZ7i: Qi 15W 무선충전', newSpec: 'EV2i: Qi2 65W 고속충전 + V2L(Vehicle to Load) 220V 아웃렛 통합, 방열 쿨링팬+히트파이프',
        diffDescription: '충전 출력 15W→65W + V2L 220V 아웃렛 통합. 방열 구조가 쿨링팬+히트파이프 조합으로 대폭 강화. V2L 아웃렛은 EV 배터리에서 외부 기기 전원 공급(캠핑 등).',
        designIntent: 'EV 라이프스타일 — 고속충전 + 캠핑/아웃도어 V2L 전원. 인도 캠핑 트렌드 대응.',
        impactArea: '충전 모듈 전면 신규, V2L 인버터 모듈, 히트파이프 방열, EMI 차폐, 안전 시험',
        coPossibility: 'none', coCondition: 'V2L은 EV 전용 기능. ICE 차종에서 구현 불가.',
        additionalCost: 6.4
      }, supplier: 'Aircharge', supplierRegion: 'UK (Import)', materialCost: 10.8 },
      { partName: 'Mode Selector Panel', partNo: 'EV-CN-011', isCo: false, nonCoReason: 'EV 전용 드라이브 모드 + 회생제동 설정 패널', reasonDetail: {
        category: '사양변경', baseSpec: 'AZ7i: Eco/Normal/Sport 3모드 토글', newSpec: 'EV2i: Eco/Normal/Sport/Snow 4모드 + 회생제동 0~3단계, 터치 슬라이더 + OLED 표시',
        diffDescription: '드라이브 모드에 Snow 모드 추가 + 회생제동 강도 4단계 터치 슬라이더 통합. OLED 패널로 현재 모드/회생 단계 시각화.',
        designIntent: 'EV 전용 에너지 관리 인터페이스. 회생제동 직관적 조절.',
        impactArea: '패널 금형 신규, 터치 슬라이더 모듈, OLED 디스플레이, ECU 연동',
        coPossibility: 'low', coCondition: '회생제동 설정은 EV 전용. 드라이브 모드만 분리하면 일부 공용 검토 가능.',
        additionalCost: 3.2
      }, supplier: 'Alps Alpine', supplierRegion: 'Pune', materialCost: 5.4 },
      { partName: 'Console Lid Hinge', partNo: 'EV-CN-012', isCo: false, nonCoReason: 'EV 슬라이딩 암레스트 연동 힌지 변경', reasonDetail: {
        category: '형상차이', baseSpec: 'AZ7i: 고정 힌지, 60°', newSpec: 'EV2i: 슬라이드 연동 힌지, 개폐 75°, 자동 리턴 댐퍼',
        diffDescription: '슬라이딩 암레스트 구조에 맞춰 힌지가 슬라이드 궤적과 간섭 없도록 재설계. 개폐 각도 60→75° 확대, 자동 리턴 댐퍼 추가.',
        designIntent: '슬라이딩 암레스트와의 구조적 간섭 방지 + 프리미엄 개폐감.',
        impactArea: '힌지 금형 신규, 댐퍼 추가, 간섭 검증',
        coPossibility: 'low', coCondition: 'EV 슬라이딩 암레스트 전용 구조.',
        additionalCost: 0.6
      }, supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
      { partName: 'Rear Climate Vent', partNo: 'EV-CN-013', isCo: false, nonCoReason: 'EV 전용 히트펌프 연동 후석 벤트', reasonDetail: {
        category: '사양변경', baseSpec: 'AZ7i: 컴프레서 공조 벤트, 냉방 전용', newSpec: 'EV2i: 히트펌프 연동, 냉/난방 겸용 벤트, 온도 디스플레이 + 풍향 자동 조절',
        diffDescription: 'EV 히트펌프 공조 시스템 연동으로 후석 벤트가 냉방+난방 겸용으로 변경. 풍향 자동 조절 모터 추가. 온도 디스플레이 패널 일체형.',
        designIntent: 'EV 히트펌프 에너지 효율 극대화 + 후석 쾌적성.',
        impactArea: '벤트 모듈 재설계, 풍향 모터 추가, 디스플레이 패널, 히트펌프 ECU 연동',
        coPossibility: 'low', coCondition: 'EV 히트펌프 전용. ICE 컴프레서 공조와 시스템 자체가 다름.',
        additionalCost: 3.4
      }, supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 5.6 },
      { partName: 'Console Charging Indicator', partNo: 'EV-CN-014', isCo: false, nonCoReason: 'EV 전용 충전 상태 LED 인디케이터', reasonDetail: {
        category: '신규사양', baseSpec: 'AZ7i: 해당 없음', newSpec: 'EV2i: RGB LED 스트립(콘솔 전면), 충전 상태 색상 표시(적→황→녹), 충전량 %',
        diffDescription: 'EV 전용 충전 상태 시각화. 콘솔 전면에 RGB LED 스트립으로 충전 진행률 및 완료를 직관적으로 표시.',
        designIntent: 'EV 충전 경험의 시각적 피드백. 실내에서 충전 상태 즉시 확인.',
        impactArea: 'LED 스트립 모듈, 콘솔 전면 개구부, BMS 연동',
        coPossibility: 'none', coCondition: 'EV 전용.',
        additionalCost: 1.2
      }, supplier: 'Hella', supplierRegion: 'Pune', materialCost: 2.0 },
    ]},
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
  code: 'TX6i', name: 'TX6i (SUV-F)', stage: '시작차', date: "'26.10", half: 'H2', type: '개발', salesVolume: 30000,
  parts: [
    { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 11, coCost: 96.8, newDevCost: 142.4, details: [
      { partName: 'IP Frame Assy', partNo: 'TX-IP-001', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 12.4 },
      { partName: 'IP Upper Pad', partNo: 'TX-IP-002', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 8.6 },
      { partName: 'IP Lower Cover', partNo: 'TX-IP-003', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.2 },
      { partName: 'Glove Box Assy', partNo: 'TX-IP-004', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 4.8 },
      { partName: 'Center Vent Assy', partNo: 'TX-IP-005', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 3.2 },
      { partName: 'Side Vent Set', partNo: 'TX-IP-006', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 4.8 },
      { partName: 'Cowl Cross Bar', partNo: 'TX-IP-007', isCo: true, coSource: 'CT5i', supplier: 'Sungwoo', supplierRegion: 'Chennai', materialCost: 8.2 },
      { partName: 'Knee Bolster', partNo: 'TX-IP-008', isCo: true, coSource: 'CT5i', supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 2.8 },
      { partName: 'Defroster Duct', partNo: 'TX-IP-009', isCo: true, coSource: 'CT5i', supplier: 'Valeo', supplierRegion: 'Chennai', materialCost: 1.8 },
      { partName: 'Fuse Box Cover', partNo: 'TX-IP-010', isCo: true, coSource: 'CT5i', supplier: 'Minda', supplierRegion: 'Pune', materialCost: 1.2 },
      { partName: 'Hood Latch Cable', partNo: 'TX-IP-011', isCo: true, coSource: 'CT5i', supplier: 'Hi-Lex', supplierRegion: 'Gurgaon', materialCost: 1.4 },
      { partName: 'Cluster Hood', partNo: 'TX-IP-012', isCo: false, nonCoReason: '플래그십 12.3" 풀디지털 + HUD 개구부 추가', reasonDetail: {
        category: '사양변경', baseSpec: 'CT5i: 10.25" 부분 디지털, HUD 미적용', newSpec: 'TX6i: 12.3" 풀디지털 + 윈드실드 HUD 프로젝션 개구부(W 180 × H 40mm), 후드 상면 HUD 반사 방지 코팅',
        diffDescription: '플래그십 SUV로 12.3" 풀디지털 클러스터 + HUD(Head-Up Display) 동시 적용. 후드 상면에 HUD 프로젝션 개구부가 추가되어 금형 구조 전면 재설계. HUD 반사 방지를 위한 특수 코팅(반무광) 적용.',
        designIntent: '플래그십 SUV 프리미엄 HMI. HUD로 시선 이동 최소화 안전 운전 지원.',
        impactArea: '후드 금형 신규(HUD 개구부), HUD 반사 코팅 공정, HUD 프로젝터 마운트, 광학 검증',
        coPossibility: 'low', coCondition: 'NX8에서 동일 HUD 적용 시 후드 구조 공용 검토 가능. 현재 NX8는 HUD 미적용.',
        additionalCost: 4.6
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 7.8 },
      { partName: 'Center Fascia Panel', partNo: 'TX-IP-013', isCo: false, nonCoReason: '12.3" AVN + 공조 물리다이얼 유지형 파시아', reasonDetail: {
        category: '사양변경', baseSpec: 'CT5i: 10.25" AVN, 물리 다이얼 3개', newSpec: 'TX6i: 12.3" AVN, 물리 다이얼 2개 + 터치 4개, 크롬 다이얼 링, 파시아 W 290 × H 178mm',
        diffDescription: '디스플레이 12.3"로 확대. 다만 플래그십은 물리 다이얼 완전 제거 대신 고급감 있는 크롬 다이얼 2개를 유지하면서 터치 병행. 파시아 폭/높이 모두 확대.',
        designIntent: '플래그십 SUV "하이브리드 조작계" — 물리+터치 병행으로 고급감+편의 동시 확보.',
        impactArea: '파시아 금형 신규, 크롬 다이얼 금형, 터치 PCB, EMC 시험',
        coPossibility: 'medium', coCondition: 'NX8에서 12.3" AVN 동일 적용 확정 시 파시아 상단부 공용 가능. 하단부 다이얼 유무에 따라 분리 설계.',
        additionalCost: 3.4
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 6.2 },
      { partName: 'IP Garnish Set', partNo: 'TX-IP-014', isCo: false, nonCoReason: '플래그십 전용 리얼 알루미늄 인서트 가니쉬', reasonDetail: {
        category: '디자인', baseSpec: 'CT5i: PP 사출, 다크그레이 그레인', newSpec: 'TX6i: PP + 리얼 알루미늄 인서트(헤어라인 가공), 블랙+실버 투톤',
        diffDescription: '플래그십 프리미엄 감성을 위해 가니쉬에 리얼 알루미늄 인서트 적용. 기존 PP 단색→PP+알루미늄 인서트 이중 사출/접합. 헤어라인 가공으로 고급 금속 질감.',
        designIntent: '플래그십 SUV 인테리어 소재 프리미엄화. 경쟁차(Fortuner, Gloster) 대비 소재 차별화.',
        impactArea: '알루미늄 인서트 가공+아노다이징, 이중 사출 금형 변경, 열팽창 계수 차이 검증',
        coPossibility: 'medium', coCondition: '가니쉬 외곽 형상 CT5i 동일 유지 시 "금형 C/O + 인서트 별도" 방식 가능. 인서트 표준 사이즈화.',
        additionalCost: 2.8
      }, supplier: 'Motherson', supplierRegion: 'Chennai', materialCost: 5.4 },
      { partName: 'PAB Door', partNo: 'TX-IP-015', isCo: false, nonCoReason: 'SUV-F 대형 차체에 따른 PAB 대형화 (법규)', reasonDetail: {
        category: '법규', baseSpec: 'CT5i: PAB 48°, 티어 라인 W 280mm', newSpec: 'TX6i: PAB 50°(+2°), 티어 라인 W 300mm(+20mm), 3열 승객 보호 확대',
        diffDescription: '대형 SUV-F 차체에 맞춰 PAB 전개량 확대. 3열 승객 존재에 따른 정면 충돌 안전 강화. 티어 라인 20mm 확대.',
        designIntent: 'BNVSAP/GNCAP 플래그십 안전 등급 확보. 3열 차량 정면 충돌 필수 대응.',
        impactArea: '에어백 도어 금형 신규, 충돌 시험(3열 탑승 조건 추가)',
        coPossibility: 'low', coCondition: '대형 SUV/MPV 간 PAB 규격 통일 가능성 검토 필요. NX8과 차체 폭 유사 시 공용 가능.',
        additionalCost: 2.6
      }, supplier: 'Autoliv', supplierRegion: 'Bangalore', materialCost: 5.4 },
      { partName: 'Speaker Grille (IP) Premium', partNo: 'TX-IP-016', isCo: false, nonCoReason: '플래그십 전용 프리미엄 사운드 그릴 (BOSE)', reasonDetail: {
        category: '사양변경', baseSpec: 'CT5i: 일반 2구 스피커 그릴, ABS 사출', newSpec: 'TX6i: BOSE 프리미엄 3구 그릴 + 트위터 마운트, 알루미늄 메쉬, 로고 각인',
        diffDescription: '플래그십 BOSE 프리미엄 사운드 패키지에 맞춰 IP 센터 스피커 그릴이 일반→프리미엄(알루미늄 메쉬+BOSE 로고)으로 변경. 트위터 별도 마운트 추가.',
        designIntent: '플래그십 프리미엄 사운드 경험. BOSE 브랜딩으로 고급감.',
        impactArea: '알루미늄 메쉬 가공, BOSE 로고 레이저 각인, 트위터 마운트 추가',
        coPossibility: 'low', coCondition: '플래그십 전용 BOSE 패키지. 일반 차종에는 오버스펙.',
        additionalCost: 1.8
      }, supplier: 'Harman/BOSE', supplierRegion: 'Pune', materialCost: 3.6 },
      { partName: 'HUD Projector Cover', partNo: 'TX-IP-017', isCo: false, nonCoReason: '플래그십 전용 HUD 프로젝터 커버 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: HUD 미적용, 해당 부품 없음', newSpec: 'TX6i: HUD 프로젝터 커버(전동 슬라이드), W 190 × H 55mm, 개폐 모터 1ea',
        diffDescription: 'HUD 프로젝터 보호를 위한 전동 슬라이드 커버 신규. 시동 ON 시 자동 개방, OFF 시 자동 폐쇄. IP 상면에 매립.',
        designIntent: 'HUD 프로젝터 보호 + 프리미엄 연출(전동 개폐).',
        impactArea: '슬라이드 커버 금형, 모터 모듈, IP 상면 매립 구조',
        coPossibility: 'low', coCondition: 'HUD 적용 차종에서만 필요. 현재 TX6i만 HUD 적용.',
        additionalCost: 1.4
      }, supplier: 'Continental', supplierRegion: 'Bangalore', materialCost: 2.8 },
      { partName: 'Ambient Light Bar (IP)', partNo: 'TX-IP-018', isCo: false, nonCoReason: '플래그십 IP 전체 앰비언트 라이트 바 신규', reasonDetail: {
        category: '신규사양', baseSpec: 'CT5i: IP 앰비언트 라이트 미적용', newSpec: 'TX6i: 128색 LED 앰비언트 바, IP 전폭 도광판 L 1200mm, 음악 연동+HUD 색상 연동',
        diffDescription: '플래그십 프리미엄 실내 조명. IP 전폭에 걸쳐 128색 앰비언트 라이트 바 신규. 도어 앰비언트와 연동하여 실내 전체 조명 통합 제어.',
        designIntent: '플래그십 프리미엄 실내 경험. IP~도어 조명 통합으로 몰입적 분위기.',
        impactArea: 'IP 전폭 도광판 홈 가공, LED 모듈 다수, 바디 ECU 연동',
        coPossibility: 'medium', coCondition: 'LED 모듈+도광판 규격 표준화하면 NX8/DX4i 확대 가능. IP 홈 가공만 차종별.',
        additionalCost: 3.8
      }, supplier: 'Hella', supplierRegion: 'Pune', materialCost: 6.2 },
    ]},
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
  code: 'NX8', name: 'NX8 (MPV-G)', stage: '모델선정', date: "'28.8", half: 'H2', type: '개발', salesVolume: 45000,
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

/* ═══ Auto-populate systemPartNo & coPartNo from existing data ═══ */
const PREFIX: Record<string, string> = {
  VN3: 'VN', CT5i: 'CT', AZ7i: 'AZ', NX8: 'NX', DX4i: 'DX', EV2i: 'EV', TX6i: 'TX',
}
const SYS_ABBR: Record<string, string> = {
  'IP (Crash Pad)': 'IP', Console: 'CN', 'Door Trim': 'DT',
  'Door Trim (Fr)': 'DF', 'Door Trim (Rr)': 'DR',
  'Seat (Fr/Rr)': 'ST', 'Seat (Fr)': 'SF', 'Seat (Rr)': 'RS',
  'HVAC / Air Vent': 'HV', Headliner: 'HL', 'Pillar Trim': 'PT',
  'Steering Wheel': 'SW', 'Carpet / Floor': 'CF',
  'Garnish / Molding': 'GM', 'Package Tray': 'PK',
  'Battery Cover': 'BC', 'Sunroof (PGS)': 'SR',
}
for (const v of vehicles) {
  for (const p of v.parts) {
    if (p.baseVehicle !== '-') {
      const bp = PREFIX[p.baseVehicle] ?? p.baseVehicle.slice(0, 2)
      const sa = SYS_ABBR[p.system] ?? p.system.slice(0, 2).toUpperCase()
      p.systemPartNo = `${bp}-${sa}-MOD`
    }
    if (!p.details) continue
    for (const sub of p.details) {
      if (sub.isCo && sub.coSource) {
        const sp = PREFIX[sub.coSource] ?? sub.coSource.slice(0, 2)
        sub.coPartNo = sub.partNo.replace(/^[A-Z]{2}/, sp)
      }
    }
  }
}
