# |  Remix Recipe System V.1
###  Welcome to Remix Recipe System Dev team!  😀  

##  

## Overview:

This project aims to create a Node.js API written in TypeScript to serve a mobile application that allows users to “remix” any recipe. The API will scrape the website provided by the user and save the scraped recipe to a database, associating it with the user. Users can choose from several different “remix” options, such as making the recipe gluten-free, dairy-free, vegan, vegetarian, keto, or paleo. These options will utilize the OpenAI API to request that the recipe be remixed for the given command. Users can login with federated login using Auth0 as the auth provider. The API will be hosted on AWS and will utilize RDS with Aurora.

## Functionality:

1.  Recipe Scraping: The API will scrape the website provided by the user and save the scraped recipe to a database, associating it with the user. The scraping component will be provided. The recipe will have two parts: ingredients and instructions.
    
2.  Recipe Remixing: Once the app has scraped and saved the recipe, the user can choose from several different “remix” options. Those options include:
    
- Make it Gluten Free (Please take the following recipe and make it gluten-free. [insert recipe here])
- Make it Dairy Free (Please take the following recipe and make it dairy-free. [insert recipe here])
- Make it Vegan (Please take the following recipe and make it Vegan. [insert recipe here])
- Make it Vegetarian (Please take the following recipe and make it Vegetarian. [insert recipe here])
- Make it Keto (Please take the following recipe and make it Keto. [insert recipe here])
- Make it Paleo (Please take the following recipe and make it Paleo. [insert recipe here])

These options will utilize OpenAI API and prompt the API with the ingredients and instructions to request that the recipe be remixed for the given command. OpenAI API will return a “remixed” version that the user selected and it will be saved as a version of the recipe as remixed by the user. Users can select versions of the recipe to view in case they want to jump back to a different version.

3.  Authentication: Users can login with a federated login such as Twitter, Apple, etc. using Auth0 as the auth provider.
    

## API Sepcification:

1.  `GET /recipes/feed`:

- Retrieves all the recipes for all users in a "feed" format.
- Returns details about a recipe such as title, original author, remix author, like count, image, and recipe ID.

2.  `POST /recipes/:id/like`:

- Allows a user to "like" or "unlike" a recipe.
- Requires authentication.

3.  `GET /recipes/me`:

- Retrieves all recipes for the current user.
- Returns details about a recipe such as title, original author, like count, image, and recipe ID.
- Requires authentication.

4.  `GET /recipes/:id`:

- Retrieves a specific recipe and its details.
- Returns details about a recipe such as title, author, like count, image, recipe ID, ingredients list, instructions list, original author, history list (vegan version, dairy free version, etc.).

5.  `POST /recipes/parse`:

- Takes in a URL and uses the scraping code to scrape the recipe into its two parts and save it to the database.
- Returns a success status if the recipe is scraped and saved successfully.

6.  `POST /recipes/:id/remix`:

-   Allows the user to remix a recipe.
-   Takes in the id of the recipe and the remix type (make it vegan, make it dairy free, etc.) and uses the OpenAI API to request that the recipe be remixed for the given command.
- Saves the remixed recipe to the database and returns a success status.

Authentication:

- All endpoints requiring authentication will use Auth0 for federated login.

Data Model:

https://dbdiagram.io/d/63cd5d26296d97641d7b4b84

5.  Hosting: The API will be hosted on AWS and will utilize RDS with Aurora.

## Technologies:

- Node.js
- TypeScript
- OpenAI API
- Auth0
- AWS
- RDS with Aurora

####  Make sure to read all the guidelines before start working


## | Index: 
1. Installing and Running the Application
2. Contribution rules

## 1. Installing and Running The App On Your Machine

1.1.  Open the terminal, go to the folder where you want **remix** repository to be installed and run:
`git clone https://github.com/shubhamcommits/remix.git`

1.2.  Make sure you have **[nodejs](https://nodejs.org/en/download/)** installed in your system along with any package manager or your choice([npm](https://nodejs.org/en/download/) or [yarn](https://classic.yarnpkg.com/en/docs/install/))

1.3.  Go to `remix/` folder and run `npm install` or `yarn install` to install the dependencies of the application (one time activity)

1.4.  Please make sure you have an environment file with a name `.env` with the following variables to initiliase the environment variables

```
# Application Environment Details
HOST=0.0.0.0
PORT=3000
NODE_ENV=development
CLUSTER=false

# Database Details
DB_HOST='DB_HOST'
DB_HOST='DB_HOST'
DB_PASS='DB_PASS'
DB_PORT=3306
DB_NAME='DB_NAME'
MAX_POOL=5
MIN_POOL=1

# Auth0 Details
AUTH0_BASE_URL='AUTH0_BASE_URL'
AUTH0_DOMAIN='AUTH0_DOMAIN'
AUTH0_CLIENT_ID='AUTH0_CLIENT_ID'
AUTH0_CLIENT_SECRET='AUTH0_CLIENT_SECRET'
AUTH0_ISSUER_URL='AUTH0_ISSUER_URL'

# OpenAI Details
OPEN_AI_SECRET_KEY='OPEN_AI_SECRET_KEY'
OPEN_AI_ADA_MODEL='text-ada-001'
OPEN_AI_DAVINCI_MODEL='text-davinci-003'

# AWS Details
AWS_ACCESS_KEY='AWS_ACCESS_KEY'
AWS_SECRET_KEY='AWS_SECRET_KEY'
```

1.5.  Fire up a new terminal and go to `remix/` and run `npm run dev` or `yarn run dev`, and your server application shall start up on port `4000`

1.6. For easier understanding of the APIs, I have also attached the `Remix.postman_collection.json` collection for the reference

---


## 2. Contribution Rules


2.1.    Never work on `master` branch!

2.2.    Always branch out the latest necessary code from `development` branch!

2.3.    Once your PR is merged to `development` is merged, make sure to raise another PR from `development` to `master`

2.4.    Create a new branch for each set of related bugs or set of related tasks, naming by:
    
`type_CapitalizedName`, example: `bugfix_EditPostContent`.


*(**types:** `bugfix`, `feature`, `release`, `hotfix`)*


**💻 command:** `git checkout -b bugfix_FormatPostContent`


**⚠️ Important:**

*  Before creating a branch, check if someone already started to work on this task and if there's already a branch created for this task, and if there is, **please fetch the branch with the command**:

**💻 command:** `git fetch origin bugfix_FormaPostContent:bugfix_FormatPostContent`

* Right after creating a new branch, push it to remote to make it available for everyone, defining the upstream.

**💻 command:** `git push -u origin bugfix_FormatPostContent`


2.5.    Everyday BEFORE start working, pull the remote branch updates to your local branch.


**⚠️ Important:** *make sure you're on the correct branch...*

**💻 command:** `git checkout bugfix_FormatPostContent`

*... and run ...*

**💻 command:** `git pull`


2.6.    Everyday AFTER resume working, push your local branch updates to remote branch.


**⚠️ Important:** *make sure you're on the correct branch...*

**💻 command:** `git checkout bugfix_FormatPostContent`

*... and run ...*

**💻 command:** `git push`


### *"... Ok! ... I've finished the task, what now? ..."* 


#### *⚠️ ...Please follow these rules to have your work ready to deploy:*

##  

#### *1. Update your local `development` branch and rebase the branch you was working:*

##  

1.1. Checkout to development:

`git checkout development`

1.2. Pull the updates:

`git pull`

1.3. Checkout to the branch you was working on:

`git checkout bugfix_FormatPostContent`

1.4. Rebase this branch:

`git rebase development`


**⚠️ Important:** 

*If there are more people working on this branch, let them know you're rebasing.*

*Conflicts may occur, and it must be resolved on this branch!*

*The developer is responsible to resolve conflicts and test it on the current branch to make sure the branch is ready and safe to be merged!*

##  


#### 2. Test the app and start your work again!

##  


#### 3. Go to GitHub and open a Pull Request, the admin will finish the job!

##  


**⚠️ Important:** 

*Let people know you're opening this pull request.*


**⚠️ Tip:** 

If you finished working on this branch forever, and you've noticed that the branch was  already closed on remote, it makes sense to delete this branch locally:

`git branch -d bugfix_FormatPostContent`


### Are you going back to work on a branch you've created some time ago? Let's make it ready to work again!


#### 1. Make sure your `master` branch is updated:

`git checkout master`

`git pull`


#### 2. Update this branch you're gonna work (someone could've been working on this branch):

`git checkout feature_ThatOldFeature`

`git pull`


#### 3. Rebase the branch you're getting back to work:

`git checkout feature_ThatOldFeature`

`git rebase master`


**⚠️ Important:** 

*If there are more people working on this branch, let them know you're rebasing.*

*Conflicts may occur, and it must be resolved right now, before you get back working on the feature!*


#### 4. Push this updated branch state to remote:

`git push`

#### *... and then you're good to go!*

---


