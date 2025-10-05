export type ForumCategory = 
  | 'new-releases' 
  | 'iso' 
  | 'collections' 
  | 'author-events' 
  | 'reading-challenges' 
  | 'feedback';

export interface Forum {
  id: string;
  category: ForumCategory;
  threadTitle: string;
  authorId: string;
  
  isPinned: boolean;
  isLocked: boolean;
  
  // Stats
  viewCount: number;
  replyCount: number;
  
  // Last activity tracking
  lastPostId?: string;
  lastPostAt?: string;
  
  // Relations
  author?: User;
  posts?: ForumPost[];
  lastPost?: ForumPost;
  
  createdAt: string;
  updatedAt: string;
}

export interface ForumPost {
  id: string;
  threadId: string;
  authorId: string;
  
  postContent: string; // Rich text
  parentPostId?: string; // For nested replies
  
  // Voting
  upvotes: number;
  downvotes: number;
  
  // Moderation
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  
  // Relations
  thread?: Forum;
  author?: User;
  parentPost?: ForumPost;
  replies?: ForumPost[];
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateForumThreadRequest {
  category: ForumCategory;
  threadTitle: string;
  postContent: string;
}

export interface CreateForumPostRequest {
  threadId: string;
  postContent: string;
  parentPostId?: string;
}

export interface UpdateForumPostRequest {
  postContent: string;
}

export interface VoteForumPostRequest {
  postId: string;
  voteType: 'upvote' | 'downvote' | 'remove';
}

export interface ForumThreadListResponse {
  threads: Forum[];
  total: number;
  page: number;
  pageSize: number;
  pinnedThreads?: Forum[];
}

export interface ForumPostListResponse {
  posts: ForumPost[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ForumSearchParams {
  category?: ForumCategory;
  query?: string;
  authorId?: string;
  isPinned?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'recent_activity' | 'newest' | 'most_replies' | 'most_views';
  sortOrder?: 'asc' | 'desc';
}

export const FORUM_CATEGORIES: Record<ForumCategory, { label: string; description: string }> = {
  'new-releases': {
    label: 'New Releases',
    description: 'Discuss upcoming and recently released romantasy books'
  },
  'iso': {
    label: 'In Search Of (ISO)',
    description: 'Looking for specific books or editions'
  },
  'collections': {
    label: 'Collections',
    description: 'Share and discuss your book collections'
  },
  'author-events': {
    label: 'Author Events',
    description: 'Book signings, conventions, and author appearances'
  },
  'reading-challenges': {
    label: 'Reading Challenges',
    description: 'Join or create reading challenges with the community'
  },
  'feedback': {
    label: 'Feedback',
    description: 'Suggestions and feedback for BookHeart'
  }
};

// Import types from other files
import type { User } from './user';

