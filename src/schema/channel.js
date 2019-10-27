export default `
type Channel {
    id:Int!
    name: String!
    public:Boolean!
    ownerId:Int!
    
    
  }
 

 
  type createChannelResponse{
    ok:Boolean!
    channel:Channel
    errors:[Error!]
    
}

type addChannelMemberResponse{
    ok:Boolean!
    errors:[Error!]
}

type Query{
     
    allChannels:[Channel!]
    inviteChannels:[Channel!]
    
     
}

type Mutation{

    createChannel(name:String!,public: Boolean=false):createChannelResponse!
    addChannelMember(channelId:Int!, email:String!):addChannelMemberResponse!
   
}

 
`;
