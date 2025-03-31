"use client";

import YT from "react-youtube";

export function YouTube(props: any) {
  return (
    <div className="block my-5 overflow-scroll">
      <YT {...props} opts={{ width: "100%", ...props.opts }} />
    </div>
  );
}
