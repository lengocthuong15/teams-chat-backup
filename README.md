# Microsoft Teams Chat Backup

######This project is forked from: https://github.com/edgraaff/teams-chat-backup

##Enhancement:

I've added more options and feature for easy backup a chat:
- Search user id through user displayname
- Auto search for chat id
- Add the options for
  - Skip download messages: `skipmess`
  - Skip download images: `skipimg`
- Add Darkmode for the final output. Adjust body to center.

##Purpose and output
This project retrieves a full chat history (messages and uploaded files) and renders it as an HTML.

## Requirements

Node.js 10 (or higher). Tested on macOS and Windows, but will most likely run on Linux too.

# Setup

Like any other JS project, clone this repo and run the following command to install dependencies:

```sh
npm install
```

# Run

To backup a chat, run:

```sh
npm run start 
```

To skip download messages, run

```sh
npm run start skipmess
```

To skip download messages and images run

```sh
npm run start skipmess skipimg
```

####This will ask several questions:

**Your display name:** - Your display name. Example: John. If there are similar name in the company, the sugesst list will appear, you just need to re-run the program again with the correct one.

**Friend's display name:** - Friend's display name. Name of the guys that you want to backup chat messages.

**Auth token (JWT)** - this is needed for calling Microsoft Graph APIs.

1. Go to [https://developer.microsoft.com/en-us/graph/graph-explorer](https://developer.microsoft.com/en-us/graph/graph-explorer). At the top right side, under User icon, click it to sign-in.
2. After having logged in, on the right side (where you clicked for login), click on the User's Icon and then click `Consent to permissions`. Enable `Chat.Read` and `User.ReadBasic.All`
3. In the Main Window, you will see multilples tab name like `Request body`, `Request headers`, etc. Click on the tab `Access token` . Copy this value. 

####Note:
- Your name, when first inputed, will be cached, for later use. If you want to clear it. Please remove the folder: `teams-chat-backup\dat\`
- You Access Token (JWT): when first inputed, will be cached for later use

####The out put will be

The exported folder (will be created in the `teams-chat-backup\out\` directory in this project). And the name of sub folder is the name of your friend's displayname.

# Output

An exported chat contains:

* `messages-#####.json`: these are the pages of messages. Page 0000 is the most recent one (pages and messages within are in reverse order).
* `image-#####`: these are images uploaded in the chat
* `index.html`: is the full history rendered into a simple HTML template, referring to the downloaded images. This is the file you want for viewing.

# To Do

* Make an easier way of obtaining a token.
* Add support for bot messages (for example a form).
