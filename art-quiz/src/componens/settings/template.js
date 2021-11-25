export const template = `<div>
<div>
  <label>
  SOUND
  <input type = "checkbox" checked id="sounds"></input>
  </label>
  <input type="range" min = '0', max = '1', step = '0.01' id="volume" >
  </div>
  <div>
    <label>
      TIMER
      <input type="checkbox" checked id="timer"></input>
    </label>
    <input type="number" min="5" max="30" value="30" id="timing" step='5'></input>
  </div>
</div>`;