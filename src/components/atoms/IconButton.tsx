import { IconButtonProps } from "@/src/types/button";
import { forwardRef } from "react";

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, "aria-label": ariaLabel, ...props }, ref) => {
    return (
      <button ref={ref} type="button" aria-label={ariaLabel} {...props}>
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
