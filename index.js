const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.raopv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        // await client.connect()
        // console.log('connected to database');

        await client.connect();
        const database = client.db('goriberGari');
        const appointmentsCollection = database.collection('appointments');
        const usersCollection = database.collection('services');
        const reviewCollection = database.collection('reviews');
        const ordersCollection = database.collection('orders');

        // Order Post API 
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('hit the api', order);
            const result = await ordersCollection.insertOne(order);
            console.log(result)
            console.log('this is editable comment')
            res.json(result)
        });

        // Order Get API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const order = await cursor.toArray()
            res.json(order);
        })

        //Review Post API
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log('hit the post api', review);

            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.json(result)
            res.send('review post hitted')
        });

        // Review Get API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({})
            const review = await cursor.toArray()
            res.json(review);
        })

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = usersCollection.find({});
            const services = await cursor.toArray();
            res.json(services)
            // res.send(services);
        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await usersCollection.findOne(query);
            res.json(service);
        })

        // post api
        app.post('/services', async (req, res) => {

            console.log('hit the post api')
            res.send('post hitted')

            const service = req.body;
            const result = await usersCollection.insertOne(service);
            console.log(result);
            res.json(result);

        });

        // admin roll secure 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await appointmentsCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await appointmentsCollection.insertOne(user)
            console.log(result);
            res.json(result)
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await appointmentsCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user)
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await appointmentsCollection.updateOne(filter, updateDoc)
            res.json(result)
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running my goriber gari crud server')
})

app.listen(port, () => {
    console.log('Running goriber gari Server on port', port);
})

const [datas, setDatas] = useState({})
{
    datas.map(data => <Data
        data={data}
    >
    </Data>
    )
}