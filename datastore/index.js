const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {

    const filePath = exports.dataDir + `/${id}.txt`;
    items[id] = text;

    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        callback(null, { id, text });
      }
    });


  });

};

const readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading files');
    } else {
      var data = _.map(files, (file) => {
        let id = file.split('.txt')[0];
        return { id, text: items[id] };
      });
      callback(null, data);
    }


  });


  //return array of todos on get
  //read dataDir directory (build list)
  //include text field in response / recommended to use message's id for both the id field and the text field
};

exports.readAll = Promise.promisify(readAll);
// exports.readAll = readAll;

exports.readOne = (id, callback) => {
  const text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    // items[id] = text;
    // callback(null, { id, text });

    const filePath = exports.dataDir + `/${id}.txt`;
    items[id] = text;

    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        callback(null, { id, text });
      }
    });

  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    delete items[id];
    const filePath = exports.dataDir + `/${id}.txt`;

    fs.unlink(filePath, (err) => {
      callback(err);
      // if (err) {
      //   // throw ('error deleting file');
      //   callback(err);
      // } else {
      //   callback();
      // }
    });

    // callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data'); // C:/Windows/User/Name/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
