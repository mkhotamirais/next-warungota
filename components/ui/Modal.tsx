"use client";

import {
  useState,
  createContext,
  useContext,
  ReactNode,
  isValidElement,
  cloneElement,
  Dispatch,
  SetStateAction,
} from "react";
import clsx from "clsx";
import { FaXmark } from "react-icons/fa6";

const ModalContext = createContext<{ close: () => void } | undefined>(undefined);

function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("ModalClose must be used inside Modal");
  return ctx;
}

interface ModalProps {
  children: ReactNode;
  trigger: ReactNode;
  bg?: string;
  title: ReactNode;
  close?: boolean;
  className?: string;
  ariaLabel?: string;
  triggerDisabled?: boolean;
  modalOpen?: boolean;
  onModalOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({
  children,
  trigger,
  bg = "bg-black/50",
  title,
  close = true,
  className,
  ariaLabel = "dialog",
  triggerDisabled = false,
  modalOpen,
  onModalOpenChange,
}: ModalProps) {
  const [_open, _setOpen] = useState(false);

  const open = modalOpen !== undefined ? modalOpen : _open;

  const setOpen = onModalOpenChange || _setOpen;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
        className="disabled:opacity-50 leading-none block"
        disabled={triggerDisabled}
        tabIndex={triggerDisabled ? -1 : 0}
      >
        {trigger}
      </button>

      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-50 flex items-center justify-center transition-all",
          open ? "visible opacity-100" : "invisible opacity-0",
          bg
        )}
        onClick={() => setOpen(false)}
      >
        {/* Modal Box */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            "mx-3 bg-white rounded-lg shadow-lg w-full max-w-md transform transition-transform",
            open ? "scale-100" : "scale-95",
            className
          )}
        >
          <ModalContext.Provider value={{ close: () => setOpen(false) }}>
            <div className="p-4 border-b flex items-center justify-between">
              {title}
              {close ? (
                <ModalClose>
                  <FaXmark />
                </ModalClose>
              ) : null}
            </div>
            <div className="p-4">{children}</div>
          </ModalContext.Provider>
        </div>
      </div>
    </div>
  );
}

interface ModalCloseProps {
  children: ReactNode;
  asChild?: boolean;
}

// Komponen untuk menutup modal
export function ModalClose({ children, asChild }: ModalCloseProps) {
  const { close } = useModal();

  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<React.DOMAttributes<HTMLElement>>;
    const originalOnClick = child.props.onClick;

    const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
      if (typeof originalOnClick === "function") originalOnClick(e);
      close();
    };

    return cloneElement(child, { onClick: handleClick });
  }

  return (
    <button type="button" aria-label="Close Modal" onClick={close} className="text-gray-500 hover:text-gray-700">
      {children}
    </button>
  );
}
