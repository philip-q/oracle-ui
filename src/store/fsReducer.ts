import {SIMULATION_STATS_FILE_CLOSED, SIMULATION_STATS_FILE_OPENED} from "./actions";
import FileModel from "../models/FileModel";
import { ReplicationBuilder } from "typescript-immutable-helper";


export class FsState {
  simulationResultFile: FileModel | null;
  
  constructor() {
    this.simulationResultFile = null;
  }
  
  public withSimulationResultFile = (file: FileModel | null): FsState  => {
    return ReplicationBuilder.forObject(this).replaceValueOf("simulationResultFile").with(file).build();
  }
  
}

const INITIAL_STATE = new FsState();

export default (state=INITIAL_STATE, action: any) => {
  const {type, payload} = action;
  
  switch (type) {

    case SIMULATION_STATS_FILE_OPENED:
      return state.withSimulationResultFile(payload);
      
    case SIMULATION_STATS_FILE_CLOSED:
      return state.withSimulationResultFile(null);

    default:
      return state;

  }
}
