import { VideoResolution } from "../db/db"

export type CreateVideoModel = {
    title: string,
    author: string,
    availableResolutions: VideoResolution[]
}