import { flagSet } from "./Utility"
import { ChannelFlags } from "./ChannelFlags"

//////////////////////////
// IDX | Description
//   0 | TRACK
//   1 | idx
//   2 | name
//   3 | flags
//   4 | volume
//   5 | pan
//   6 | lastMeterPeak
//   7 | lastMeterPos
//   8 | width
//   9 | panMode
//  10 | sendCount
//  11 | receiveCount
//  12 | hardwareOutCount
//  13 | color
export interface ReaperChannel {
  idx: number
  name: string
  flags: {
    folder: boolean
    selected: boolean
    hasFX: boolean
    muted: boolean
    soloed: boolean
    soloInPlace: boolean
    recordArmed: boolean
    recordMonitoringOn: boolean
    recordMonitoringAuto: boolean
  }
  volume: number
  pan: number
  lastMeterPeak: number
  lastMeterPos: number
  width: number
  panMode: number
  sendCount: number
  receiveCount: number
  hardwareOutCount: number
  color: {
    red: number
    green: number
    blue: number
    alpha: number // Doesn't really matter tbh always 0.2 it seems
  }
}

export function parseChannel(input: Array<string>): ReaperChannel {
  const intFlags = Number(input[3])

  return {
    idx: Number(input[1]),
    name: input[2],
    flags: {
      folder: flagSet(intFlags, ChannelFlags.Folder),
      selected: flagSet(intFlags, ChannelFlags.Selected),
      hasFX: flagSet(intFlags, ChannelFlags.HasFX),
      muted: flagSet(intFlags, ChannelFlags.Muted),
      soloed: flagSet(intFlags, ChannelFlags.Soloed),
      soloInPlace: flagSet(intFlags, ChannelFlags.SoloInPlace),
      recordArmed: flagSet(intFlags, ChannelFlags.RecordArmed),
      recordMonitoringOn: flagSet(intFlags, ChannelFlags.RecordMonitoringOn),
      recordMonitoringAuto: flagSet(
        intFlags,
        ChannelFlags.RecordMonitoringAuto,
      ),
    },
    volume: parseFloat(input[4]),
    pan: parseFloat(input[5]),
    lastMeterPeak: Number(input[6]) / 10,
    lastMeterPos: Number(input[7]) / 10,
    width: parseFloat(input[8]),
    panMode: Number(input[9]),
    sendCount: Number(input[10]),
    receiveCount: Number(input[11]),
    hardwareOutCount: Number(input[12]),
    color: {
      red: Math.floor((Number(input[13].substr(2, 2)) / 100) * 255),
      green: Math.floor((Number(input[13].substr(4, 2)) / 100) * 255),
      blue: Math.floor((Number(input[13].substr(6, 2)) / 100) * 255),
      alpha: Number(input[13].substr(0, 2)) / 100,
    },
  }
}

export function parseChannels(
  input: Array<Array<string>>,
): Array<ReaperChannel> {
  return input.map(parseChannel)
}
