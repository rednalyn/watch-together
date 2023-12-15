enum playerAction {
  Play = "Play",
  Pause = "Pause",
}
interface playerMessage {
  roomId: string;
  action?: playerAction;
  currentTimePercentage: number;
  currentVideo?: string;
}
