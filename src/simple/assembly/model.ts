import { u128, PersistentVector, context} from "near-sdk-as"
import { ONE_NEAR } from "../../utils"
//topic class
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
//comment class
@nearBindgen
export class Comment{
  user:string
  comment:string
  constructor(account:string, comment_:string){
    this.user = account
    this.comment = comment_
  }
}

// variable holds topics and comments within
export const topics = new PersistentVector<Topic>("t")
