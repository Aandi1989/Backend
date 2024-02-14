export type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: null | number,
    createdAt: string,
    publicationDate: string,
    availableResolutions: VideoResolution[]
}

export enum VideoResolution {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160"
}

export const db: DBType = {
    videos: [
        {
            id: 0,
            title: "New Video",
            author: "John Smith",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2024-02-14T13:31:26.469Z",
            publicationDate: "2024-02-14T13:31:26.469Z",
            availableResolutions: [
                VideoResolution.P144
            ]
        }
    ]
}

export type DBType = {
    videos: VideoType[]
}