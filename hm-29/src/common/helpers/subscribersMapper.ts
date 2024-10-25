import { BlogSubscribersDict, BlogSubscriberType } from "../../features/blogs/types/types";

export function SubscribersMapper(subscribers: BlogSubscriberType[]){
    let subscriberInfo: BlogSubscribersDict = {};
    subscribers.forEach(sub => {
        if(!subscriberInfo[sub.blogId!]){
            subscriberInfo[sub.blogId!] = {
                currentUserSubscriptionStatus: sub.currentUserSubscriptionStatus,
                subscribersCount: Number(sub.subscribersCount)
            }
        }
    });
    return subscriberInfo;
}