import { searchResult } from "./searchResult";

export enum playerAction {
  Play = "Play",
  Pause = "Pause",
}
export interface playerMessage {
  roomId: string;
  action?: playerAction;
  currentTimePercentage: number;
  currentVideo?: string;
  users?:user[];
  playlist?:searchResult[];
}
