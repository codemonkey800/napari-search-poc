# napari Client Search POC

## Setup

Setup NVM:

- Bash: [nvm](https://github.com/nvm-sh/nvm)
- Fish: [nvm.fish](https://github.com/jorgebucaran/nvm.fish)
- Zsh: [zsh-nvm](https://github.com/lukechilds/zsh-nvm)

Then run:

```sh
# Installs Node.js version defined in `.nvmrc`
nvm install

# Uses project defined Node.js version
nvm use

# Install yarn globally
npm -g install yarn

# Install project dependencies
yarn install
```

## Creating Index Data

Some of the search engines support using a pre-built index. Before starting
the server, you'll need to run:

```sh
scripts/index-data.sh
```

If you want to test the server with [Reddit data](http://files.pushshift.io/reddit/comments/)
for a performance comparison, run:

```sh
DATA_TYPE=reddit scripts/index-data.sh
```

## Dev Mode

To run the server in dev mode, run:

```sh
yarn dev
```

This will start a Next.js server on port 8080. Visit http://localhost:8080 to
see the Search POC page.
