import "./reading-style.css";

export function Reading({ text, children }) {
  return (
    <div className="reading__container">
      {text && <span className="font-bold">{text}</span>}
      <div className="col-3">
        <div className="snippet" data-title="dot-flashing">
          <div className="stage">
            <div className="dot-flashing">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
