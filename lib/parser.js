const url = require('url');

const queryString = require('querystring');

module.exports = (req) => {

  return new Promise( (resolve, reject) => {

    if( !(req || req.url) ) { reject('connot parse'); }

    req.url = url.parse(req.url);
    req.url.query = queryString.parse(req.url.query);

    if( !req.method.match(/POST|PUT|PATCH/) ) {
      resolve(req);
    }

    let text = '';

    req.on('data', (buffer) => {

      text += buffer.toString();
    });

    req.on('end', () => {

      try{
        req.body = JSON.parese(text);
        resolve(req);
      }
      catch(err)  {reject(err); }
    });


  });
};