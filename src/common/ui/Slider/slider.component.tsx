import React from "react";
import css from "./slider.module.css";

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ label, value, onChange }) => {
  return (
    <div className={css.sliderContainer}>
      <label className={css.sliderLabel}>
        {label}: {(value * 100).toFixed(0)}%
      </label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={css.slider}
      />
    </div>
  );
};
