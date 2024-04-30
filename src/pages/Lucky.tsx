import { motion, useMotionValue, useTransform, MotionStyle, color, useTime, easeInOut, easeIn, circInOut, backInOut } from "framer-motion";
import move from "lodash-move";
import { useEffect, useState } from "react";
const CARD_COLORS = ["#266678", "#cb7c7a", " #36a18b", "#cda35f", "#747474"];
const CARD_OFFSET = 10;
const SCALE_FACTOR = 0.06;

import './Lucky.css'
import { useBackend } from "@/services/backendService";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Aula from "@/models/aula";


export function findInterval(arr: string[], num: number) {
  // Initialize variables to store the result
  let isInInterval = false;
  let nextInterval = null;

  // Iterate through each interval
  for (let i = 0; i < arr.length; i++) {
    // Parse the interval string to extract start and end numbers
    const [startStr, endStr] = arr[i].split(":");
    const start = parseInt(startStr);
    const end = parseInt(endStr);

    // Check if the number falls within the interval
    if (num >= start && num <= end) {
      isInInterval = true;
      nextInterval = end; // Store the end of the interval
      break; // Exit the loop since we found the interval
    }
    // Check if the number is before the start of this interval
    else if (num < start) {
      nextInterval = start;
      break; // No need to continue looping
    }
  }

  // Return the result
  return { isInInterval, nextInterval, wait: nextInterval ? nextInterval - num : null };
}

function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  // Pad the hours and minutes with leading zeros if necessary
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMins = mins.toString().padStart(2, '0');

  return `${paddedHours}:${paddedMins}`;
}

export function getAvailability(interval: any) {
  return (interval.isInInterval ? "Occupata" : "Disponibile") + " fino " + (interval.nextInterval ? "alle " + minutesToTime(interval.nextInterval) : " a chiusura");
}

export function getCurrentReport(arr: string[], openCond: boolean){
  if (!arr) return "";
  const currentMin = new Date().getHours() * 60 + new Date().getMinutes();
  // cycle arr from last to first
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!arr[i]) continue;
    const [openStr, startStr, endStr] = arr[i].split(":");
    const open = openStr === "true";
    const start = parseInt(startStr);
    const end = parseInt(endStr);
    if (open == openCond && currentMin >= start && currentMin <= end) {
      return "segnalata " + (open ? "aperta" : "chiusa") + " fino alle " + minutesToTime(end);
    }
  }
  return null;
}

// Example usage:
// const intervals = ["10:20", "30:40"];
// const number = 30;
// const result = findInterval(intervals, number);
// console.log(`Is ${number} inside any interval? ${result.isInInterval}`);
// console.log(`Next interval start after ${number}: ${result.nextInterval}`);

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

function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

const Card = (props: any) => {

  const tutorialCondition = props.index == 0 && props.tutorial;
  const time = useTime();
  const loopTime = useTransform(() => time.get() % 4000);
  const tutorialAnimation = useTransform(loopTime, [0, 3000, 3400, 3600, 4000], [0, 0, 100, 100, 0], { clamp: true, ease: circInOut });
  const xVal = useMotionValue(0);
  const x = useTransform(() => xVal.get() + (tutorialCondition ? tutorialAnimation.get() : 0));
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
      onDragEnd={(event, info) => {
        if (Math.hypot(info.offset.x, info.offset.y) < 100) return;
        props.moveToEnd(props.index);
      }}
    >
      <h1 className="hero-text">{props.color.short_name}</h1>
      <div className="hero-details">
        <span>{props.color.name} - {props.color.building}</span>
        <span>{props.color.availability_text}</span>
        {props.color.currentReportStr && <span>({props.color.currentReportStr})</span>}
      </div>
    </motion.li>
  );
};

function Lucky() {
  const backend = useBackend();

  const [tutorial, setTutorial] = useState(true);

  const [cards, setCards] = useState(backend.getAvailableAule());
  const moveToEnd = (from: number) => {
    setCards(move(cards, from, cards.length - 1));
  };

  return (
    <>
    {backend.session !== null ? <Button variant="outline" size="icon" className="absolute" style={{right: "2rem", zIndex: 10}} onClick={() => backend.logout()}>
      <LogOutIcon className="h-4 w-4" />
    </Button> : null}
      <div style={wrapperStyle} onMouseDown={() => setTutorial(false)} onTouchStart={() => setTutorial(false)}>
        <ul className="cardWrap">
          {[...cards.slice(0, 3), cards[cards.length - 1]].map((color, index) => {
            const canDrag = index === 0;

            return (
              <Card
                tutorial={tutorial}
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
    </>
  );
}

export default Lucky;
