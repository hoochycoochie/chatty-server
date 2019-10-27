export default `
type PrivateMessage {
    id:Int!
    msg: String
    filetype:String
    url:String
    created_at:String
    sender:User
  }
 

 
  type createPrivateMessageResponse{
    ok:Boolean!
    message:Message
    errors:[Error!]
}


 
 
 

type Mutation{

    createPrivateMessage(msg:String, channelId:Int!):createPrivateMessageResponse!

   
   
}

 
`;
