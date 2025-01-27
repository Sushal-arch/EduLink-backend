{
    "version": 2,
    "builds": [
      { "src": "frontend/dist/*", "use": "@vercel/static" },
      { "src": "server.js", "use": "@vercel/node" }
    ],
    "routes": [
      { "src": "/(.*)", "dest": "/frontend/dist/$1" },
      { "src": "/api/(.*)", "dest": "/server.js" }
    ]
  }
  