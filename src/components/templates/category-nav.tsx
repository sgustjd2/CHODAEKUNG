"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

export type CategoryNavItem = { id: string; label: string; iconName: string };

export function CategoryNav({ items }: { items: CategoryNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const onScroll = () => {
      let current = items[0]?.id ?? "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top < 200) current = it.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="cat-nav">
      {items.map((it) => (
        <a
          key={it.id}
          href={`#${it.id}`}
          className={active === it.id ? "active" : undefined}
          onClick={(e) => scrollTo(e, it.id)}
        >
          <span className="ic-wrap">
            <Icon name={it.iconName} className="ic" />
          </span>
          {it.label}
        </a>
      ))}
    </div>
  );
}
