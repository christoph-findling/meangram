export interface Post {
  id: string;
  text: string;
  imagePath: string;
  comments: Array<{
    text: string;
    data: string;
    creatorId: string;
    creatorName: string;
  }>;
  creatorName: string;
  creatorNickname: string;
  creatorId: string;
  date: Date;
}
