const express = require('express')
const morgan = require("morgan")
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


let a = persons.length;
 

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
    response.send('<p>The phonebook has info for '+ a +' people.</p>\n'+ Date())
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const pb = persons.find(pb => pb.id === id)
    if (pb) {
      response.json(pb)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(pb => pb.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
/*     const maxId = phonebook.length > 0
      ? Math.max(...phonebook.map(p => p.id)) 
      : 0 */
    
    const randoId = Math.floor(Math.random() * 11000)
    const pb = request.body
    const duplcateName = persons.find(p => p.name === pb.name)
    
    pb.id = randoId
    
    if (!pb.name) {
    return response.status(400).json({ 
      error: 'Name missing' 
    })
  }
    if (!pb.number) {
    return response.status(400).json({ 
      error: 'Number missing' 
    })
  }

    if (duplcateName !== undefined) {
    return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  }

    const opb = Object.keys(pb)
                      .sort()
                      .reduce(
                          (obj, key) => { 
                                    obj[key] = pb[key]; 
                                      return obj;
                                        }, {})
    
    persons = persons.concat(opb)

    response.json(persons)
  })

const port = process.env.PORT || "8080";
app.listen(port)
console.log(`Server running on port ${port}`)