(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '메뉴 열기');
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      nav.classList.toggle('open', open);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 650) closeMenu();
    });
  }

  const closeSurveyButton = document.querySelector('#close-survey');
  if (closeSurveyButton) {
    closeSurveyButton.addEventListener('click', () => {
      if (window.opener) window.close();
      else window.location.href = 'index.html';
    });
  }

  const popupFallback = document.querySelector('#popup-fallback');
  if (popupFallback) {
    try {
      const surveyWindow = window.open(
        new URL('survey.html', document.baseURI).href,
        'rightsHelpSurvey',
        'popup=yes,width=760,height=900,resizable=yes,scrollbars=yes'
      );
      if (surveyWindow && !surveyWindow.closed) surveyWindow.focus();
      else popupFallback.hidden = false;
    } catch (error) {
      popupFallback.hidden = false;
    }
  }

  const helpForm = document.querySelector('#help-check-form');
  const helpResult = document.querySelector('#help-result');
  if (!helpForm || !helpResult) return;

  const routeCard = (title, description, label, href) => `
    <div class="result-route">
      <h4>${title}</h4>
      <p>${description}</p>
      <a href="${href}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>
    </div>`;

  helpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const situations = [...helpForm.querySelectorAll('input[name="situation"]:checked')].map((input) => input.value);
    const needs = [...helpForm.querySelectorAll('input[name="need"]:checked')].map((input) => input.value);
    const specificSituations = situations.filter((value) => value !== 'policy' && value !== 'unsure');
    const onlyUnsure = situations.includes('unsure') && situations.every((value) => value === 'unsure');
    const routes = [];

    if (specificSituations.length || needs.includes('case') || onlyUnsure || situations.length === 0) {
      let description = '인권침해나 차별이 위원회 조사 대상인지 상담으로 먼저 확인할 수 있습니다. 진정은 본인뿐 아니라 피해 사실을 아는 사람도 제기할 수 있습니다.';
      if (situations.includes('military')) description = '군 복무 중 인권침해는 군인권보호관 관련 상담·진정 안내를 확인해 보세요. 사안과 시기에 따라 적용되는 절차가 다를 수 있습니다.';
      if (onlyUnsure || situations.length === 0) description = '상황을 짧게 설명하고 어디에 문의하면 좋을지 안내받을 수 있습니다. 아직 진정할지 정하지 않아도 상담부터 시작할 수 있어요.';
      const caseLabel = situations.includes('military') ? '군인권보호관 안내 보기' : '진정·상담 안내 보기';
      const caseHref = situations.includes('military')
        ? 'https://humanrights.go.kr/html/military/index.html'
        : 'https://case.humanrights.go.kr/mdatStep/regStep02.do';
      routes.push(routeCard('사건 상담·진정 가능성 확인', description, caseLabel, caseHref));
    }

    if (situations.includes('policy') || needs.includes('policy')) {
      routes.push(routeCard('제도·정책 개선 의견 살펴보기', '법령·제도·정책·관행의 인권 측면을 검토하고 개선 권고나 의견을 제시하는 것이 위원회의 역할입니다. 의견 제출 방법과 대상은 공식 안내에서 확인해 주세요.', '위원회 기능·공식 안내 보기', 'https://humanrights.go.kr/base/contents/view?contentsNo=4&menuLevel=3&menuNo=99'));
    }

    if (needs.includes('learn')) {
      routes.push(routeCard('인권교육과 자료 찾아보기', '인권을 더 알아보고 싶다면 교육과정과 교육 자료를 이용할 수 있습니다.', '인권교육센터 열기', 'https://edu.humanrights.go.kr/'));
    }

    if (!routes.length) {
      routes.push(routeCard('상담으로 다음 단계 확인하기', '사안에 따라 담당 기관과 해결 절차가 달라질 수 있습니다. 인권위가 다루는 문제인지부터 편하게 문의해 보세요.', '1331 상담·진정 안내 보기', 'https://humanrights.go.kr/base/contents/view?contentsNo=51&menuLevel=2&menuNo=80'));
    }

    const resultTitle = onlyUnsure || situations.length === 0
      ? '먼저 상담으로 길을 찾아보세요'
      : '선택하신 내용에 가까운 안내입니다';
    helpResult.innerHTML = `
      <span class="result-eyebrow">YOUR NEXT STEP</span>
      <h3>${resultTitle}</h3>
      <p>아래 안내를 출발점으로 삼아 보세요. 최종적으로 조사·접수가 가능한지는 구체적인 사실과 법령에 따라 달라집니다.</p>
      <div class="result-routes">${routes.join('')}</div>
      <p class="result-limit">즉각적인 위험이나 긴급한 보호가 필요한 경우에는 이 설문에 의존하지 말고 112 또는 119 등 긴급 신고·구조 창구에 먼저 연락하세요. 이 설문은 답변을 저장하거나 전송하지 않습니다.</p>`;
    helpResult.hidden = false;
    helpResult.focus();
  });

  helpForm.addEventListener('change', () => {
    helpResult.hidden = true;
    helpResult.replaceChildren();
  });
})();
