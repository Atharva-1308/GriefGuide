import React, { useState } from 'react';
import { Users, MessageCircle, Heart, Plus, Clock, User } from 'lucide-react';

interface SupportRoom {
  id: string;
  title: string;
  description: string;
  memberCount: number;
  category: string;
  lastActivity: string;
  isActive: boolean;
}

interface Message {
  id: string;
  user: string;
  message: string;
  time: string;
  isSupport: boolean;
}

const Community: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<SupportRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const supportRooms: SupportRoom[] = [
    {
      id: '1',
      title: 'Loss of a Parent',
      description: 'Support for those who have lost a mother or father',
      memberCount: 1247,
      category: 'Family Loss',
      lastActivity: '2 minutes ago',
      isActive: true
    },
    {
      id: '2',
      title: 'Sudden Loss Support',
      description: 'For those dealing with unexpected loss',
      memberCount: 892,
      category: 'Trauma',
      lastActivity: '5 minutes ago',
      isActive: true
    },
    {
      id: '3',
      title: 'Young Adults (20s-30s)',
      description: 'Grief support for younger adults',
      memberCount: 634,
      category: 'Age Group',
      lastActivity: '12 minutes ago',
      isActive: true
    },
    {
      id: '4',
      title: 'Pet Loss Comfort',
      description: 'Understanding the grief of losing a beloved pet',
      memberCount: 523,
      category: 'Pet Loss',
      lastActivity: '1 hour ago',
      isActive: false
    },
    {
      id: '5',
      title: 'Spouse/Partner Loss',
      description: 'Support for widows and widowers',
      memberCount: 789,
      category: 'Relationship Loss',
      lastActivity: '45 minutes ago',
      isActive: false
    },
    {
      id: '6',
      title: 'First Year of Grief',
      description: 'Navigating the first year after loss',
      memberCount: 445,
      category: 'Recent Loss',
      lastActivity: '3 hours ago',
      isActive: false
    }
  ];

  const sampleMessages: Message[] = [
    {
      id: '1',
      user: 'Sarah M.',
      message: "Today marks 6 months since I lost my mom. Some days are harder than others, but I'm learning to carry the love she gave me.",
      time: '10:30 AM',
      isSupport: false
    },
    {
      id: '2',
      user: 'Michael R.',
      message: "Sarah, I'm so sorry for your loss. The 6-month mark was really hard for me too. You're not alone in this journey. ❤️",
      time: '10:35 AM',
      isSupport: true
    },
    {
      id: '3',
      user: 'Community Helper',
      message: "Reminder: It's okay to have difficult days. Grief isn't linear, and healing takes time. Be gentle with yourself.",
      time: '10:40 AM',
      isSupport: true
    },
    {
      id: '4',
      user: 'Jennifer L.',
      message: "I'm struggling with the holidays coming up. This will be the first Christmas without dad. Any advice on how to cope?",
      time: '11:15 AM',
      isSupport: false
    }
  ];

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send to the server
    setNewMessage('');
    alert('Your message has been shared with the community. Thank you for being part of this supportive space.');
  };

  const joinRoom = (room: SupportRoom) => {
    setSelectedRoom(room);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Support</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with others who understand your journey. Share your story, offer support, 
            and find comfort in knowing you're not alone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Rooms List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Support Rooms</h2>
                <button className="bg-teal-100 text-teal-700 p-2 rounded-lg hover:bg-teal-200 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {supportRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => joinRoom(room)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedRoom?.id === room.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{room.title}</h3>
                      {room.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3">{room.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{room.memberCount} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{room.lastActivity}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {room.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {selectedRoom ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Room Header */}
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedRoom.title}</h2>
                      <p className="text-teal-100 text-sm">{selectedRoom.memberCount} members • {selectedRoom.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm">Active</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {sampleMessages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.isSupport ? 'bg-teal-100' : 'bg-blue-100'
                      }`}>
                        <User className={`h-4 w-4 ${
                          message.isSupport ? 'text-teal-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">{message.user}</span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-6">
                  <div className="flex space-x-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share your thoughts or offer support..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2 rounded-lg hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Send</span>
                    </button>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Please be kind and respectful. This is a safe space for everyone.
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose a Support Room</h3>
                <p className="text-gray-600 mb-6">
                  Select a support room from the list to connect with others who share similar experiences. 
                  Each room is moderated to ensure a safe and supportive environment.
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>All conversations are respectful and supportive</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Moderated by trained grief support volunteers</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <span>Share as much or as little as you're comfortable with</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Community Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Be Kind & Compassionate</h4>
              <p className="text-gray-600">Everyone here is going through their own difficult journey. Treat others with the same kindness you'd want to receive.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Respect Privacy</h4>
              <p className="text-gray-600">Share only what you're comfortable with and respect others' boundaries. What's shared here stays here.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Listen & Support</h4>
              <p className="text-gray-600">Sometimes the best support is simply listening. Your presence and understanding mean more than you know.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;