export interface ChatItem{
  conversation: string;
  companion: string;
  message: Message[];
  status?: boolean;
  typing?: boolean;
}

export interface Message {
  from: string;
  message: string;
}
