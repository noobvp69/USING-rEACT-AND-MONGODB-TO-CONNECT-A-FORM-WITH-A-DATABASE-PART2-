const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())
app.use(express.json())
const port = 3000;
const MongoClient =require('mongodb').MongoClient
const {ObjectId} = require('mongodb')


const url = 'mongodb://localhost:27017/students';
const dbName = 'students'
let db;
//Connect to MongoDB
MongoClient.connect(url,
    {useNewUrlParser:true,
        useUnifiedTopology:true})
        .then(async client=> {
            console.log('Connected to MongoDB')
            db = client.db(dbName)
       
    // Create Operation
    app.post('/users',async (req,res)=>{
        try{
            const user = req.body;
            const result = await db.collection('users').insertOne(user);
            res.send({ message:'User Created successfully '})
        } catch (err) {
            res.status(500).send({ message: 'Error creating user' })
        }
    })

    app.get('/users', async(req,res)=>{
        try{
            
            const users = await db.collection('users').find().toArray();
            res.send(users)
        } catch (err) {
            res.status(500).send({ message: 'Error fetching users' })
        }
    })
    app.delete('/users/:id',async (req,res)=>{
        try{
            const id = req.params.id
            if(!ObjectId.isValid(id)){
                res.status(400).send({ message:'Invalid ObjectId'})
                return
            }
            const result = await db.collection('users').deleteOne({_id: new ObjectId(id)});
            res.send({ message:'User Deleted successfully '})
        } catch (err) {
            res.status(500).send({ message: 'Error creating user' })
        }
    })
    app.get('/users/:id',async (req,res)=>{
        try{
            const id = req.params.id
            if(!ObjectId.isValid(id)){
                res.status(400).send({ message:'Invalid ObjectId'})
                return
            }
            const user = await db.collection('users').findOne({_id: new ObjectId(id)});
            res.send(user)
        } catch (err) {
            res.status(500).send({ message: 'Error creating user' })
        }
    })
    app.put('/users/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const updates = req.body; 
    
            if (!ObjectId.isValid(id)) {
                res.status(400).send({ message: 'Invalid ObjectId' });
                return;
            }
    
            const result = await db.collection('users').updateOne(
                { _id: new ObjectId(id) },
                { $set: updates }
            );
    
            if (result.matchedCount === 0) {
                res.status(404).send({ message: 'User not found' });
                return;
            }
    
            res.send({ message: 'User updated successfully' });
        } catch (err) {
            res.status(500).send({ message: 'Error updating user' });
        }
    });
  
})

app.listen(port,()=>{
    console.log(`Server running on localhost:${port}`)
})