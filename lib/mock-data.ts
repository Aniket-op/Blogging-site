import type { Blog, Category } from './types'

export const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'The Art of Mindful Living in a Fast-Paced World',
    slug: 'art-of-mindful-living',
    excerpt: 'Discovering peace and presence in our daily routines, even when life moves at lightning speed.',
    content: [
      { id: 'b1', type: 'paragraph', content: 'In today\'s world, we are constantly bombarded with notifications, deadlines, and endless to-do lists. The art of mindful living has become not just a luxury, but a necessity for maintaining our mental health and overall well-being.' },
      { id: 'b2', type: 'heading2', content: 'What is Mindful Living?' },
      { id: 'b3', type: 'paragraph', content: 'Mindful living is the practice of bringing our full attention to the present moment, without judgment. It means being aware of our thoughts, feelings, and surroundings as we go about our daily activities.' },
      { id: 'b4', type: 'quote', content: 'The present moment is filled with joy and happiness. If you are attentive, you will see it.', author: 'Thich Nhat Hanh' },
      { id: 'b5', type: 'heading2', content: 'Simple Practices to Start Today' },
      { id: 'b6', type: 'list', items: ['Start your morning with 5 minutes of quiet reflection', 'Practice deep breathing during your commute', 'Take mindful breaks during work hours', 'End your day with gratitude journaling'], ordered: false },
      { id: 'b7', type: 'paragraph', content: 'Remember, mindfulness is not about achieving perfection. It\'s about progress and the gentle return to awareness whenever we notice our minds have wandered.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
    category: 'Lifestyle',
    status: 'published',
    author: 'Admin',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Lessons from My Garden: What Plants Teach Us About Life',
    slug: 'lessons-from-my-garden',
    excerpt: 'A reflection on patience, growth, and the wisdom found in nurturing a garden.',
    content: [
      { id: 'b1', type: 'paragraph', content: 'Every morning, I walk through my garden with a cup of tea in hand. Over the years, this small patch of earth has become my greatest teacher, offering lessons that no book could ever provide.' },
      { id: 'b2', type: 'heading2', content: 'The Lesson of Patience' },
      { id: 'b3', type: 'paragraph', content: 'A seed doesn\'t become a tree overnight. Gardens teach us that some of the most beautiful things in life take time to develop. In our age of instant gratification, this is perhaps the most valuable lesson of all.' },
      { id: 'b4', type: 'divider' },
      { id: 'b5', type: 'heading2', content: 'Embracing the Seasons' },
      { id: 'b6', type: 'paragraph', content: 'Just as gardens go through seasons of growth and dormancy, so do our lives. There are times for planting new ideas, times for nurturing growth, and times for harvesting the fruits of our labor.' },
      { id: 'b7', type: 'quote', content: 'To plant a garden is to believe in tomorrow.', author: 'Audrey Hepburn' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=600&fit=crop',
    category: 'Philosophy',
    status: 'published',
    author: 'Admin',
    createdAt: '2026-01-18T14:30:00Z',
    updatedAt: '2026-01-18T14:30:00Z',
  },
  {
    id: '3',
    title: 'The Power of Morning Routines',
    slug: 'power-of-morning-routines',
    excerpt: 'How starting your day with intention can transform your entire life.',
    content: [
      { id: 'b1', type: 'paragraph', content: 'The way you start your morning sets the tone for your entire day. I learned this lesson the hard way, after years of rushing through mornings feeling stressed and unprepared.' },
      { id: 'b2', type: 'heading2', content: 'My Morning Ritual' },
      { id: 'b3', type: 'list', items: ['Wake up at 5:30 AM', 'Drink a glass of warm water with lemon', '20 minutes of meditation', 'Light stretching or yoga', 'Healthy breakfast', 'Review daily goals'], ordered: true },
      { id: 'b4', type: 'paragraph', content: 'This routine didn\'t happen overnight. I built it gradually, adding one habit at a time over several months. The key is consistency, not perfection.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1489533119213-66a5cd877091?w=1200&h=600&fit=crop',
    category: 'Productivity',
    status: 'published',
    author: 'Admin',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: '4',
    title: 'Finding Joy in Simple Things',
    slug: 'finding-joy-in-simple-things',
    excerpt: 'A reminder that happiness often lies in the ordinary moments we overlook.',
    content: [
      { id: 'b1', type: 'paragraph', content: 'We spend so much time searching for happiness in grand achievements and material possessions that we often miss the joy waiting for us in everyday moments.' },
      { id: 'b2', type: 'heading2', content: 'Simple Joys Worth Noticing' },
      { id: 'b3', type: 'paragraph', content: 'The warmth of sunlight through a window. The sound of rain on the roof. A good conversation with an old friend. These are the treasures that cost nothing but are worth everything.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=600&fit=crop',
    category: 'Lifestyle',
    status: 'published',
    author: 'Admin',
    createdAt: '2026-01-12T16:00:00Z',
    updatedAt: '2026-01-12T16:00:00Z',
  },
  {
    id: '5',
    title: 'The Importance of Family Traditions',
    slug: 'importance-of-family-traditions',
    excerpt: 'How shared rituals strengthen bonds and create lasting memories.',
    content: [
      { id: 'b1', type: 'paragraph', content: 'Family traditions are the threads that weave generations together. They give us a sense of belonging and create memories that last a lifetime.' },
      { id: 'b2', type: 'quote', content: 'Tradition is not the worship of ashes, but the preservation of fire.', author: 'Gustav Mahler' },
      { id: 'b3', type: 'paragraph', content: 'Whether it\'s Sunday dinners, annual trips, or simple bedtime stories, these rituals become the cornerstone of our family identity.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=600&fit=crop',
    category: 'Family',
    status: 'published',
    author: 'Admin',
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z',
  },
  {
    id: '6',
    title: 'Draft: Thoughts on Digital Detox',
    slug: 'thoughts-on-digital-detox',
    excerpt: 'Exploring the benefits of disconnecting from technology.',
    content: [
      { id: 'b1', type: 'paragraph', content: 'This is a work in progress about the importance of taking breaks from our devices...' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop',
    category: 'Technology',
    status: 'draft',
    author: 'Admin',
    createdAt: '2026-01-22T09:00:00Z',
    updatedAt: '2026-01-22T09:00:00Z',
  },
]

export const categories: Category[] = [
  { name: 'Lifestyle', count: 2 },
  { name: 'Philosophy', count: 1 },
  { name: 'Productivity', count: 1 },
  { name: 'Family', count: 1 },
  { name: 'Technology', count: 1 },
]

export function getPublishedBlogs(): Blog[] {
  return mockBlogs.filter(blog => blog.status === 'published')
}

export function getBlogBySlug(slug: string): Blog | undefined {
  return mockBlogs.find(blog => blog.slug === slug)
}

export function getBlogsByCategory(category: string): Blog[] {
  return mockBlogs.filter(blog => blog.category === category && blog.status === 'published')
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
