import confetti from "canvas-confetti";

export function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
  });
}
