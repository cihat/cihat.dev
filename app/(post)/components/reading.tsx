import "./reading-style.css";

export function Reading({ children }) {
  return (
    <div className="reading__container">
      <span>Reading</span>
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
