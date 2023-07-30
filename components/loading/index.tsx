import "./loading-style.css";

type LoadingType = {
  text?: string
  className?: string
}

export function Loading({ text, className }: LoadingType) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
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
