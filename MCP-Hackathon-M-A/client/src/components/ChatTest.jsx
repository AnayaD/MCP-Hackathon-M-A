import React from 'react'

const ChatTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat Test Page</h1>
        <p className="text-gray-600 mb-6">
          If you can see this page, the routing is working!
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900">Test 1: Basic Display</h3>
            <p className="text-blue-700">This text should be visible</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900">Test 2: Colors</h3>
            <p className="text-green-700">Green text should be visible</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-900">Test 3: Red Text</h3>
            <p className="text-red-700">Red text should be visible</p>
          </div>
        </div>
        <div className="mt-6">
          <a 
            href="/chat" 
            className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-center"
          >
            Go to Chat
          </a>
        </div>
      </div>
    </div>
  )
}

export default ChatTest
