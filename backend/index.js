const express = require('express');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

aws.config.update({
    region: 'eu-north-1',
    accessKeyId: 'AKIAYS2NSXT626DCPECF',
    secretAccessKey: '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',
});

const dynamodb = new aws.DynamoDB.DocumentClient();

app.use(bodyParser.json());

app.post('/books', upload.single('image'), async (req, res) => {
  const { title, author, description } = req.body;
  const image = req.file.filename;
  const s3 = new aws.S3();
  const params = {
    Bucket: 'books-images-bucket',
    Key: image,
    Body: fs.createReadStream(req.file.path)
  };
  try {
    await s3.upload(params).promise();
    fs.unlinkSync(req.file.path);
    const dbParams = {
      TableName: 'Books',
      Item: {
        id: Date.now(),
        title,
        author,
        description,
        image
      }
    };
    await dynamodb.put(dbParams).promise();
    res.status(201).send('Book added successfully');
  } catch (error){
    console.error('Error adding book:', error);
    res.status(500).send('Error adding book');
  }
});


// Read operation
// Read operation
app.get('/books', async (req, res) => {
  const params = {
    TableName: 'Books'
  };
  try {
    const data = await dynamodb.scan(params).promise();
    const s3 = new aws.S3();
    const books = await Promise.all(data.Items.map(async book => {
      const imageParams = {
        Bucket: 'resized-books-images', // changed bucket name
        Key: book.image
      };
      try {
        const imageData = await s3.getObject(imageParams).promise();
        book.imageData = imageData.Body.toString('base64');
        return book;
      } catch (error) {
        console.error('Error fetching image:', error);
        return book;
      }
    }));
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Delete operation
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: 'Books',
    Key: {
      id: parseInt(id)
    }
  };
  try {
    await dynamodb.delete(params).promise();
    res.status(200).send('Book deleted successfully');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Error deleting book');
  }
});

// Update operation
app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const params = {
    TableName: 'Books',
    Key: {
      id: parseInt(id)
    },
    UpdateExpression: 'set #desc = :desc',
    ExpressionAttributeNames: {
      '#desc': 'description'
    },
    ExpressionAttributeValues: {
      ':desc': description
    },
    ReturnValues: 'UPDATED_NEW'
  };
  try {
    const data = await dynamodb.update(params).promise();
    res.json(data.Attributes);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).send('Error updating book');
  }
});


// Create operation for Articles
app.post('/articles', async (req, res) => {
  const { title, author, abstract, journal } = req.body;
  const params = {
      TableName: 'Articles',
      Item: {
          id: Date.now(),
          title,
          author,
          abstract,
          journal
      }
  };
  try {
      await dynamodb.put(params).promise();
      res.status(201).send('Article added successfully');
  } catch (error) {
      console.error('Error adding article:', error);
      res.status(500).send('Error adding article');
  }
});

// Read operation for Articles
app.get('/articles', async (req, res) => {
  const params = {
      TableName: 'Articles'
  };
  try {
      const data = await dynamodb.scan(params).promise();
      res.json(data.Items);
  } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).send('Error fetching articles');
  }
});

// Delete operation for Articles
app.delete('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const params = {
      TableName: 'Articles',
      Key: {
          id: parseInt(id)
      }
  };
  try {
      await dynamodb.delete(params).promise();
      res.status(200).send('Article deleted successfully');
  } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).send('Error deleting article');
  }
});

// Update operation for Articles
app.put('/articles/:id', async (req, res) => {
  const { id } = req.params;
  const { abstract } = req.body;
  const params = {
      TableName: 'Articles',
      Key: {
          id: parseInt(id)
      },
      UpdateExpression: 'set #abs = :abs',
      ExpressionAttributeNames: {
          '#abs': 'abstract'
      },
      ExpressionAttributeValues: {
          ':abs': abstract
      },
      ReturnValues: 'UPDATED_NEW'
  };
  try {
      const data = await dynamodb.update(params).promise();
      res.json(data.Attributes);
  } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).send('Error updating article');
  }
});

