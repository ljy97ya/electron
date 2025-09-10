(function() {
  const el = document.getElementById('app');
  const info = [
    ['앱', '대시보드 러너 (스프린트 3, 사전빌드)'],
    ['실행 모드', 'Electron 오프라인 (원격 CDN 없음)'],
    ['보안', '강한 CSP + 원격/인라인 차단 + 렌더러에서 Node 비활성화'],
  ];
  el.innerHTML = `
    <div class="card">
      <h2 style="margin-top:0">환영합니다 👋</h2>
      <p class="muted">렌더러가 로컬 자산만으로 안전하게 실행 중입니다.</p>
      <ul>${info.map(([k,v]) => `<li><b>${k}</b>: ${v}</li>`).join('')}</ul>
      <button class="btn" id="btn-ok">확인</button>
    </div>
  `;
  document.getElementById('btn-ok').addEventListener('click', () => {
    console.log('[renderer] 확인 버튼 클릭');
    alert('준비 완료!');
  });
})();
