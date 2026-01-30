import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { noteIndex, SCALE_DEFINITIONS } from "../music";
import { useAppStore } from "../stores/appStore";
import type { CagedShape } from "../types";

export function useUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialized = useRef(false);

  const selectedKey = useAppStore((s) => s.selectedKey);
  const isMinor = useAppStore((s) => s.isMinor);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const selectedCagedShapes = useAppStore((s) => s.selectedCagedShapes);
  const _setMusicalState = useAppStore((s) => s._setMusicalState);
  const selectKey = useAppStore((s) => s.selectKey);

  // Read URL params on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const keyParam = searchParams.get("key");
    const scaleParam = searchParams.get("scale");
    const minorParam = searchParams.has("minor");
    const cagedParam = searchParams.get("caged");

    let key: string | null = null;
    let scale = "Major";
    let minor = false;

    if (keyParam && noteIndex(keyParam) >= 0) {
      key = keyParam;
    }

    if (scaleParam && SCALE_DEFINITIONS.some((s) => s.name === scaleParam)) {
      scale = scaleParam;
    }

    if (minorParam) {
      minor = true;
    }

    const cagedShapes = new Set<CagedShape>();
    if (cagedParam) {
      for (const s of cagedParam.split(",")) {
        if (["C", "A", "G", "E", "D"].includes(s)) {
          cagedShapes.add(s as CagedShape);
        }
      }
    }

    // Only apply if URL has params
    if (key || scaleParam || minorParam || cagedParam) {
      if (key) {
        // Use selectKey for proper Major/Minor auto-switching
        selectKey(key, minor);
        if (scale !== "Major" && scale !== "Natural Minor") {
          // selectKey may have set Major or Natural Minor, override with URL scale
          useAppStore.getState().selectScale(scale);
        } else if (minor && scale === "Major") {
          // selectKey handles this but just in case
        } else if (!minor && scale !== "Major") {
          useAppStore.getState().selectScale(scale);
        }
      }
      if (cagedShapes.size > 0) {
        useAppStore.getState().setCagedShapes(cagedShapes);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Write state to URL
  useEffect(() => {
    if (!initialized.current) return;

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (selectedKey) {
          next.set("key", selectedKey);
        } else {
          next.delete("key");
        }
        if (selectedScale !== "Major") {
          next.set("scale", selectedScale);
        } else {
          next.delete("scale");
        }
        if (isMinor) {
          next.set("minor", "1");
        } else {
          next.delete("minor");
        }
        if (selectedCagedShapes.size > 0) {
          next.set("caged", [...selectedCagedShapes].join(","));
        } else {
          next.delete("caged");
        }
        return next;
      },
      { replace: true },
    );
  }, [selectedKey, selectedScale, isMinor, selectedCagedShapes, setSearchParams]);
}
