Here I tried to simulate simple social media.I have used [near-starter-sdk](https://github.com/Learn-NEAR/starter--near-sdk-as) project as template.
You can create topic and people can comment on that it is basic structure but can be extendable such as adding like,emotion,even multimedia if storing is not problem.
I used PersistentVector for storing topics and comments.
Each topic has its comment array and there is one global topic array.
I used context from nearSDK for attached deposit and id of people.


[Loom Video Link](https://www.loom.com/embed/c4a93dc039f74692bb737f7dcc1ec5a6)

**Commands**

Single command was enough for me **"build:release:deploy": "asb && near dev-deploy ./build/release/simple.wasm"**.You can just write **yarn build:release:deploy** and its ready on dev account.
Here some interactions
```javascript
export CONTRACT_F=dev-blabla
export CONTRACT_S=someone.testnet

near view $CONTRACT_F get_topics
near call $CONTRACT_F create_topic '{"name":"testing"}' --accountId $CONTRACT_F
near call $CONTRACT_F add_comment_to_topic '{"topic_name":"testing","comment":"My first comment from dev-blabla"}' --accountId $CONTRACT_F
near call $CONTRACT_F get_comments_on_topic '{"topic_name":"testing"}' --accountId $CONTRACT_S
```

**Functions**

**a-) get_topics**
Function that returns last TOPIC_VIEW_LIMIT topics.
```javascript 
export function get_topics(): Array<Topic> {
  const number_of_topic = min(TOPIC_VIEW_LIMIT, topics.length)
  const starting_idx = topics.length - number_of_topic
  const result = new Array<Topic>(number_of_topic)
  
  for(let i = 0; i < number_of_topic; i++) {
    result[i] = topics[i + starting_idx]
  }
  return result
}
```
**b-) create_topic**
Function to create new topic.
```javascript 
export function create_topic(name:string): void {
  assert(!is_topic_exist(name), "Topic already created!")
  const topic = new Topic(name)
  topics.push(topic)
}
```
**c-) add_comment_to_topic**
Function to create add new comment to existing topic.
```javascript 
export function add_comment_to_topic(topic_name:string,comment:string): void {
  assert(comment.length < MAX_COMMENT_LENGTH_LIMIT,`Comment too long max ${MAX_COMMENT_LENGTH_LIMIT} char!`)
  assert(topics.length > 0 , "There is no topic created yet!")
  assert(is_topic_exist(topic_name),"Topic does not exist!")
  
  const topic_ = find_topic(topic_name)
  assert(!(topic_.is_premium && context.attachedDeposit < ONE_NEAR), "Its a premium topic you need to attach at least 1 near!")
  topic_.add_comment(new Comment(context.sender,comment))
}
```
**d-) get_comments_on_topic**
Function to retrieve last COMMENT_VIEW_LIMIT comment on existing topic.
```javascript 
export function get_comments_on_topic(topic_name:string): Array<Comment> {
  assert(is_topic_exist(topic_name),"Topic does not exist!")
  const topic_ = find_topic(topic_name)

  const number_of_comments = min(COMMENT_VIEW_LIMIT, topic_.comments.length)
  const starting_idx = topic_.comments.length - number_of_comments
  const result = new Array<Comment>(number_of_comments)
  
  for(let i = 0; i < number_of_comments; i++) {
    result[i] = topic_.comments[i + starting_idx]
  }
  return result
}
```


##Classes
We can add more specific data here like date,view count,maybe donation box etc.
```javascript 
@nearBindgen
export class Topic{
  name:string
  comments:PersistentVector<Comment>
  is_premium:boolean
  constructor(t_name:string){
    this.name = t_name
    this.comments = new PersistentVector<Comment>("c")
    this.is_premium = context.attachedDeposit >= ONE_NEAR
  }
  add_comment(comment:Comment): void {
    this.comments.push(comment)
  }
}

@nearBindgen
export class Comment{
  user:string
  comment:string
  constructor(account:string, comment_:string){
    this.user = account
    this.comment = comment_
  }
}
``` 