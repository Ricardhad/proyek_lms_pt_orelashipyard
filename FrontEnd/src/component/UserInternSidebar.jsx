import {List,ListItem,ListItemIcon,ListItemText,Paper,Avatar,Box,} from "@mui/material"
import {Person,Book,Assignment,Chat,Notifications,} from "@mui/icons-material"

function UserInterSidebar() {
  return (
    <Paper
      sx={{
        width: 240,
        minHeight: "100vh",
        borderRadius: 0,
        bgcolor: "grey.100",
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Avatar
          src="/placeholder.svg?height=200&width=200"
          sx={{ width: 80, height: 80 }}
        />
      </Box>
      <List>
        <ListItem button>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Book />
          </ListItemIcon>
          <ListItemText primary="Materials" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Homework" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="Group Chat" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Notifications />
          </ListItemIcon>
          <ListItemText primary="Announcement" />
        </ListItem>
      </List>
    </Paper>
  )
}
export default UserInterSidebar

