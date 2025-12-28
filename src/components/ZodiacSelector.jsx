import { useState } from "react";
import {
  ZODIAC_SIGNS,
  getSelectedZodiac,
  setSelectedZodiac,
} from "../utils/zodiacTones";
import "./ZodiacSelector.css";

export default function ZodiacSelector({ onClose, onSelectZodiac }) {
  const [selectedSign, setSelectedSign] = useState(getSelectedZodiac());
  const [closing, setClosing] = useState(false);

  const handleSelectSign = (sign) => {
    setSelectedSign(sign);
    setSelectedZodiac(sign);
    // Close immediately to guarantee auto-close UX
    onClose?.();
    // Fire selection logic without awaiting UI close
    onSelectZodiac?.(sign);
  };

  const handleClear = () => {
    setSelectedSign(null);
    setSelectedZodiac(null);
    onClose?.();
    onSelectZodiac?.(null);
  };

  return (
    <div
      className={`zodiac-overlay ${closing ? "closing" : ""}`}
      role="presentation"
      tabIndex={-1}
      onClick={() => {
        setClosing(true);
        setTimeout(() => {
          onClose?.();
        }, 180);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setClosing(true);
          setTimeout(() => {
            onClose?.();
          }, 180);
        }
      }}
    >
      <div
        className={`zodiac-modal ${closing ? "closing" : ""}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="zodiac-header">
          <h3>Pick your sign ✨</h3>
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
