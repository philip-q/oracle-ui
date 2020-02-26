import {SIMULATION_STATS_FILE_CLOSED, SIMULATION_STATS_FILE_OPENED} from "./actions";
import FileModel from "../models/FileModel";
import { ReplicationBuilder } from "typescript-immutable-helper";
import FileMetadataModel from "../models/FileMetadataModel";


export class FsState {
  simulationResultFile: FileModel | null;
  nextSimulationResultFile: FileMetadataModel | null;
  prevSimulationResultFile: FileMetadataModel | null;
  
  constructor() {
    this.simulationResultFile = null;
    this.nextSimulationResultFile = null;
    this.prevSimulationResultFile = null;
  }
  
  public withSimulationResultFile = (file?: FileModel, prev?: FileMetadataModel, next?: FileMetadataModel): FsState  => {
    return ReplicationBuilder.forObject(this)
      .replaceValueOf("simulationResultFile").with(file || null)
      .replaceValueOf("prevSimulationResultFile").with(prev || null)
      .replaceValueOf("nextSimulationResultFile").with(next || null)
      .build();
  };
  
}

const INITIAL_STATE = new FsState();

export default (state=INITIAL_STATE, action: any) => {
  const {type, payload} = action;
  
  switch (type) {

    case SIMULATION_STATS_FILE_OPENED:
      return state.withSimulationResultFile(payload.file, payload.prev, payload.next);
      
    case SIMULATION_STATS_FILE_CLOSED:
      return state.withSimulationResultFile();

    default:
      return state;

  }
}
