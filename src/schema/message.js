export default `
type Message {
    id:Int!
    msg: String
    filetype:String
    url:String
    created_at:String
    owner:User
  }
 

 
  type createMessageResponse{
    ok:Boolean!
    message:Message
    errors:[Error!]
}


type Subscription{
    newChannelMessage(channelId:Int!):Message!
}
type Query{
    allMessages(channelId:Int!):[Message!]
}
 
 

type Mutation{

    createMessage(msg:String, channelId:Int!):createMessageResponse!

   
   
}

 
`;
