"use client";

import { useEffect } from "react";

type Props = {
  resourceId?: string;
};

export default function FocusedResource({ resourceId }: Props) {
  useEffect(() => {
    if (!resourceId) return;

    const element = document.getElementById(`resource-${resourceId}`);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [resourceId]);

  return null;
}
