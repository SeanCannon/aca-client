Credo Email Verification Service
========

# Setup

* Install node & npm: http://nodejs.org/
* Once it installs, test it out by running

```
$ node -v # should return the version
```

Use the following on the command line to remove the need to use `sudo` when installing npm modules with the global flag ([article with more information](http://howtonode.org/introduction-to-npm)):

```
$ sudo chown -R $USER /usr/local
```  
* note: Depending on how much is in that directory, that command may take a bit of time to run.


### Grab the codebase from Bitbucket

Clone the app (make sure you are added as a collaborator)

```
$ git clone https://yourusername@bitbucket.org/credomobile/emailverificationservice.git
```

### Install the modules

I use Yarn which you can install with homebrew : 

``` 
brew update
brew install yarn
```

With Windows there is an msi file: https://yarnpkg.com

Once Yarn is installed, use it to install the dependencies of the repo: 

``` 
yarn install
```

### MySQL

Install MySQL or MAMP and use PhpMyAdmin to import `/sql/emailDb.createDatabase.sql`


### Redis
The fastest way is probably homebrew:


    brew install redis
    

Follow the instructions the brew installer provides.

For Windows try this: https://github.com/MSOpenTech/redis

Start the redis server in another terminal (or as a daemon)

    redis-server

# Environment
Open `.env.example` and copy all the keys into a new file `.env` and provide values for each key 

# Deployment

Coming soon...


# Testing

### Server-side Unit Tests
If you want to see logs from these tests, you will need to create a `logs` folder like this: 

```
mkdir spec/support/logs
```

Then, run the tests with:

```
npm test
```

### Debugging

To debug with VSCode, add the following JSON: 
  - Use IntelliSense to find out which attributes exist for node debugging
  - Use hover for the description of the existing attributes
  - For further information visit https://go.microsoft.com/fwlink/?linkid=830387

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Tests",
      "type": "node2",
      "request": "launch",
      "program": "${workspaceRoot}/node_modules/.bin/jasmine",
      "cwd": "${workspaceRoot}"
    },
    {
      "name": "Dev",
      "type": "node2",
      "request": "launch",
      "program": "${workspaceRoot}/server/core/runCluster.js",
      "cwd": "${workspaceRoot}"
    },
    {
      "name": "Attach to Process",
      "type": "node2",
      "request": "attach",
      "port": 9229
    }
  ]
}
```

to `./.vscode/launch.json`

### Client-side E2E tests

Coming soon...


### Launch Dev Server

Assuming all the unit tests passed, go ahead and launch the dev server so you can play with the API. This will run a cluster of processes on ports which can be set in `./config/default.js`, or by setting the env variable `CLUSTER_PORTS`. The cluster will be load balanced from a proxy on `MAIN_PORT`. This will help catch bugs that only show up in a clustered environment. 

```
$ npm run dev 
```
