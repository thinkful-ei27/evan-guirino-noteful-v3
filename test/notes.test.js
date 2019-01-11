'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');
const Note = require('../models/note').default;
const { notes, folders } = require('../db/data');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Notes API tests', function() {
  before(function() {
    console.log('connecting to db and dropping');
    return mongoose
      .connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    console.log('seeding data');
    return Note.insertMany(notes, folders);
  });

  afterEach(function() {
    console.log('dropping data');
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    console.log('disconnecting from db');
    return mongoose.disconnect();
  });

  describe('POST /api/notes', function() {
    it('should create and return a new item when provided valid data', function() {
      const newItem = {
        title: 'The best article about cats ever!',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
        
      };

      let res;
      return chai
        .request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys(
            'id',
            'title',
            'content',
            'createdAt',
            'updatedAt' 
          );
          return Note.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('GET /api/notes/:id', function() {
    it('should return correct note', function() {
      let data;
      return Note.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/notes/${data.id}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(
            'id',
            'title',
            'content',
            'createdAt',
            'updatedAt',
            'folderId'
          );

          //compare db results
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('GET /api/notes', function() {
    it('should return the correct number of notes', function() {
      return Promise.all([
        Note.find(),
        chai.request(app).get('/api/notes')
      ]).then(([data, res]) => {
        expect(res).have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(data.length);
      });
    });
  });

  describe('PUT /api/notes/:id', function() {
    it('should update a note at a given id with the given data', function() {
      const updateNote = {
        title: 'Update test',
        content: 'Update Content'
      };

      return Note.findOne()
        .then(note => {
          updateNote.id = note.id;
          return chai
            .request(app)
            .put(`/api/notes/${note.id}`)
            .send(updateNote);
        })
        .then(res => {
          expect(res).to.have.status(200);

          return Note.findById(updateNote.id);
        })
        .then(note => {
          expect(note.title).to.equal(updateNote.title);
          expect(note.content).to.equal(updateNote.content);
        });
    });
  });

  describe('DELETE /api/notes/:id', function() {
    it('should delete a note by a specific id', function() {
      let note;

      return Note.findOne()
        .then(_note => {
          note = _note;
          return chai.request(app).delete(`/api/notes/${note.id}`);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Note.findById(note.id);
        })
        .then(_note => {
          expect(_note).to.be.null;
        });
    });
  });
});
