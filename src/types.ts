/**
 * Types & Interfaces for MyKonten website
 */

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  views: number;
  published: boolean;
  createdAt: string; // ISO String format
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[]; // parsed from tag string or array
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string; // ISO String format
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  createdAt: string; // ISO String format
}

export interface Stat {
  views: number;
  updatedAt: string;
}
