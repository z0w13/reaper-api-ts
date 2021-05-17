import { ReaperChannel, parseChannels } from "./ReaperChannel"
import axios from "axios"
import { isError, Result } from "./Utility"
import { APIResponse, parseResponse } from "./APIResponse"

export type ReaperCommand = "SET" | "TRACK"

export class ReaperCall {
  protected command: ReaperCommand
  protected args: Array<string | number>

  constructor(cmd: ReaperCommand, args: Array<string | number> = []) {
    this.command = cmd
    this.args = args
  }

  public toString(): string {
    return [this.command, ...this.args].join("/")
  }
}

export class ReaperMuteCall extends ReaperCall {
  constructor(channel: number, muted: boolean) {
    super("SET", ["TRACK", channel.toString(), "MUTE", muted ? "1" : "0"])
  }
}

export default class ReaperAPI {
  protected url: string

  constructor(url: string) {
    this.url = url
  }

  public async getAllChannels(): Promise<Result<Array<ReaperChannel>>> {
    const resp = await this.request([new ReaperCall("TRACK")])
    if (isError(resp)) {
      return resp
    }

    return parseChannels(resp)
  }

  public async getChannels(
    channels: Array<number>,
  ): Promise<Result<Array<ReaperChannel>>> {
    const resp = await this.request(
      channels.map((idx) => new ReaperCall("TRACK", [idx])),
    )

    if (isError(resp)) {
      return resp
    }

    return parseChannels(resp)
  }

  public async getChannel(idx: number): Promise<Result<ReaperChannel>> {
    const resp = await this.getChannels([idx])
    if (isError(resp)) {
      return resp
    }

    return resp[0]
  }

  public async muteChannel(idx: number): Promise<Result<APIResponse>> {
    return this.muteChannels([idx])
  }

  public async unmuteChannel(idx: number): Promise<Result<APIResponse>> {
    return this.unmuteChannels([idx])
  }

  public async muteChannels(
    channels: Array<number>,
  ): Promise<Result<APIResponse>> {
    return this.request(channels.map((idx) => new ReaperMuteCall(idx, true)))
  }

  public async unmuteChannels(
    channels: Array<number>,
  ): Promise<Result<APIResponse>> {
    return this.request(channels.map((idx) => new ReaperMuteCall(idx, false)))
  }

  public async request(
    commands: Array<ReaperCall>,
  ): Promise<Result<APIResponse>> {
    const commandString = commands
      .map((command) => command.toString())
      .join(";")

    try {
      const resp = await axios.get<string>(this.url + "/_/" + commandString)
      return parseResponse(resp)
    } catch (err) {
      if (err.response && err.response?.data?.error) {
        return new Error(err.response.data.error)
      } else {
        return new Error(err)
      }
    }
  }
}
