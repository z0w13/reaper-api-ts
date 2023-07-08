import { APIResponse } from "./APIResponse"
import { flagSet } from "./Utility"
import { ChannelFlags } from "./ChannelFlags"

//////////////////////////
//
// Channel sends are 0-indexed and all contiguous
//
// IDX | Description
//   0 | SEND
//   1 | channel
//   2 | send
//   3 | flags
//   4 | volume
//   5 | pan
//   6 | otherTrackIndex        Negative if hardware out
export interface ReaperChannelSend {
  channel: number
  send: number
  flags: {
    muted: boolean
  }
  volume: number
  pan: number
  otherTrackIndex: number
  hardware: boolean
}

export function parseChannelSend(input: Array<string>): ReaperChannelSend {
  const intFlags = Number(input[3])

  return {
    channel: Number(input[1]),
    send: Number(input[2]),
    flags: {
      muted: flagSet(intFlags, ChannelFlags.Muted),
    },
    volume: parseFloat(input[4]),
    pan: parseFloat(input[5]),
    otherTrackIndex: parseFloat(input[6]),
    hardware: parseFloat(input[6]) === -1,
  }
}

export function parseChannelSends(input: APIResponse): Array<ReaperChannelSend> {
  return input ? input.map(parseChannelSend) : []
}
