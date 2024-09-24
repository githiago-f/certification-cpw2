if command -v node &> /dev/null; then
    echo "node.js installation found"

    npm i -g yarn
    yarn
    yarn prisma generate
    yarn prisma migrate dev

    node index.js
fi
