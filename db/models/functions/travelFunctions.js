var computeCheckboxes = function(body) {
  const interested = {}
  const visited = {}

  // split by key
  for (var key in body) {
    const kvs = key.split('[')
    const index = Number(kvs[1][0])
    const item = body[key]

    // interested
    if (kvs[0] === 'interested') {
      // kvs[1][0] is index in the array now (since they are ordered)
      if (Array.isArray(item)) {
        // more than 1 value
        interested[index] = true
      } else {
        // not checked
        interested[index] = false
      }
    }
    
    // visited
    if (kvs[0] === 'visited') {
      // kvs[1][0] is index in the array now (since they are ordered)
      if (Array.isArray(item)) {
        // more than 1 value
        visited[index] = true
      } else {
        // not checked
        visited[index] = false
      }
    }
  }

  return {"interested": interested, "visited": visited}
}

module.exports = {
  computeCheckboxes: computeCheckboxes
}