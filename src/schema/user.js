export default `
type User {
    id:Int!
    username: String!
    email: String
    picture:String
    roles:[String!]
    
  }
 

  type RegisterResponse{
      errors:[Error!]
      ok:Boolean!
  }
  type LoginResponse{
    token:String
    user:User
    errors:[Error!]
    ok:Boolean!
}

type Query{
     
    allUsers:[User!]
    me:User!
     
}

type Mutation{

    login(email:String!,password:String!):LoginResponse!
    register(email:String,username:String!,password:String!):RegisterResponse!
}

 
`;
