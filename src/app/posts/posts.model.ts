export interface Post {
    _id? : string,
    title : string,
    image? : File | string,
    content : string,
    userId? : string,
    __v? : number
}