export interface Post {
  id: string;
  text: string;
  imagePath: string;
  comments: Array<{
    text: string;
    date: string;
    creatorId: string;
    creatorName: string;
  }>;
  creatorName: string;
  creatorNickname: string;
  creatorId: string;
  date: string;
}
