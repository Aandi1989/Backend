// just the example from the video 
const videoQueryRepo = {
    getVideos(): VideoOutputModel[] {
        const dbVideos: DBVideo[] = []
        const authors: DBAuthor[] = []

        return dbVideos.map(dbVideo => {
            const author = authors.find(a => a._id === dbVideo.authorId)
            return this._mapDBVideoToVideoOutputModel(dbVideo, author!)
        })
    },
    getVideoById(id: string): VideoOutputModel {
        const dbVideo: DBVideo = {
            _id: '1234',
            title: 'Some title',
            authorId: '0987'
        }
        const author: DBAuthor = {
            _id:'0987',
            firstName: 'John',
            lastName: 'Smith'
        }
        return this._mapDBVideoToVideoOutputModel(dbVideo, author)
    },
    _mapDBVideoToVideoOutputModel(dbVideo: DBVideo, dbAuthor: DBAuthor){ 
        return {
            id: dbVideo._id,
            title: dbVideo.title,
            author: {
                id: dbAuthor!._id,
                name: dbAuthor!.firstName + ' ' + dbAuthor!.lastName
            }
        }
    }
}

type DBVideo = {
    _id: string
    title: string
    authorId: string
}
type DBAuthor = {
    _id: string
    firstName: string
    lastName: string
}
type VideoOutputModel = {
    id: string
    title: string
    author: {
        id: string
        name: string
    }
}