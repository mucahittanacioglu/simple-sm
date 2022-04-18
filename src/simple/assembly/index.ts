import { context,logging} from "near-sdk-as"
import {topics,Topic,Comment} from "./model"
import { ONE_NEAR } from "../../utils"
// variable holds topics and comments within


//constants
const TOPIC_VIEW_LIMIT = 10
const COMMENT_VIEW_LIMIT = 10
const MAX_COMMENT_LENGTH_LIMIT = 100

//function returns last topics
export function get_topics(): Array<Topic> {
  

  const number_of_topic = min(TOPIC_VIEW_LIMIT, topics.length)
  const starting_idx = topics.length - number_of_topic
  const result = new Array<Topic>(number_of_topic)
  
  for(let i = 0; i < number_of_topic; i++) {
    result[i] = topics[i + starting_idx]
  }

  return result
}

//function to create topics
export function create_topic(name:string): void {

  assert(!is_topic_exist(name), "Topic already created!")
 
  const topic = new Topic(name)
  topics.push(topic)
}

//function to add comment on topic
export function add_comment_to_topic(topic_name:string,comment:string): void {
  logging.log("Commment: "+comment + ` \nlength: ${comment.length}` )
  assert(comment.length < MAX_COMMENT_LENGTH_LIMIT,`Comment too long max ${MAX_COMMENT_LENGTH_LIMIT} char!`)
  assert(topics.length > 0 , "There is no topic created yet!")
  assert(is_topic_exist(topic_name),"Topic does not exist!")
  const topic_ = find_topic(topic_name)
  assert(!(topic_.is_premium && context.attachedDeposit < ONE_NEAR), "Its a premium topic you need to attach at least 1 near!")
  topic_.add_comment(new Comment(context.sender,comment))
}

//function that returns comments on given topic
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

// function to check whether topic exist
function is_topic_exist(topic_name:string): boolean {
  for(let i = 0; i < topics.length; i++){
    if(topics[i].name == topic_name)
      return true
  }
  return false
}
//function to find specific topic
function find_topic(topic_name:string): Topic {
  for(let i = 0; i < topics.length; i++){
    if(topics[i].name == topic_name)
      return topics[i]
  }
  return new Topic("This should not happen!!")
}