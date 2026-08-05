(function () {
  "use strict";

  function initAudioTrap() {
    // Check session để popup chỉ xuất hiện 1 lần duy nhất
    if (sessionStorage.getItem("audioTrapSeen")) return;

    var overlay = document.createElement("div");
    overlay.id = "audio-trap-overlay";
    
    // Đã thay thế mũi tên bằng một khối Logo ở ngay trung tâm Terminal
    overlay.innerHTML =
      '<div class="audio-trap-terminal">' +
      '  <div class="audio-trap-logo">' +
      '    <span class="logo-bracket">[</span>' +
      '    <span class="logo-icon">&#9654;</span>' +
      '    <span class="logo-bracket">]</span>' +
      '  </div>' +
      '  <h2>[ NEURO-SYNC PROTOCOL INITIATED ]</h2>' +
      '  <p>> <strong>System Alert:</strong> Deep-state cognitive focus is required for optimal breach protocols.</p>' +
      '  <p>> Background auditory stimulation is standing by...</p>' +
      '  <p style="color: var(--md-accent-fg-color, #c9a96e); margin-top: 25px; font-weight: bold;">' +
      '    > CLICK ANYWHERE TO EXECUTE OVERRIDE <span class="blinking-cursor"></span>' +
      '  </p>' +
      '</div>';

    document.body.appendChild(overlay);

    overlay.addEventListener("click", function() {
      // 1. Tắt lớp sương mù
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      sessionStorage.setItem("audioTrapSeen", "true");
      
      // 2. Xóa HTML khỏi DOM
      setTimeout(function() {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 400);
    });
  }

  // Khởi chạy khi tải trang
  document.addEventListener("DOMContentLoaded", initAudioTrap);
})();