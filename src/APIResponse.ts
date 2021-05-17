import { AxiosResponse } from "axios"
import { Result } from "./Utility"

export type APIResponse = Array<Array<string>> | null | undefined

export function parseResponse(
  resp: AxiosResponse<string>,
): Result<APIResponse> {
  if (resp.data.trim() === "") {
    return null
  }

  return resp.data
    .trim()
    .split("\n")
    .map((line) => line.split("\t"))
}
