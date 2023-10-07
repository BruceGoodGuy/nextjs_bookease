import { TypeAnimation } from "react-type-animation";

export default function TypingAnimation({content}) {
  let sequence = [];
  for (let i in content) {
    if (i === 0 || i === (content.length - 1)) {
      sequence.push(500);
    } else {
      sequence.push(1000);
      sequence.push(content[i]);
    }
  }
  return (
    <TypeAnimation
      preRenderFirstString={true}
      sequence={sequence}
      speed={50}
      repeat={Infinity}
    />
  );
}
