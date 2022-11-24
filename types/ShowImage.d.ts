interface ShowImage {
    id: number
    type: string
    main: boolean
    resolutions: {
        original: ShowImageResolution
        medium?: ShowImageResolution
    }
}
