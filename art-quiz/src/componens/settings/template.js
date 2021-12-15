export const template = `<div>
<div class="settings-container">
  <label class="form-check-label" for="sounds">
  SOUND
  <input type="checkbox" checked id="sounds" class="form-check-input">
  </label>
  <label for="customRange1" class="form-label">
  <input type="range" min = '0', max = '1', step = '0.01' id="volume" class="form-range" id="customRange1">
  </label>
  </div>
  <div class="settings-container">
    <label for="timer" class="form-check-label">
      TIMER
      <input type="checkbox" checked id="timer" class="form-check-input">
    </label>
    <input type="number" min="5" max="30" value="30" id="timing" step='5' class="form-control">
  </div>
</div>`;
