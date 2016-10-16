'use strict'

const fs = require('fs'),
      http = require('http'),
      url = require('url'),
      querystring = require('querystring')

const PORT = 30000

/*
   get feed from file or database.
   you need to implement this yourself.
   usually param (optional) is
   {
    count: Number,
    pubDate: Number|String
   }
*/
function getFeed(param, cb) {
  fs.readFile('./dis.json', (error, str)=> {
    if (error) return cb(error, '')
    let data = JSON.parse(str)

    // get count number of
    if (typeof(param.count) !== 'undefined' && param.count >= 0) {
      data.items = data.items.slice(0, parseInt(param.count))
    }

    // filter pubDate
    if (typeof(param.pubDate) !== 'undefined') {
      let date = param.pubDate
      if (typeof(date) === 'string' && isNaN(date)) {
        date = (new Date(date)).getTime()
      } else {
        date = parseInt(date)
      }

      data.items = data.items.filter((d)=> {
        return (d.pubDate && new Date(d.pubDate).getTime() >= date)
      })
    }

    return cb(null, data)
  })
}

function handleRequest(request, response) {
  if (request.url === '/favicon.ico') {
    return response.end()
  }
  const param = querystring.parse(url.parse(request.url).query)
  getFeed(param, (error, data)=> {
    if (error) {
      response.end('{}')
    } else {
      response.end(JSON.stringify(data))
    }
  })
}

// create server
const server = http.createServer(handleRequest)

//Lets start our server
server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
})