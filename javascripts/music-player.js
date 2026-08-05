(function () {
  "use strict";

  var LOCAL_TRACKS = [
    { title: "[SYS_AUDIO_01]", src: "/assets/audio/lofi-1.mp3" },
  ];

  var YOUTUBE_TRACKS = [
    { title: "[NET_STREAM_01]", videoId: "lw6GgjJ8guw" }
  ];

  /* 1. ĐỔI MẶC ĐỊNH SANG YOUTUBE (Bỏ qua Local) */
  var DEFAULT_SOURCE = "youtube";

  var state = {
    source: DEFAULT_SOURCE,
    index: 0,
    playing: false,
    ytPlayer: null,
    ytReady: false,
    autoplayAttempted: false,
    isDraggingProgress: false 
  };

  var ytProgressTimer = null;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function buildUI() {
    var wrap = document.createElement("div");
    wrap.id = "floating-player";
    wrap.innerHTML =
      '<div class="fp-box">' +
      '  <div class="fp-toggle" id="fp-toggle" title="Kéo để di chuyển / Click để mở">[&#9654;]</div>' +
      '  <div class="fp-panel fp-collapsed" id="fp-panel">' +
      '    <div class="fp-track" id="fp-track">[STANDBY]</div>' +
      
      '    <div class="fp-progress-group">' +
      '      <span id="fp-time-current">[0:00]</span>' +
      '      <input id="fp-progress" type="range" min="0" max="100" value="0" step="0.1">' +
      '      <span id="fp-time-total">[0:00]</span>' +
      '    </div>' +
      
      '    <div class="fp-controls">' +
      '      <button id="fp-prev" title="Bài trước">&#9198;</button>' +
      '      <button id="fp-play" title="Play/Pause">&#9654;</button>' +
      '      <button id="fp-next" title="Bài sau">&#9197;</button>' +
      '    </div>' +
      
      '    <div class="fp-volume-group">' +
      '      <span style="font-weight: bold;">[VOL]</span>' +
      '      <input id="fp-volume" type="range" min="0" max="100" value="40" title="Âm lượng">' +
      '    </div>' +
      
      /* 2. ĐÃ XÓA (ẨN) GIAO DIỆN CHUYỂN ĐỔI LOCAL/YOUTUBE */
      // '    <div class="fp-source">' +
      // '      <label><input type="radio" name="fp-src" value="local" checked> [LOCAL_DB]</label>' +
      // '      <label><input type="radio" name="fp-src" value="youtube"> [NET_STREAM]</label>' +
      // '    </div>' +
      
      /* 3. HIỂN THỊ LUÔN Ô NHẬP LINK YOUTUBE (Đổi display:none thành display:flex) */
      '    <div class="fp-yt-input" id="fp-yt-input-group" style="display:flex;">' +
      '      <input type="text" id="fp-yt-link" placeholder="Dán link hoặc ID YouTube" autocomplete="off">' +
      '      <button id="fp-yt-load">Phát</button>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div id="fp-yt-container"></div>';
    
    document.body.appendChild(wrap);
    bindEvents(wrap);
    makeDraggable(wrap);
  }

  function bindEvents(wrap) {
    document.getElementById("fp-play").addEventListener("click", togglePlay);
    document.getElementById("fp-next").addEventListener("click", function () { changeTrack(1); });
    document.getElementById("fp-prev").addEventListener("click", function () { changeTrack(-1); });
    document.getElementById("fp-volume").addEventListener("input", function (e) { setVolume(e.target.value); });
    
    var pBar = document.getElementById("fp-progress");
    
    pBar.addEventListener("input", function(e) {
      state.isDraggingProgress = true;
      var percent = e.target.value / 100;
      var dur = 0;
      if (state.source === "local" && audioEl) dur = audioEl.duration;
      if (state.source === "youtube" && state.ytPlayer && state.ytPlayer.getDuration) dur = state.ytPlayer.getDuration();
      if (!isNaN(dur)) {
        document.getElementById("fp-time-current").textContent = "[" + formatTime(percent * dur) + "]";
      }
    });

    pBar.addEventListener("change", function(e) {
      state.isDraggingProgress = false;
      var percent = e.target.value / 100;
      if (state.source === "local" && audioEl) {
        var newTime = percent * audioEl.duration;
        if (!isNaN(newTime)) audioEl.currentTime = newTime;
      } else if (state.source === "youtube" && state.ytPlayer && state.ytPlayer.seekTo) {
        var newTime = percent * state.ytPlayer.getDuration();
        if (!isNaN(newTime)) state.ytPlayer.seekTo(newTime, true);
      }
    });

    /* 4. ĐÃ TẮT SỰ KIỆN CLICK VÀO NÚT RADIO BỊ ẨN */
    // var radios = document.getElementsByName("fp-src");
    // for (var i = 0; i < radios.length; i++) {
    //   radios[i].addEventListener("change", function (e) {
    //     var isYt = e.target.value === "youtube";
    //     document.getElementById("fp-yt-input-group").style.display = isYt ? "flex" : "none";
    //     switchSource(e.target.value);
    //   });
    // }

    document.getElementById("fp-yt-load").addEventListener("click", function() {
      var inputVal = document.getElementById("fp-yt-link").value.trim();
      if(!inputVal) return;
      
      var match = inputVal.match(/(?:v=|youtu\.be\/|embed\/|^)([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        var safeId = match[1];
        YOUTUBE_TRACKS.push({ title: "[CUSTOM_STREAM]", videoId: safeId });
        state.index = YOUTUBE_TRACKS.length - 1;
        updateTrackLabel();
        playYouTube();
        document.getElementById("fp-yt-link").value = "";
      } else {
        alert("Link/ID YouTube không hợp lệ!");
      }
    });

    document.addEventListener("click", function initAutoplay() {
      if (!state.autoplayAttempted) {
        state.autoplayAttempted = true;
        if (!state.playing) togglePlay();
        document.removeEventListener("click", initAutoplay);
      }
    }, { once: true });
  }

  function updateProgressUI(current, total) {
    if (state.isDraggingProgress) return; 
    var pBar = document.getElementById("fp-progress");
    var tCurr = document.getElementById("fp-time-current");
    var tTot = document.getElementById("fp-time-total");

    if (total > 0 && !isNaN(total)) {
      pBar.value = (current / total) * 100;
      tTot.textContent = "[" + formatTime(total) + "]";
    } else {
      pBar.value = 0;
      tTot.textContent = "[0:00]";
    }
    tCurr.textContent = "[" + formatTime(current) + "]";
  }

  function startYtProgress() {
    if (ytProgressTimer) clearInterval(ytProgressTimer);
    ytProgressTimer = setInterval(function() {
      if (state.ytPlayer && state.ytPlayer.getCurrentTime) {
        updateProgressUI(state.ytPlayer.getCurrentTime(), state.ytPlayer.getDuration());
      }
    }, 500);
  }

  function stopYtProgress() {
    if (ytProgressTimer) clearInterval(ytProgressTimer);
  }

  function makeDraggable(wrap) {
    var toggle = document.getElementById("fp-toggle");
    var panel = document.getElementById("fp-panel");
    var isDragging = false;
    var hasMoved = false;
    var startX, startY, initialX, initialY;

    function dragStart(e) {
      if (e.type === "touchstart") e = e.touches[0];
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      initialX = wrap.offsetLeft;
      initialY = wrap.offsetTop;
    }

    function dragMove(e) {
      if (!isDragging) return;
      var clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      var clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
      
      var dx = clientX - startX;
      var dy = clientY - startY;
      
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
        wrap.style.left = (initialX + dx) + "px";
        wrap.style.top = (initialY + dy) + "px";
        wrap.style.bottom = "auto"; 
      }
    }

    function dragEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      if (!hasMoved) panel.classList.toggle("fp-collapsed");
    }

    toggle.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
    
    toggle.addEventListener("touchstart", dragStart, {passive: true});
    document.addEventListener("touchmove", dragMove, {passive: true});
    document.addEventListener("touchend", dragEnd);
  }

  var audioEl = null;
  function getAudioEl() {
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.addEventListener("ended", function () { changeTrack(1); });
      
      audioEl.addEventListener("timeupdate", function() {
        updateProgressUI(audioEl.currentTime, audioEl.duration);
      });
      audioEl.addEventListener("loadedmetadata", function() {
        updateProgressUI(audioEl.currentTime, audioEl.duration);
      });
    }
    return audioEl;
  }

  function currentList() {
    return state.source === "local" ? LOCAL_TRACKS : YOUTUBE_TRACKS;
  }

  function updateTrackLabel() {
    var list = currentList();
    var t = list[state.index];
    document.getElementById("fp-track").textContent = t ? t.title : "[NO_DATA]";
  }

  function playLocal() {
    var list = LOCAL_TRACKS;
    if (!list.length) return;
    var a = getAudioEl();
    a.src = list[state.index].src;
    a.volume = document.getElementById("fp-volume").value / 100;
    a.play().then(function() {
      state.playing = true;
      updatePlayIcon();
    }).catch(function(err) {
      console.warn("Autoplay bị chặn bởi trình duyệt, cần click để phát.");
    });
  }

  function pauseLocal() {
    if (audioEl) audioEl.pause();
    state.playing = false;
    updatePlayIcon();
  }

  function ensureYouTube(callback) {
    if (window.YT && window.YT.Player) { callback(); return; }
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = callback;
  }

  function playYouTube() {
    var list = YOUTUBE_TRACKS;
    if (!list.length) return;
    ensureYouTube(function () {
      var vid = list[state.index].videoId;
      if (!state.ytPlayer) {
        state.ytPlayer = new YT.Player("fp-yt-container", {
          height: "1", width: "1", videoId: vid,
          playerVars: { autoplay: 1, controls: 0 },
          events: {
            onReady: function (e) {
              e.target.setVolume(document.getElementById("fp-volume").value);
              e.target.playVideo();
              state.playing = true;
              updatePlayIcon();
            },
            onStateChange: function (e) {
              if (e.data === YT.PlayerState.PLAYING) startYtProgress();
              else stopYtProgress();
              
              if (e.data === YT.PlayerState.ENDED) changeTrack(1);
            }
          }
        });
      } else {
        state.ytPlayer.loadVideoById(vid);
        state.playing = true;
        updatePlayIcon();
        startYtProgress();
      }
    });
  }

  function pauseYouTube() {
    if (state.ytPlayer && state.ytPlayer.pauseVideo) state.ytPlayer.pauseVideo();
    state.playing = false;
    updatePlayIcon();
    stopYtProgress();
  }

  function togglePlay() {
    if (state.playing) {
      state.source === "local" ? pauseLocal() : pauseYouTube();
    } else {
      state.source === "local" ? playLocal() : playYouTube();
    }
  }

  function changeTrack(delta) {
    var list = currentList();
    if (!list.length) return;
    state.index = (state.index + delta + list.length) % list.length;
    
    updateProgressUI(0, 0); 
    
    updateTrackLabel();
    if (state.playing) {
      state.source === "local" ? playLocal() : playYouTube();
    }
  }

  function switchSource(src) {
    pauseLocal();
    pauseYouTube();
    state.source = src;
    state.index = 0;
    updateProgressUI(0, 0);
    updateTrackLabel();
  }

  function setVolume(v) {
    if (state.source === "local" && audioEl) audioEl.volume = v / 100;
    if (state.source === "youtube" && state.ytPlayer && state.ytPlayer.setVolume) state.ytPlayer.setVolume(v);
  }

  function updatePlayIcon() {
    var btn = document.getElementById("fp-play");
    if (btn) btn.innerHTML = state.playing ? "&#9724;" : "&#9654;";
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildUI();
    updateTrackLabel();
    
    setTimeout(function() {
      if(!state.playing) togglePlay();
    }, 500);
  });
})();