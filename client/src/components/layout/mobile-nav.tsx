"use client";

import { useEffect, useRef } from "react";
import { FiLogOut, FiX } from "react-icons/fi";

import { Brand } from "@/components/layout/brand";
import { NavLinks } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type MobileNavProps = {
  activeWorkspaceId: string | null;
  initials: string;
  logoutPending: boolean;
  onClose: () => void;
  onLogout: () => void;
  open: boolean;
  userName: string;
  workspaceName?: string;
};

export function MobileNav({
  activeWorkspaceId,
  initials,
  logoutPending,
  onClose,
  onLogout,
  open,
  userName,
  workspaceName,
}: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Native dialog provides modal focus handling and Escape-to-close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Close the drawer if the viewport changes to desktop size.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, [onClose]);

  return (
    <dialog
      aria-label="Navigation"
      className="cs-drawer md:hidden"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      <div className="flex h-full flex-col border-r border-border bg-surface">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <Brand onClick={onClose} />

          <Button
            aria-label="Close navigation"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <FiX aria-hidden="true" size={18} />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavLinks
            activeWorkspaceId={activeWorkspaceId}
            onNavigate={onClose}
            workspaceName={workspaceName}
          />
        </div>

        <div className="shrink-0 border-t border-border p-3">
          <div className="mb-3 flex items-center gap-3 px-1">
            {userName ? (
              <>
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground"
                >
                  {initials}
                </span>

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {userName}
                </span>
              </>
            ) : (
              <span className="flex-1" />
            )}

            <ThemeToggle />
          </div>

          <Button
            className="w-full"
            disabled={logoutPending}
            onClick={onLogout}
            variant="secondary"
          >
            <FiLogOut aria-hidden="true" size={16} />
            Logout
          </Button>
        </div>
      </div>
    </dialog>
  );
}