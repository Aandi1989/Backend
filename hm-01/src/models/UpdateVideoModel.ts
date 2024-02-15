import { VideoResolution } from "../db/db"

export type UpdateVideoModel = {
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: null | number,
    publicationDate: string,
    availableResolutions: VideoResolution[]
}