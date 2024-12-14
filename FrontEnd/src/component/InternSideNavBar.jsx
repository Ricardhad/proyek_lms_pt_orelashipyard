'use client'

import Image from 'next/image'
import Link from 'next/link'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Person, Tablet, Home, Chat, Notifications } from '@mui/icons-material'

export default function InternSideNavBar() {
  return (
    <div className="w-64 min-h-screen bg-gray-50 p-4">
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16 overflow-hidden rounded-full">
          <Image
            src="/placeholder.svg?height=64&width=64"
            alt="Profile"
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
      </div>
      
      <List className="space-y-2">
        <ListItem component={Link} href="/profile" className="hover:bg-gray-100 rounded-lg">
          <ListItemIcon>
            <Person className="text-gray-600" />
          </ListItemIcon>
          <ListItemText 
            primary="Profile" 
            className="text-gray-700"
          />
        </ListItem>

        <ListItem component={Link} href="/materials" className="hover:bg-gray-100 rounded-lg">
          <ListItemIcon>
            <Tablet className="text-gray-600" />
          </ListItemIcon>
          <ListItemText 
            primary="Materials" 
            className="text-gray-700"
          />
        </ListItem>

        <ListItem component={Link} href="/homework" className="hover:bg-gray-100 rounded-lg">
          <ListItemIcon>
            <Home className="text-gray-600" />
          </ListItemIcon>
          <ListItemText 
            primary="Homework" 
            className="text-gray-700"
          />
        </ListItem>

        <ListItem component={Link} href="/chat" className="hover:bg-gray-100 rounded-lg">
          <ListItemIcon>
            <Chat className="text-gray-600" />
          </ListItemIcon>
          <ListItemText 
            primary="Group Chat" 
            className="text-gray-700"
          />
        </ListItem>

        <ListItem component={Link} href="/announcements" className="hover:bg-gray-100 rounded-lg">
          <ListItemIcon>
            <Notifications className="text-gray-600" />
          </ListItemIcon>
          <ListItemText 
            primary="Announcement" 
            className="text-gray-700"
          />
        </ListItem>
      </List>
    </div>
  )
}

