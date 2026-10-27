"use client";

import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";
import { FiX } from "react-icons/fi";

import { Button } from "@/components/ui/button";

type DialogProps = {
  children: ReactNode;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function Dialog({
  children,
  description,
  onClose,
  open,
  title,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className="cs-dialog"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      {open ? (
        <div className="relative p-6">
          <div className="mb-5 pr-10">
            <h2
              className="text-lg font-semibold tracking-tight text-foreground"
              id={titleId}
            >
              {title}
            </h2>

            {description ? (
              <p
                className="mt-1 text-sm leading-6 text-muted"
                id={descriptionId}
              >
                {description}
              </p>
            ) : null}
          </div>

          {children}

          <Button
            aria-label="Close dialog"
            className="absolute right-4 top-4"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <FiX aria-hidden="true" size={18} />
          </Button>
        </div>
      ) : null}
    </dialog>
  );
}