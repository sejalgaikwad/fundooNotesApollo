const { gql } = require('apollo-server');

const typeDefs = gql`
type User {
    _id : ID!
    firstname : String!
    lastname : String!
    email : String!
    password : String!
    imageUrl : String!
    message : String!
}
  
 type Auth {
     message : String!
     token : String!
     success : Boolean!  
 }

 type label{
     _id : ID!
     labelName : String!
 }

 type notes{
    _id : ID!
     title: String!
     description : String!
     message : String!
 }
 
   type Query {
    Users(userID:String!):[User]
    searchUser(email:String):[User]
    searchNotesByTitle(title:String!):[notes]
    searchNotesByDescription(description:String!):[notes]
    label(labelID:String):[label]
    }
 
 type Mutation
 {
    register(firstname: String!, lastname: String!, email: String!, password: String!):Auth
    login(email:String!, password:String!):Auth
    verifyEmail:Auth
    resetpassword(confirmpassword:String!, password:String!):Auth
    forgotpassword(email:String!):Auth
    createLabel(labelName:String!):Auth
    removeLabel(labelID:String!):Auth
    updateLable(labelID:String!, newlabelName:String!):Auth
    createNote(labelID:String!, title:String, description:String!):Auth
    removeNote(noteID:String!):Auth
    updateNote(noteID:String!, title:String, description:String!):Auth
    oAuth:Auth
    gitVerify:Auth
    imageUpload:Auth
    archive(noteID:String!):Auth
    unarchive(noteID:String!):Auth
    trash(noteID:String!):Auth
    untrash(noteID:String!):Auth
    addReminder(noteID:String!,date:String!):Auth
    fetchGitRepo:Auth
    createBranch(gitUserName:String!, repoName:String!, branchName:String!):Auth
    deleteBranch(gitUserName:String!, repoName:String!, branchName:String!):Auth
    watchRepository(watchRepository:String!, gitUserName:String!):Auth
    unwatchRepository(unwatchRepository:String!, gitUserName:String!):Auth
    starRepository(starRepository:String!, gitUserName:String!):Auth
    unstarRepository(unstarRepository:String!, gitUserName:String!):Auth
    addCollaborator(collaboratorID:String!, noteID:String!):Auth
    removeCollaborator(collaboratorID:String!, noteID:String!):Auth
   }`;
module.exports = { typeDefs };



