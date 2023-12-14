export enum playerAction{
    Play="Play",
    Pause="Pause",
}
export interface playerMessages{
    action:playerAction,
    currentTime:number,
}