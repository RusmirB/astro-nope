import { useState } from "react";
import {
  ZODIAC_SIGNS,
  getSelectedZodiac,
  setSelectedZodiac,
} from "../utils/zodiacTones";
import "./ZodiacSelector.css";

export default function ZodiacSelector({ onClose, onSelectZodiac }) {
  const [selectedSign, setSelectedSign] = useState(getSelectedZodiac());

  const handleSelectSign = async (sign) => {
    setSelectedSign(sign);
    setSelectedZodiac(sign);
    // Call parent handler to generate zodiac-specific excuse
    if (onSelectZodiac) {
      await onSelectZodiac(sign);
    }
    // Parent will close modal immediately to prevent race conditions
  };

  const handleClear = () => {
    setSelectedSign(null);
    setSelectedZodiac(null);
    if (onSelectZodiac) {
      onSelectZodiac(null);
    }
    setTimeout(onClose, 300);
  };

  return (
    <div className="zodiac-overlay" onClick={onClose}>
      <div className="zodiac-modal" onClick={(e) => e.stopPropagation()}>
        <div className="zodiac-header">
          <h3>Pick your sign ✨</h3>
          <button className="zodiac-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="zodiac-grid">
          {ZODIAC_SIGNS.map((sign) => (
            <button
              key={sign.key}
              className={`zodiac-button ${
                selectedSign === sign.key ? "selected" : ""
              }`}
              onClick={() => handleSelectSign(sign.key)}
              title={sign.name}
            >
              <span className="zodiac-symbol">{sign.symbol}</span>
              <span className="zodiac-name">{sign.name}</span>
            </button>
          ))}
        </div>

        {selectedSign && (
          <button className="zodiac-clear" onClick={handleClear}>
            Clear selection
          </button>
        )}
      </div>
    </div>
  );
}
