import "./reading-style.css";

interface ReadingProps {
  text?: string;
  children?: React.ReactNode;
}

export function Reading({ text, children }: ReadingProps) {
  return (
    <div className="reading__container">
      {text && <span className="reading__text font-bold">{text}</span>}
      <div className="reading__dots">
        <div className="dot-flashing">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
      {children}
    </div>
  );
}
