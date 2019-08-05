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

type repo {
    isPrivate : Boolean
    name : String
}
  
 type Auth {
     message : String,
     token : String,
     success : Boolean!  
     repo : [repo]
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

 type UserCommites {
    repositoryCount : Int!
    edges:[edges]
 }

 type edges {
     node : node
 }

 type node {
     name:String
    commitComments:commitComments
 }

 type commitComments {
    totalCount:Int!
     nodes:[nodes]
 }

 type nodes {
    commit : commitUrl
 }

 type commitUrl {
    commitUrl:String
 }

 type Query {
     Users :[User]
 }
 
 type Mutation{
    register(firstname: String!,lastname: String!,email: String!, password: String!):Auth
    login(email:String!,password:String!):Auth
    verifyEmail:Auth
    resetpassword(confirmpassword:String!,password:String!):Auth
    forgotpassword(email:String!):Auth
    createLabel(labelName:String!):Auth
    removeLabel(labelID:String!):Auth
    updateLable(labelID:String!,newlabelName:String!):Auth
    createNote(labelID:String!,title:String,description:String!):Auth
    removeNote(noteID:String!):Auth
    updateNote(noteID:String!,title:String,description:String!):Auth
    oAuth:Auth
    gitVerify:Auth
    imageUpload:Auth
    archive(noteID:String!):Auth
    unarchive(noteID:String!):Auth
    trash(noteID:String!):Auth
    untrash(noteID:String!):Auth
    addReminder(noteID:String!,reminder:String!):Auth
    fetchGitRepo:Auth
 }
`;

module.exports = { typeDefs };







 
