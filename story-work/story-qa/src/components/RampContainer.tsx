import React,  { useState } from 'react';
import '../styles/ramp.css';

type Props = {
  widValue: string
  items: string[]
  onSelect: (label: string) => void
}

const RampContainer: React.FC<Props> = ({ widValue, items, onSelect }) => {
   const [selectedValue, setSelectedValue] = useState<string>("");

   const onSelectBlock = (m: string) => {
    setSelectedValue(m);
    onSelect(m)
  }

  return (
    <div className="ramp-container" style={{width: widValue}}>
      {items.map((item, index) => {
        const total = items.length;
        const skew = 0; // Skew in degrees
        const widthPercent = 100 / total;

        const bgColor = getRandomDarkColor();
        const textColor = getContrastingTextColor(bgColor);

        return (
          <div
            key={index}
            className={`ramp-block`}
            style={{
              backgroundColor: (item === selectedValue) ? 'black' : bgColor,
              color: textColor,
              width: `${widthPercent}%`,
              transform: `skewX(-${skew}deg)`,
              zIndex: total - index,              
              cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,
            }}
             onClick={() => onSelectBlock((item)!)}
          >
            <div className="ramp-label" style={{ transform: `skewX(${skew}deg)`, bottom: `calc(${(index+1)*30}px)` }}>
              {item}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function getRandomDarkColor(): string {
  const hue = Math.floor(Math.random() * 360); // 0–360: all hues
  const saturation = Math.floor(Math.random() * 30) + 70; // 70–100%
  const lightness = Math.floor(Math.random() * 20) + 30;  // 10–30%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
function getContrastingTextColor(bgColor: string): string {
  // Extract lightness from hsl and decide text color
  const match = bgColor.match(/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/);
  const lightness = match ? parseInt(match[1]) : 50;
  return lightness > 70 ? "#000" : "#FFF";
}

export default RampContainer;
