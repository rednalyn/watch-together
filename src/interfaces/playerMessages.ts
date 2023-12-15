export enum playerAction {
  Play = "Play",
  Pause = "Pause",
}
export interface playerMessage {
  action?: playerAction;
  currentTimePercentage: number;
  currentVideo?: string;
}
