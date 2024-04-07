import { motion, useMotionValue, useTransform, MotionStyle, color } from "framer-motion";
import move from "lodash-move";
import { useState } from "react";
const CARD_COLORS = ["#266678", "#cb7c7a", " #36a18b", "#cda35f", "#747474"];
const CARD_OFFSET = 10;
const SCALE_FACTOR = 0.06;

import './Lucky.css'
import { useBackend } from "@/services/backendService";

const cardStyle: MotionStyle = {
  position: "absolute",
  borderRadius: "8px",
  transformOrigin: "top center",
  listStyle: "none",
  display: "grid",
  placeItems: "center",
};

const wrapperStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
};

function clamp(number: number, min:number, max:number) {
  return Math.max(min, Math.min(number, max));
}

const Card = (props: any) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-700, 700], [-45, 45]);

  return (
    <motion.li
      className="card"
      style={{
        ...cardStyle,
        cursor: props.canDrag ? "grab" : "auto",
        x,
        rotate,
      }}
      animate={{
        top: props.index * -CARD_OFFSET,
        scale: 1 - props.index * SCALE_FACTOR,
        zIndex: CARD_COLORS.length - props.index,
      }}
      drag={props.canDrag ? true : false}
      dragElastic={0.5}
      dragConstraints={{
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      }}
      onDragEnd={() => {
        props.moveToEnd(props.index);
      }}
    >
      <h1 className="hero-text">{props.color.short_name}</h1>
    <div className="hero-details">
      <span>{props.color.name} - {props.color.building}</span>
      <span>{props.color.availability}</span>
    </div>
    </motion.li>
  );
};

function Lucky(){
  const backend = useBackend();
  

  const [cards, setCards] = useState(backend);
  const moveToEnd = (from: number) => {
    setCards(move(cards, from, cards.length - 1));
  };

  return (
    <div style={wrapperStyle}>
      <ul className="cardWrap">
        {[...cards.slice(0,3), cards[cards.length -1]].map((color, index) => {
          const canDrag = index === 0;

          return (
            <Card
              key={color.id}
              color={color}
              index={index}
              canDrag={canDrag}
              moveToEnd={moveToEnd}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default Lucky;
