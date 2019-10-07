// require mutation files
const register = require('./mutation/userMutaion').register
const login = require('./mutation/userMutaion').login
const verifyEmail = require('./mutation/userMutaion').verifyEmail
const resetpassword = require('./mutation/userMutaion').resetpassword
const forgotpassword = require('./mutation/userMutaion').forgotpassword
const createLabel = require('./mutation/labelMutation').createLabel
const removeLabel = require('./mutation/labelMutation').removeLabel
const updateLable = require('./mutation/labelMutation').updateLabel
const createNote = require('./mutation/noteMutation').createNote
const removeNote = require('./mutation/noteMutation').removeNote
const updateNote = require('./mutation/noteMutation').updateNote
const imageUpload = require('./mutation/imageUpload').imageUpload
const oAuth = require('./mutation/oAuth').oAuth
const gitVerify = require('./mutation/oAuth').verify
const archive = require('./mutation/noteMutation').archive
const unarchive = require('./mutation/noteMutation').unarchive
const trash = require('./mutation/noteMutation').trash
const untrash = require('./mutation/noteMutation').untrash
const addReminder = require('./mutation/noteMutation').addReminder
const fetchGitRepo = require('./mutation/noteMutation').fetchGitRepo
const createBranch = require('./mutation/gitMutation').createBranch
const deleteBranch = require('./mutation/gitMutation').deleteBranch
const watchRepository = require('./mutation/gitMutation').watchRepository
const unwatchRepository = require('./mutation/gitMutation').unwatchRepository
const starRepository = require('./mutation/gitMutation').starRepository
const unstarRepository = require('./mutation/gitMutation').unstarRepository
const addCollaborator = require('./mutation/collaborator').addCollaborator
const removeCollaborator = require('./mutation/collaborator').removeCollaborator

// require Query files
const Users = require('./query').User
const searchNotesByTitle = require('./query').searchNotesByTitle
const searchNotesByDescription = require('./query').searchNotesByDescription
const label = require('./query').label
const searchUser = require('./query').searchUser
const collaboratedNote = require('./query').collaboratedNote

// resolvers
exports.resolvers = {

    // Querys
    Query: {
        Users,
        searchUser,
        label,
        searchNotesByTitle,
        searchNotesByDescription,
        collaboratedNote
    },

    // Mutations
    Mutation: {
        register,
        login,
        verifyEmail,
        resetpassword,
        forgotpassword,
        createLabel,
        removeLabel,
        updateLable,
        createNote,
        removeNote,
        updateNote,
        oAuth,
        gitVerify,
        imageUpload,
        archive,
        unarchive,
        trash,
        untrash,
        addReminder,
        fetchGitRepo,
        createBranch,
        deleteBranch,
        watchRepository,
        unwatchRepository,
        starRepository,
        unstarRepository,
        addCollaborator,
        removeCollaborator
    }
}
