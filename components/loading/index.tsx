import "./loading-style.css";

export function Loading({ text }) {
  return (
    <div className="loading__container">
      {text && <span>{text}</span>}
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
