(function () {
  const cfg = (window.appConfig && typeof window.appConfig.read === "function")
    ? window.appConfig.read() : {};

  const title = cfg.TITLE || "대시보드 러너 · 스프린트 3 (오프라인)";
  const header = cfg.HEADER || "대시보드 러너";
  const sub = cfg.SUB || "스프린트 3 · 사전빌드(Prebuild) · 로컬 에셋만 사용";
  const btn = cfg.BTN || "확인";

  document.title = title;

  const el = document.getElementById("app");
  const info = [
    ["앱", "대시보드 러너 (스프린트 3, 사전빌드)"],
    ["실행 모드", "Electron 오프라인 (원격 CDN 없음)"],
    ["보안", "강한 CSP + 원격/인라인 차단 + 렌더러에서 Node 비활성화"]
  ];

  el.innerHTML = `
    <div class="card">
      <h2 style="margin-top:0">${header}에 오신 것을 환영합니다 👋</h2>
      <p class="muted">${sub}</p>
      <ul>${info.map(([k,v]) => `<li><b>${k}</b>: ${v}</li>`).join("")}</ul>
      <button class="btn" id="btn-ok">${btn}</button>
    </div>
  `;

  const h1 = document.querySelector("h1");
  if (h1) h1.textContent = header;
  const muted = document.querySelector(".muted");
  if (muted) muted.textContent = sub;

  document.getElementById("btn-ok").addEventListener("click", () => {
    console.log("[renderer] 확인 버튼 클릭");
    alert("준비 완료!");
  });
})();
