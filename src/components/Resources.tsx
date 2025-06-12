import React, { useState } from 'react';
import { Book, Video, Users, ExternalLink, Heart, Lightbulb, BookOpen, Globe } from 'lucide-react';

const Resources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('books');

  const books = [
    {
      title: "Option B: Facing Adversity, Building Resilience, and Finding Joy",
      author: "Sheryl Sandberg & Adam Grant",
      description: "A powerful guide to building resilience and finding meaning after loss",
      category: "General Grief"
    },
    {
      title: "It's Okay That You're Not Okay",
      author: "Megan Devine",
      description: "What to do when life is terrible, horrible, no good, very bad",
      category: "General Grief"
    },
    {
      title: "The Grief Recovery Handbook",
      author: "John W. James & Russell Friedman",
      description: "The action program for moving beyond death, divorce, and other losses",
      category: "Recovery"
    },
    {
      title: "Motherless Daughters",
      author: "Hope Edelman",
      description: "The legacy of loss and hope for healing",
      category: "Parent Loss"
    },
    {
      title: "When Children Grieve",
      author: "John W. James, Russell Friedman & Leslie Landon Matthews",
      description: "For adults to help children deal with death, divorce, pet loss, moving, and other losses",
      category: "Child Grief"
    },
    {
      title: "A Grief Observed",
      author: "C.S. Lewis",
      description: "A classic exploration of love, loss, and the search for meaning",
      category: "Spiritual"
    }
  ];

  const onlineResources = [
    {
      name: "What's Your Grief",
      description: "Practical grief support and resources with articles, podcasts, and tools",
      url: "https://whatsyourgrief.com",
      type: "Educational Website"
    },
    {
      name: "Grief Share",
      description: "Support groups and online resources for those grieving",
      url: "https://griefshare.org",
      type: "Support Groups"
    },
    {
      name: "The Dinner Party",
      description: "Community for 20s and 30s grieving a significant loss",
      url: "https://thedinnerparty.org",
      type: "Community"
    },
    {
      name: "Modern Loss",
      description: "Candid conversation about grief in the modern world",
      url: "https://modernloss.com",
      type: "Community"
    },
    {
      name: "Refuge in Grief",
      description: "Supporting you in a grief-illiterate world",
      url: "https://refugeingrief.com",
      type: "Educational"
    },
    {
      name: "The Grief Toolbox",
      description: "Practical tools and resources for navigating grief",
      url: "https://thegrieftoolbox.com",
      type: "Tools & Resources"
    }
  ];

  const professionalSupport = [
    {
      name: "Psychology Today Therapist Finder",
      description: "Find grief counselors and therapists in your area",
      url: "https://psychologytoday.com",
      specialties: ["Individual Therapy", "Group Therapy", "Specialized Grief Counseling"]
    },
    {
      name: "Association for Death Education and Counseling",
      description: "Directory of certified thanatologists and grief counselors",
      url: "https://adec.org",
      specialties: ["Certified Grief Counselors", "Death Education Specialists"]
    },
    {
      name: "National Alliance on Mental Illness (NAMI)",
      description: "Mental health support and resources",
      url: "https://nami.org",
      specialties: ["Support Groups", "Educational Programs", "Advocacy"]
    },
    {
      name: "International Association for Healthcare Communication",
      description: "Resources for healthcare professionals and families",
      url: "https://healthcarecomm.org",
      specialties: ["Family Support", "Healthcare Communication", "End-of-Life Care"]
    }
  ];

  const selfCareResources = [
    {
      title: "Mindfulness and Meditation",
      description: "Apps and resources for mindful grieving",
      items: ["Headspace", "Calm", "Insight Timer", "Ten Percent Happier"]
    },
    {
      title: "Physical Wellness",
      description: "Gentle movement and exercise for grief",
      items: ["Yoga with Adriene", "Walking meditation", "Swimming", "Tai Chi"]
    },
    {
      title: "Creative Expression",
      description: "Art and creativity as healing tools",
      items: ["Art therapy", "Music therapy", "Writing workshops", "Photography"]
    },
    {
      title: "Spiritual Support",
      description: "Faith-based and spiritual resources",
      items: ["Local faith communities", "Spiritual directors", "Meditation groups", "Nature connection"]
    }
  ];

  const categories = [
    { id: 'books', label: 'Helpful Books', icon: Book, color: 'blue' },
    { id: 'online', label: 'Online Resources', icon: Video, color: 'green' },
    { id: 'professional', label: 'Professional Help', icon: Users, color: 'purple' },
    { id: 'selfcare', label: 'Self-Care', icon: Heart, color: 'pink' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      green: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
      pink: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderBooks = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {books.map((book, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{book.title}</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">by {book.author}</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{book.description}</p>
              <span className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                {book.category}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOnlineResources = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {onlineResources.map((resource, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{resource.name}</h3>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">{resource.type}</span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{resource.description}</p>
          <button className="w-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 py-2 px-4 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium">
            Visit Website
          </button>
        </div>
      ))}
    </div>
  );

  const renderProfessionalSupport = () => (
    <div className="space-y-6">
      {professionalSupport.map((resource, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{resource.name}</h3>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{resource.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.specialties.map((specialty, i) => (
              <span key={i} className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                {specialty}
              </span>
            ))}
          </div>
          <button className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 py-2 px-4 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium">
            Find Professionals
          </button>
        </div>
      ))}
    </div>
  );

  const renderSelfCare = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {selfCareResources.map((category, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg">
              <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{category.title}</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{category.description}</p>
          <div className="space-y-2">
            {category.items.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case 'books':
        return renderBooks();
      case 'online':
        return renderOnlineResources();
      case 'professional':
        return renderProfessionalSupport();
      case 'selfcare':
        return renderSelfCare();
      default:
        return renderBooks();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Healing Resources</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Carefully curated resources to support your healing journey. From books and online communities 
            to professional help and self-care practices.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? getColorClasses(category.color)
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${
                    isSelected ? '' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <div className="font-medium text-sm">{category.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {renderContent()}
        </div>

        {/* Inspirational Message */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center">
          <Lightbulb className="h-8 w-8 text-teal-600 dark:text-teal-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Remember: Healing Takes Time</h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Grief is not a problem to be solved, but a process to be experienced. These resources are here 
            to support you on your unique journey. Take what helps and leave what doesn't serve you right now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;