"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  value: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

function getSelectedIndex(value: string, options: SelectOption[]): number {
  const index = options.findIndex((option) => option.value === value);
  return index >= 0 ? index : 0;
}

export function SelectField({
  value,
  options,
  placeholder,
  onChange,
  ariaLabel,
  disabled = false,
  className,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = useMemo(() => getSelectedIndex(value, options), [options, value]);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [open]);

  const openMenu = (startIndex = selectedIndex) => {
    if (disabled || options.length === 0) {
      return;
    }

    setActiveIndex(Math.min(Math.max(startIndex, 0), options.length - 1));
    setOpen(true);
    window.requestAnimationFrame(() => {
      listRef.current?.focus();
    });
  };

  const moveActiveIndex = (direction: -1 | 1) => {
    if (options.length === 0) {
      return;
    }

    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0) {
        return options.length - 1;
      }

      if (nextIndex >= options.length) {
        return 0;
      }

      return nextIndex;
    });
  };

  const commitSelection = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        openMenu(selectedIndex);
        break;
      case "ArrowUp":
        event.preventDefault();
        openMenu(selectedIndex === 0 ? options.length - 1 : selectedIndex);
        break;
      case "Enter":
      case " ":
        event.preventDefault();

        if (open) {
          setOpen(false);
        } else {
          openMenu(selectedIndex);
        }
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActiveIndex(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActiveIndex(-1);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(Math.max(0, options.length - 1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();

        if (options[activeIndex]) {
          commitSelection(options[activeIndex].value);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={rootRef} className={cn("ui-select-shell", className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn("ui-select-trigger", disabled && "cursor-not-allowed opacity-60")}
        data-open={open ? "true" : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            openMenu(selectedIndex);
          }
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={cn("truncate", selectedOption ? "text-foreground" : "text-muted-foreground")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180 text-foreground",
          )}
        />
      </button>

      {open && (
        <div className="ui-select-panel">
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-activedescendant={open ? `${listboxId}-${activeIndex}` : undefined}
            tabIndex={open ? 0 : -1}
            className="max-h-64 overflow-y-auto p-1.5"
            onKeyDown={handleListKeyDown}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <li key={option.value || "__all"} id={`${listboxId}-${index}`} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    className="ui-select-option rounded-xl"
                    data-active={isActive ? "true" : undefined}
                    data-selected={isSelected ? "true" : undefined}
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commitSelection(option.value)}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected ? <Check className="h-4 w-4 shrink-0 text-primary" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
