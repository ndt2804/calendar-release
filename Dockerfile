FROM oven/bun:latest

WORKDIR /app

# copy package.json and its lockfile
COPY package.json ./
COPY bun.lockb ./
# install the dependencies
RUN bun install

# copy source file
COPY . .

# run the bot
CMD ["bun", "run", "src/index.ts"]