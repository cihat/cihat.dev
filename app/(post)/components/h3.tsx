import { withHeadingId } from "./utils";

export function H3({ children }) {
  return (
    <h3 className="group font-bold text-lg mb-2 mt-4 relative">
      {withHeadingId(children)}
    </h3>
  );
}
