import { ref } from "vue";

export const TOAST_POSITION_OPTIONS = [
  { label: "Top Right", value: "top-right" },
  { label: "Top Center", value: "top-center" },
  { label: "Top Left", value: "top-left" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Bottom Center", value: "bottom-center" },
  { label: "Bottom Left", value: "bottom-left" },
];

const toastPosition = ref("bottom-right");

export function useToastConfig() {
  return {
    toastPosition,
    toastPositionOptions: TOAST_POSITION_OPTIONS,
  };
}
