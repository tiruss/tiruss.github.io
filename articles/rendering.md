---
title: Rendering
date: 2026-07-06
excerpt: An example post showing how to write articles in Markdown — with code and LaTeX math.
---

**Rendering의 원리: 컴퓨터 그래픽스에서 이미지가 만들어지는 과정**

본 글에서는 Rendering의 수학적 원리를 쉽게 풀어서 설명하고, 실무에서 중요한 Rasterization과 Ray Tracing 기법을 중점적으로 다루겠습니다.

### 1. Rendering Equation — 빛의 이동을 수학으로 표현하기

Rendering의 가장 중요한 이론은 **Rendering Equation**입니다. 쉽게 말하면 “한 점에서 나가는 빛 = 스스로 내는 빛 + 주변에서 들어오는 빛이 반사된 양”으로 요약됩니다.

수식으로는 다음과 같이 표현됩니다:

\[
L_o(p, \omega_o) = L_e(p, \omega_o) + \int_{\Omega} f_r(p, \omega_i, \omega_o) \, L_i(p, \omega_i) \, (\omega_i \cdot n) \, d\omega_i
\]

**각 항을 쉽게 풀어서 설명하면:**

- \(L_o(p, \omega_o)\): **최종적으로 우리가 보는 빛** (위치 \(p\)에서 방향 \(\omega_o\)으로 나가는 빛의 밝기)
- \(L_e(p, \omega_o)\): **물체가 스스로 내는 빛** (형광등, 불꽃 같은 emissive 재질)
- \(\int_{\Omega} \cdots d\omega_i\): **주변 모든 방향에서 들어오는 빛을 전부 더하는 적분**
  - \(f_r(p, \omega_i, \omega_o)\): **재질이 빛을 어떻게 반사하는지** 결정하는 BRDF 함수 (거울처럼 완전히 반사할지, 종이처럼 퍼뜨릴지 등)
  - \(L_i(p, \omega_i)\): **그 방향에서 들어오는 빛**의 양
  - \((\omega_i \cdot n)\): **빛이 들어오는 각도에 따른 밝기 보정** (빛이 정면으로 오면 밝고, 비스듬히 오면 어두워짐. 코사인 법칙)
