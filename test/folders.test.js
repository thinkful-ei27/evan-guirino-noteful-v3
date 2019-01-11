const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');
const Folder = require('../models/folder');
const { folders } = require('../db/data');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Folder api Tests', function() {
  before(function() {
    console.log('connecting to db and dropping');
    return mongoose
      .connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    console.log('seeding data');
    return Folder.insertMany(folders);
  });

  afterEach(function() {
    console.log('dropping data');
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    console.log('disconnecting from db');
    return mongoose.disconnect();
  });

  describe('GET /api/folders', function() {
    it('should return the correct number of folders', function() {
      return Promise.all([
        chai.request(app).get('/api/folders'),
        Folder.find().sort('name')
      ]).then(([res, dbData]) => {
        console.log(res);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(dbData.length);
      });
    });

    it('should return a list with the correct filds and values', function() {
      return Promise.all([
        Folder.find().sort('name'),
        chai.request(app).get('/api/folders')
      ]).then(([dbData, res]) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(dbData.length);
        res.body.forEach((folder, i) => {
          expect(folder).to.be.a('object');
          expect(folder).to.have.all.keys(
            'id',
            'name',
            'createdAt',
            'updatedAt'
          );
          expect(folder.id).to.equal(dbData[i].id);
          expect(folder.name).to.equal(dbData[i].name);
          expect(new Date(folder.createdAt)).to.eql(dbData[i].createdAt);
          expect(new Date(folder.updatedAt)).to.eql(dbData[i].updatedAt);
        });
      });
    });
  });

  describe('GET /api/folders/:id', function() {
    it('should return correct folder', function() {
      let dbData;

      Folder.findOne()
        .then(_dbData => {
          dbData = _dbData;
          return chai.request(app).get(`/api/folders/${dbData.id}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys(
            'id',
            'name',
            'createdAt',
            'updatedAt'
          );
          expect(res.body.name).to.equal(dbData.name);
          expect(res.body.id).to.equal(dbData.id);
          expect(new Date(res.body.createdAt)).to.eql(dbData.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(dbData.updatedAt);
        });
    });

    it('should respond with a 400 error if ID is invalid', function() {
      return chai
        .request(app)
        .get('/api/folders/NOT-A-VALID-ID')
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });
    it('should respond with a 404 if id does not exist', function() {
      return chai
        .request(app)
        .get('/api/folders/DOESNOTEXIST')
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });

  describe('POST /api/folders', function() {
    it('should create and return a new folder when provided valid data', function() {
      const newFolder = { name: 'new folder' };

      return chai
        .request(app)
        .post('/api/folders')
        .send(newFolder)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys(
            'id',
            'name',
            'createdAt',
            'updatedAt'
          );
          return Folder.findById(res.body.id).then(newFolder => {
            expect(res.body.id).to.equal(newFolder.id);
            expect(res.body.name).to.equal(newFolder.name);
            expect(new Date(res.body.updatedAt)).to.eql(newFolder.updatedAt);
            expect(new Date(res.body.createdAt)).to.eql(newFolder.createdAt);
          });
        });
    });

    it('should return an error when missing "name" field', function() {
      const newFolder = { noName: 'noName' };

      return chai
        .request(app)
        .post('/api/folders')
        .send(newFolder)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res).to.be.a('object');
          expect(res.body.message).to.equal('Missing `name` in request body');
        });
    });
  });
});
