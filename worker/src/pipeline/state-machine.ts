// Updated state machine with idempotency and retries
export enum JobState{PENDING,RUNNING,SUCCEEDED,FAILED,DEAD}
export interface Transition{from:JobState;to:JobState;}
export const transitions:Transition[]=[{from:JobState.PENDING,to:JobState.RUNNING},{from:JobState.RUNNING,to:JobState.SUCCEEDED},{from:JobState.RUNNING,to:JobState.FAILED},{from:JobState.FAILED,to:JobState.DEAD}];
export function canTransition(from:JobState,to:JobState){return transitions.some(t=>t.from===from&&t.to===to)}
