import { expect } from "chai"
import { ReaperMuteCall } from "../src/ReaperAPI"

describe("ReaperMuteCall", () => {
  it("Correctly returns a reaper command string", () => {
    const call = new ReaperMuteCall(5, true)
    expect(call.toString()).to.equal("SET/TRACK/5/MUTE/1")
  })
})
